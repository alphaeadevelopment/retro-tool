import update from 'immutability-helper';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import has from 'lodash/has';
import without from 'lodash/without';
import clone from 'lodash/clone';
import generate from 'shortid';

import socketManager from './socket-manager';

const newSession = (id, owner) => ({
  id,
  status: 'initial',
  participants: {
    [owner]: {
      name: owner,
      votes: 0,
      connected: true,
    },
  },
  owner,
  responses: {
  },
  responseTypes: {
    continue: {
      id: 'continue',
      title: 'What went well?',
      allowMultiple: true,
      type: 'text',
    },
    stop: {
      id: 'stop',
      title: 'What did not work well?',
      allowMultiple: true,
      type: 'text',
    },
    start: {
      id: 'start',
      title: 'What could be improved?',
      allowMultiple: true,
      type: 'text',
    },
  },
});

class SessionManager {
  sessions = {}
  connections = {}
  tokens = {}
  getSessions = () => keys(this.sessions);
  getOwner = (sessionId) => {
    const session = this.sessions[sessionId] || {};
    return session.owner;
  }
  createSession = (sessionId, socket, owner, token) => {
    this.connections[socket.id] = { name: owner, sessionId };
    const session = newSession(sessionId, owner);
    this.sessions[sessionId] = session;
    socketManager.saveSocket(owner, socket);
    this.tokens = update(this.tokens, { $merge: { [token]: { name: owner, sessionId } } });
    return clone(session);
  }
  getOwnerSocket = (sessionId) => {
    const owner = this.getOwner(sessionId);
    return socketManager.getSocket(owner);
  }
  isOwner = (socketId) => {
    const { name, sessionId } = this.getSessionIdAndName(socketId);
    const session = sessionId ? this.getSession(sessionId) : {};
    return sessionId ? name === session.owner : false;
  }
  sessionExists = sessionId => includes(keys(this.sessions), sessionId)
  userInSession = socketId => this.connections[socketId] && true
  updateSessionBySocketId = (socketId, spec) => {
    const sessionId = this.getSessionId(socketId);
    return this.updateSession(sessionId, spec);
  }
  updateSession = (sessionId, spec) => {
    this.sessions = update(this.sessions, { [sessionId]: spec });
    return clone(this.sessions[sessionId]);
  }
  joinSession = (socket, name, sessionId, token) => {
    if (this.userInSession(socket.id)) throw new Error('already in session');
    if (has(this.getSession(sessionId).participants, name)) throw new Error('name in use');
    this.connections[socket.id] = { name, sessionId };
    const newParticipant = {
      id: name,
      name,
      votes: 0,
      connected: true,
    };
    this.tokens = update(this.tokens, { [token]: { $set: { name, sessionId } } });
    const updated = this.updateSessionBySocketId(socket.id, {
      participants: {
        $merge: { [name]: newParticipant },
      },
    });
    socketManager.saveSocket(name, socket);
    return updated;
  }
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSession = sessionId => clone(this.sessions[sessionId])
  getSessionFromSocket = socketId => this.getSession(this.getSessionId(socketId));
  getSessionIdAndName = socketId => ((this.connections[socketId]) ? clone(this.connections[socketId]) : {})
  leaveSession = (socketId) => {
    const name = this.getName(socketId);
    const updated = this.updateSessionBySocketId(socketId, { participants: { $unset: [name] } });
    socketManager.removeSocket(name);
    this.connections = update(this.connections, { $unset: [socketId] });
    return updated.id;
  }
  disconnect = (socketId) => {
    const name = this.getName(socketId);
    socketManager.removeSocket(name);
    if (name) {
      this.updateSessionBySocketId(socketId, {
        participants: { [name]: { connected: { $set: false } } },
      });
    }
    this.connections = update(this.connections, { $unset: [socketId] });
  }
  reconnect = (socket, token) => {
    const { name, sessionId } = this.tokens[token] || {};
    if (!name && !sessionId) throw new Error('unknown token');
    this.connections[socket.id] = { name, sessionId };
    const updatedSession = this.updateSession(sessionId, {
      participants: { [name]: { connected: { $set: true } } },
    });
    socketManager.saveSocket(name, socket);
    return { session: updatedSession, name };
  }
  addResponseType = (socketId, data) => {
    const id = generate();
    const { question, ...rest } = data;
    const newResponseType = { id, title: question, ...rest };
    this.updateSessionBySocketId(socketId, { responseTypes: { $merge: { [id]: newResponseType } } });
    return newResponseType;
  }
  addResponse = (socketId, responseType, value) => {
    const name = this.getName(socketId);
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    this.updateSessionBySocketId(
      socketId,
      { responses: { $merge: { [id]: { ...newResponse } } } },
    );
    return newResponse;
  }
  upVoteResponse = (socketId, responseId) => {
    const name = this.getName(socketId);
    this.updateSessionBySocketId(socketId, {
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
    this.updateSessionBySocketId(socketId, {
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
    this.updateSessionBySocketId(socketId, {
      status: { $set: status },
    });
  }
  sendFeedback = (socketId, responseId, message) => {
    const updated = this.updateSessionBySocketId(socketId, {
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
