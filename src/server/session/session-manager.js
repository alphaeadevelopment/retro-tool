import update from 'immutability-helper';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import has from 'lodash/has';
import without from 'lodash/without';
import clone from 'lodash/clone';
import generate from 'shortid';

const newSession = (id, owner) => ({
  id,
  status: 'initial',
  participants: {
    [owner]: {
      name: owner,
      votes: 0,
    },
  },
  owner,
  responses: {
  },
  responseTypes: {
    continue: {
      id: 'continue',
      title: 'What went well?',
    },
    stop: {
      id: 'stop',
      title: 'What did not work well?',
    },
    start: {
      id: 'start',
      title: 'What could be improved?',
    },
  },
  sockets: {},
});

class SessionManager {
  ownerSockets = {}
  sessions = {}
  connections = {}
  sockets = {}
  getSessions = () => keys(this.sessions);
  getSocket = (sessionId, name) => this.sessions[sessionId].sockets[name];
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
  joinSession = (socket, name, sessionId) => {
    console.log('adding socket %s to session', socket.id);
    if (this.userInSession(socket.id)) throw new Error('already in session');
    if (has(this.getSession(sessionId).participants, name)) throw new Error('name in use');
    this.connections[socket.id] = { name, sessionId };
    const newParticipant = {
      id: name,
      name,
      votes: 0,
    };
    const updated = this.updateSession(socket.id, {
      participants: {
        $merge: { [name]: newParticipant },
      },
      sockets: {
        [name]: { $set: socket },
      },
    });
    return updated;
  }
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSession = sessionId => clone(this.sessions[sessionId])
  getSessionFromSocket = socketId => this.getSession(this.getSessionId(socketId));
  getSessionIdAndName = socketId => this.connections[socketId] && clone(this.connections[socketId])
  leaveSession = (socketId) => {
    const name = this.getName(socketId);
    const updated = this.updateSession(socketId, { participants: { $apply: p => without(p, name) } });
    return updated.id;
  }
  addResponseType = (socketId, question, type) => {
    const id = generate();
    const newResponseType = { id, title: question, type };
    this.updateSession(socketId, { responseTypes: { $merge: { [id]: newResponseType } } });
    return newResponseType;
  }
  addResponse = (socketId, responseType, value) => {
    const name = this.getName(socketId);
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    this.updateSession(
      socketId,
      { responses: { $merge: { [id]: { ...newResponse } } } },
    );
    return newResponse;
  }
  upVoteResponse = (socketId, responseId) => {
    const name = this.getName(socketId);
    this.updateSession(socketId, {
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
  }
  cancelUpVoteResponse = (socketId, responseId) => {
    const name = this.getName(socketId);
    this.updateSession(socketId, {
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
  }
  setStatus = (socketId, status) => {
    this.updateSession(socketId, {
      status: { $set: status },
    });
  }
  sendFeedback = (socketId, responseId, message) => {
    const updated = this.updateSession(socketId, {
      responses: {
        [responseId]: {
          flagged: { $set: true },
          feedback: { $set: message },
        },
      },
    });
    return updated.responses[responseId];
  }
}

export default new SessionManager();
