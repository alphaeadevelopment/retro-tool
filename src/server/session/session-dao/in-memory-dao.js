import update from 'immutability-helper';
import clone from 'lodash/clone';
import without from 'lodash/without';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import find from 'lodash/find';
import has from 'lodash/has';

class InMemoryDao {
  sessions = {}
  sockets = {}
  sessionExists = sessionId => Promise.resolve(includes(keys(this.sessions), sessionId))
  updateSession = (sessionId, spec) => new Promise((res, rej) => {
    try {
      this.sessions = update(this.sessions, { [sessionId]: spec });
      res(clone(this.sessions[sessionId]));
    }
    catch (e) {
      rej(e);
    }
  })
  save = (session) => {
    this.sessions = update(this.sessions, { $merge: { [session.id]: session } });
    return Promise.resolve(this.sessions[session.id]);
  }
  addParticipant = (sessionId, newParticipant) => this.updateSession(sessionId, {
    participants: {
      $merge: { [newParticipant.name]: newParticipant },
    },
  });
  removeParticipant = (sessionId, name) => this.updateSession(sessionId, { participants: { $unset: [name] } })
  participantDisconnected = (sessionId, name) => this.updateSession(sessionId, {
    participants: { [name]: { connected: { $set: false } } },
  });
  participantReconnected = (sessionId, name) => this.updateSession(sessionId, {
    participants: { [name]: { connected: { $set: true } } },
  });
  addResponseType = (sessionId, newResponseType) => this.updateSession(sessionId, {
    responseTypes: { $merge: { [newResponseType.id]: newResponseType } },
  });
  addResponse = (sessionId, newResponse) => this.updateSession(sessionId,
    { responses: { $merge: { [newResponse.id]: newResponse } } },
  );
  upVoteResponse = (sessionId, responseId, name) => this.updateSession(sessionId, {
    responses: {
      [responseId]: {
        votes: {
          $push: [name],
        },
      },
    },
    participants: {
      [name]: {
        votes: { $apply: v => v + 1 },
      },
    },
  });
  cancelUpVoteResponse = (sessionId, responseId, name) => this.updateSession(sessionId, {
    responses: {
      [responseId]: {
        votes: {
          $apply: v => without(v, name),
        },
      },
    },
    participants: {
      [name]: {
        votes: { $apply: v => v - 1 },
      },
    },
  });
  addFeedback = (sessionId, responseId, message) => this.updateSession(sessionId, {
    responses: {
      [responseId]: {
        flagged: { $set: true },
        feedback: { $set: message },
      },
    },
  });
  setStatus = (sessionId, status) => this.updateSession(sessionId, { status: { $set: status } })
  getSession = sessionId => Promise.resolve(clone(this.sessions[sessionId]))

  registerSocket = (socketId, name, sessionId, token) => new Promise((res) => {
    const entry = { _id: socketId, name, sessionId, token };
    this.sockets = update(this.sockets, { $merge: { [socketId]: entry } });
    res(entry);
  });

  deregisterSocket = socketId => new Promise((res) => {
    this.sockets = update(this.sockets, { $unset: [socketId] });
    res();
  })

  isSocketRegistered = socketId => Promise.resolve(has(this.sockets, socketId))

  getConnection = socketId => Promise.resolve(clone(this.sockets[socketId]));

  getConnectionByToken = token => new Promise((res) => {
    const socketId = find(keys(this.sockets), s => this.sockets[s].token === token);
    res(socketId && clone(this.sockets[socketId]));
  })
  resetAllConnections = () => Promise.resolve()
}
export default new InMemoryDao();
