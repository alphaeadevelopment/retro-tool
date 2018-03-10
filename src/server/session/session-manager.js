import update from 'immutability-helper';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import has from 'lodash/has';
import without from 'lodash/without';
import clone from 'lodash/clone';
import generate from 'shortid';

const newSession = (id, owner) => ({
  id,
  participants: {},
  owner,
  responses: {
  },
  responseTypes: {
    continue: {
      title: 'What went well?',
    },
    stop: {
      title: 'What did not work well?',
    },
    start: {
      title: 'What could be improved?',
    },
  },
});

class SessionManager {
  ownerSockets = {}
  sessions = {}
  connections = {}
  getSessions = () => keys(this.sessions);
  createSession = (sessionId, socket, owner) => {
    this.connections[socket.id] = { name: owner, sessionId };
    const session = newSession(sessionId, owner);
    this.sessions[session.id] = session;
    this.ownerSockets[session.id] = socket;
    return clone(session);
  }
  getOwnerSocket = sessionId => this.ownerSockets[sessionId]
  isOwner = (socketId) => {
    const sessionId = this.getSessionId(socketId);
    return socketId === this.ownerSockets[sessionId];
  }
  sessionExists = sessionId => includes(keys(this.sessions), sessionId)
  userInSession = socketId => this.connections[socketId] && true
  updateSession = (socketId, spec) => {
    const sessionId = this.getSessionId(socketId);
    this.sessions[sessionId] = update(this.sessions[sessionId], spec);
    const updated = clone(this.sessions[sessionId]);
    return updated;
  }
  joinSession = (socketId, name, sessionId) => {
    if (this.userInSession(socketId)) throw new Error('already in session');
    if (has(this.getSession(sessionId).participants, name)) throw new Error('name in use');
    this.connections[socketId] = { name, sessionId };
    const updated = this.updateSession(socketId, {
      participants: {
        $merge: { [name]: { name } },
      },
    });
    return updated;
  }
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSession = sessionId => clone(this.sessions[sessionId])
  getSessionIdAndName = socketId => this.connections[socketId] && clone(this.connections[socketId])
  leaveSession = (socketId) => {
    const name = this.getName(socketId);
    const updated = this.updateSession(socketId, { participants: { $apply: p => without(p, name) } });
    return updated.id;
  }
  addResponse = (socketId, responseType, value) => {
    const name = this.getName(socketId);
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: 0,
    };
    this.updateSession(
      socketId,
      { responses: { $merge: { [id]: { ...newResponse } } } },
    );
    return newResponse;
  }
  upVoteResponse = (socketId, responseId) => {
    this.updateSession(socketId, {
      responses: {
        [responseId]: {
          votes: {
            $apply: v => v + 1,
          },
        },
      },
    });
  }
  cancelUpVoteResponse = (socketId, responseId) => {
    this.updateSession(socketId, {
      responses: {
        [responseId]: {
          votes: {
            $apply: v => v - 1,
          },
        },
      },
    });
  }
}

export default new SessionManager();
