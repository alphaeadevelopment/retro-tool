import update from 'immutability-helper';
import has from 'lodash/has';
import clone from 'lodash/clone';
import generate from 'shortid';

import socketManager from './socket-manager';
import dao from './dao';
import newSession from './new-session';

class SessionManager {
  connections = {}
  tokens = {}
  getOwner = (sessionId) => {
    const session = dao.getSession(sessionId) || {};
    return session.owner;
  }
  createSession = (sessionId, socket, owner, token) => {
    this.connections[socket.id] = { name: owner, sessionId };
    const session = newSession(sessionId, owner);
    const saved = dao.save(session);
    socketManager.saveSocket(owner, socket);
    this.tokens = update(this.tokens, { $merge: { [token]: { name: owner, sessionId } } });
    return saved;
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
  sessionExists = sessionId => dao.sessionExists(sessionId)
  userInSession = socketId => this.connections[socketId] && true
  joinSession = (socket, name, sessionId, token) => {
    if (this.userInSession(socket.id)) throw new Error('already in session');
    const session = this.getSession(sessionId);
    if (has(session.participants, name)) throw new Error('name in use');
    this.connections[socket.id] = { name, sessionId };
    const newParticipant = {
      id: name,
      name,
      votes: 0,
      connected: true,
    };
    this.tokens = update(this.tokens, { [token]: { $set: { name, sessionId } } });
    const updated = dao.addParticipant(sessionId, newParticipant);
    socketManager.saveSocket(name, socket);
    return updated;
  }
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSession = sessionId => dao.getSession(sessionId)
  getSessionFromSocket = socketId => this.getSession(this.getSessionId(socketId));
  getSessionIdAndName = socketId => ((this.connections[socketId]) ? clone(this.connections[socketId]) : {})
  leaveSession = (socketId) => {
    console.log(socketId);
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    dao.removeParticipant(sessionId, name);
    socketManager.removeSocket(name);
    this.connections = update(this.connections, { $unset: [socketId] });
    return sessionId;
  }
  disconnect = (socketId) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    socketManager.removeSocket(name);
    if (name) {
      dao.participantDisconnected(sessionId, name);
    }
    this.connections = update(this.connections, { $unset: [socketId] });
  }
  reconnect = (socket, token) => {
    const { name, sessionId } = this.tokens[token] || {};
    if (!name && !sessionId) throw new Error('unknown token');
    this.connections[socket.id] = { name, sessionId };
    const updatedSession = dao.participantReconnected(sessionId, name);
    socketManager.saveSocket(name, socket);
    return { session: updatedSession, name };
  }
  addResponseType = (socketId, data) => {
    const id = generate();
    const sessionId = this.getSessionId(socketId);
    const { question, ...rest } = data;
    const newResponseType = { id, title: question, ...rest };
    dao.addResponseType(sessionId, newResponseType);
    return newResponseType;
  }
  addResponse = (socketId, responseType, value) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    const updatedSession = dao.addResponse(sessionId, newResponse);
    return updatedSession.responses[id];
  }
  upVoteResponse = (socketId, responseId) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    dao.upVoteResponse(sessionId, responseId, name);
  }
  cancelUpVoteResponse = (socketId, responseId) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    dao.cancelUpVoteResponse(sessionId, responseId, name);
  }
  setStatus = (socketId, status) => {
    const sessionId = this.getSessionId(socketId);
    return dao.setStatus(sessionId, status);
  }
  addFeedback = (socketId, responseId, message) => {
    const sessionId = this.getSessionId(socketId);
    const updated = dao.addFeedback(sessionId, responseId, message);
    return updated.responses[responseId];
  }
}

export default new SessionManager();
