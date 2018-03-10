import update from 'immutability-helper';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import without from 'lodash/without';
import clone from 'lodash/clone';

const newSession = (id, owner) => ({
  id,
  participants: [],
  owner,
  responses: {
    start: [],
    continue: [],
    change: [],
  },
});

class SessionManager {
  sessions = {}
  connections = {}
  getSessions = () => keys(this.sessions);
  createSession = (sessionId, socketId, owner) => {
    this.connections[socketId] = { name: owner, sessionId };
    const session = newSession(sessionId, owner);
    this.sessions[session.id] = session;
    return clone(session);
  }
  sessionExists = sessionId => includes(keys(this.sessions), sessionId)
  userInSession = socketId => this.connections[socketId] && true
  updateSession = (socketId, spec) => {
    const sessionId = this.getSessionId(socketId);
    this.sessions[sessionId] = update(this.sessions[sessionId], spec);
    const session = clone(this.sessions[sessionId]);
    return session;
  }
  joinSession = (socketId, name, sessionId) => {
    this.connections[socketId] = { name, sessionId };
    const updated = this.updateSession(socketId, { participants: { $push: [name] } });
    return updated;
  }
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSessionIdAndName = socketId => this.connections[socketId] && clone(this.connections[socketId])
  leaveSession = (socketId) => {
    const name = this.getName(socketId);
    const updated = this.updateSession(socketId, { participants: { $apply: p => without(p, name) } });
    return updated.id;
  }
  addResponse = (socketId, responseType, value) => {
    const name = this.getName(socketId);
    const newResponse = {
      name, value, responseType,
    };
    this.updateSession(socketId, { responses: { [responseType]: { $push: [newResponse] } } });
    return newResponse;
  }
}

export default new SessionManager();
