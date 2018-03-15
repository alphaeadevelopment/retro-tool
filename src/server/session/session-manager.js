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
  getOwner = sessionId => new Promise((res, rej) => {
    dao.getSession(sessionId)
      .then((session = {}) => {
        res(session.owner);
      })
      .catch(e => rej(e));
  })
  createSession = (sessionId, socket, owner, token) => new Promise((res, rej) => {
    this.connections[socket.id] = { name: owner, sessionId };
    const session = newSession(sessionId, owner);
    dao.save(session)
      .then((saved) => {
        socketManager.saveSocket(owner, socket);
        this.tokens = update(this.tokens, { $merge: { [token]: { name: owner, sessionId } } });
        res(saved);
      })
      .catch(e => rej(e));
  })
  getOwnerSocket = sessionId => this.getOwner(sessionId)
    .then(owner => socketManager.getSocket(owner))

  isOwner = (socketId) => {
    const { name, sessionId } = this.getSessionIdAndName(socketId);
    if (!sessionId) return Promise.resolve(false);

    return this.getSession(sessionId)
      .then(session => session.owner === name);
  }
  sessionExists = sessionId => new Promise((res, rej) => {
    dao.sessionExists(sessionId)
      .then(r => res(r))
      .catch(e => rej(e));
  })
  userInSession = socketId => this.connections[socketId] && true
  joinSession = (socket, name, sessionId, token) => new Promise((res, rej) => {
    if (this.userInSession(socket.id)) rej(new Error('already in session'));
    else {
      this.getSession(sessionId).then((session) => {
        if (has(session.participants, name)) {
          rej(new Error('name in use'));
        }
        else {
          this.connections[socket.id] = { name, sessionId };
          const newParticipant = {
            id: name,
            name,
            votes: 0,
            connected: true,
          };
          this.tokens = update(this.tokens, { [token]: { $set: { name, sessionId } } });
          dao.addParticipant(sessionId, newParticipant)
            .then((updated) => {
              socketManager.saveSocket(name, socket);
              res(updated);
            })
            .catch(e => rej(e));
        }
      });
    }
  })
  getName = socketId => this.connections[socketId] && this.connections[socketId].name
  getSessionId = socketId => this.connections[socketId] && this.connections[socketId].sessionId
  getSession = sessionId => dao.getSession(sessionId)
  getSessionFromSocket = socketId => this.getSession(this.getSessionId(socketId))
  getSessionIdAndName = socketId => ((this.connections[socketId]) ? clone(this.connections[socketId]) : {})
  leaveSession = socketId => new Promise((res, rej) => {
    const { name, sessionId } = this.getSessionIdAndName(socketId);
    dao.removeParticipant(sessionId, name)
      .then(() => {
        socketManager.removeSocket(name);
        this.connections = update(this.connections, { $unset: [socketId] });
        res(sessionId);
      })
      .catch(e => rej(e));
  })
  disconnect = socketId => new Promise((res, rej) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    socketManager.removeSocket(name);
    this.connections = update(this.connections, { $unset: [socketId] });
    if (name) {
      dao.participantDisconnected(sessionId, name)
        .then(() => res())
        .catch(e => rej(e));
    }
    else res();
  })
  reconnect = (socket, token) => new Promise((res, rej) => {
    const { name, sessionId } = this.tokens[token] || {};
    if (!name && !sessionId) rej(new Error('unknown token'));
    this.connections[socket.id] = { name, sessionId };
    dao.participantReconnected(sessionId, name)
      .then((updatedSession) => {
        socketManager.saveSocket(name, socket);
        res({ session: updatedSession, name });
      })
      .catch(e => rej(e));
  })
  addResponseType = (socketId, data) => new Promise((res, rej) => {
    const id = generate();
    const sessionId = this.getSessionId(socketId);
    const { question, ...rest } = data;
    const newResponseType = { id, title: question, ...rest };
    dao.addResponseType(sessionId, newResponseType)
      .then(() => res(newResponseType))
      .catch(e => rej(e));
  })
  addResponse = (socketId, responseType, value) => new Promise((res, rej) => {
    const { name, sessionId } = this.getSessionIdAndName(socketId);
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    dao.addResponse(sessionId, newResponse)
      .then(updatedSession => res(updatedSession.responses[id]))
      .catch(e => rej(e));
  })
  upVoteResponse = (socketId, responseId) => new Promise((res, rej) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    dao.upVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
  })
  cancelUpVoteResponse = (socketId, responseId) => new Promise((res, rej) => {
    const { sessionId, name } = this.getSessionIdAndName(socketId);
    dao.cancelUpVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
  })
  setStatus = (socketId, status) => new Promise((res, rej) => {
    const sessionId = this.getSessionId(socketId);
    dao.setStatus(sessionId, status)
      .then(updatedSession => res(updatedSession))
      .catch(e => rej(e));
  })
  addFeedback = (socketId, responseId, message) => new Promise((res, rej) => {
    const sessionId = this.getSessionId(socketId);
    dao.addFeedback(sessionId, responseId, message)
      .then((updated) => {
        res(updated.responses[responseId]);
      })
      .catch(e => rej(e));
  })
}

export default new SessionManager();
