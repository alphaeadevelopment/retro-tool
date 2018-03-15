import update from 'immutability-helper';
import has from 'lodash/has';
import generate from 'shortid';

import socketManager from './socket-manager';
import connectionManager from './connection-manager';
import dao from './session-dao';
import newSession from './new-session';

class SessionManager {
  tokens = {}
  getOwner = sessionId => new Promise((res, rej) => {
    dao.getSession(sessionId)
      .then((session = {}) => {
        res(session.owner);
      })
      .catch(e => rej(e));
  })
  createSession = (sessionId, socket, owner, token) => new Promise((res, rej) => {
    connectionManager.registerSocket(socket.id, owner, sessionId, token)
      .then(() => {
        const session = newSession(sessionId, owner);
        dao.save(session)
          .then((saved) => {
            socketManager.saveSocket(owner, socket);
            this.tokens = update(this.tokens, { $merge: { [token]: { name: owner, sessionId } } });
            res(saved);
          })
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  })
  getOwnerSocket = sessionId => this.getOwner(sessionId)
    .then(owner => socketManager.getSocket(owner))

  isOwner = socketId => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        if (!sessionId) res(false);
        else {
          this.getSession(sessionId)
            .then(session => res(session.owner === name))
            .catch(e => rej(e));
        }
      })
      .catch(e => rej(e));
  });
  sessionExists = sessionId => new Promise((res, rej) => {
    dao.sessionExists(sessionId)
      .then(r => res(r))
      .catch(e => rej(e));
  })
  joinSession = (socket, name, sessionId, token) => new Promise((res, rej) => {
    connectionManager.socketRegistered(socket.id)
      .then((registered) => {
        if (registered) rej(new Error('already in session'));
        else {
          this.getSession(sessionId).then((session) => {
            if (has(session.participants, name)) {
              rej(new Error('name in use'));
            }
            else {
              connectionManager.registerSocket(socket.id, name, sessionId, token)
                .then(() => {
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
                })
                .catch(e => rej(e));
            }
          });
        }
      })
      .catch(e => rej(e));
  });
  getSession = sessionId => dao.getSession(sessionId)
  leaveSession = socketId => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        dao.removeParticipant(sessionId, name)
          .then(() => {
            socketManager.removeSocket(name);
            res(sessionId);
          })
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  });
  disconnect = socketId => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        socketManager.removeSocket(name);
        connectionManager.deregisterSocket(socketId)
          .then(() => {
            if (name) {
              dao.participantDisconnected(sessionId, name)
                .then(() => res())
                .catch(e => rej(e));
            }
            else res();
          })
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  });
  reconnect = (socket, token) => new Promise((res, rej) => {
    connectionManager.getConnectionByToken(token)
      .then(({ sessionId, name }) => {
        if (!name && !sessionId) rej(new Error('unknown token'));
        connectionManager.registerSocket(socket.id, name, sessionId, token)
          .then(() => {
            dao.participantReconnected(sessionId, name)
              .then((updatedSession) => {
                socketManager.saveSocket(name, socket);
                res({ session: updatedSession, name });
              })
              .catch(e => rej(e));
          })
          .catch(e => rej(e));
      });
  })
  addResponseType = (socketId, data) => new Promise((res, rej) => {
    const id = generate();
    connectionManager.getConnection(socketId)
      .then(({ sessionId }) => {
        const { question, ...rest } = data;
        const newResponseType = { id, title: question, ...rest };
        dao.addResponseType(sessionId, newResponseType)
          .then(() => res(newResponseType))
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  })
  addResponse = (socketId, responseType, value) => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        const id = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse)
          .then(updatedSession => res(updatedSession.responses[id]))
          .catch(e => rej(e));
      });
  });
  upVoteResponse = (socketId, responseId) => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        dao.upVoteResponse(sessionId, responseId, name)
          .then(() => res())
          .catch(e => rej(e));
      });
  });
  cancelUpVoteResponse = (socketId, responseId) => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ name, sessionId }) => {
        dao.cancelUpVoteResponse(sessionId, responseId, name)
          .then(() => res())
          .catch(e => rej(e));
      });
  });
  setStatus = (socketId, status) => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ sessionId }) => {
        dao.setStatus(sessionId, status)
          .then(updatedSession => res(updatedSession))
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  })
  addFeedback = (socketId, responseId, message) => new Promise((res, rej) => {
    connectionManager.getConnection(socketId)
      .then(({ sessionId }) => {
        dao.addFeedback(sessionId, responseId, message)
          .then((updated) => {
            res(updated.responses[responseId]);
          })
          .catch(e => rej(e));
      })
      .catch(e => rej(e));
  })
}

export default new SessionManager();
