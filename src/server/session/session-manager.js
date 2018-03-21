import has from 'lodash/has';
import generate from 'shortid';

import socketManager from './socket-manager';
import dao from './session-dao';
import newSession from './new-session';

class SessionManager {
  getOwner = sessionId => new Promise((res, rej) => {
    dao.getSession(sessionId)
      .then((session = {}) => {
        res(session.owner);
      })
      .catch(e => rej(e));
  })
  createSession = (sessionId, socket, owner) => new Promise((res, rej) => {
    // connectionManager.registerSocket(socket.id, owner, sessionId, token)
    //   .then(() => {
    const session = newSession(sessionId, owner);
    dao.save(session)
      .then((saved) => {
        socketManager.saveSocket(owner, socket);
        res(saved);
      })
      .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  })
  getOwnerSocket = sessionId => new Promise((res, rej) => {
    this.getOwner(sessionId)
      .then(owner => res(socketManager.getSocket(owner)))
      .catch(e => rej(e));
  });

  isOwner = ({ name, sessionId }) => new Promise((res, rej) => {
    if (!sessionId) res(false);
    else {
      this.getSession(sessionId)
        .then(session => res(session.owner === name))
        .catch(e => rej(e));
    }
  });
  sessionExists = sessionId => new Promise((res, rej) => {
    dao.sessionExists(sessionId)
      .then(r => res(r))
      .catch(e => rej(e));
  })
  joinSession = (socket, name, sessionId) => new Promise((res, rej) => {
    // connectionManager.socketRegistered(socket.id)
    //   .then((registered) => {
    //     if (registered) rej(new Error('already in session'));
    //     else {
    this.getSession(sessionId)
      .then((session) => {
        if (has(session.participants, name)) {
          rej(new Error('name in use'));
        }
        else {
          // connectionManager.registerSocket(socket.id, name, sessionId, token)
          //   .then(() => {
          const newParticipant = {
            id: name,
            name,
            votes: 0,
            connected: true,
          };
          dao.addParticipant(sessionId, newParticipant)
            .then((updated) => {
              socketManager.saveSocket(name, socket);
              res(updated);
            })
            .catch(e => rej(e));
          // })
          // .catch(e => rej(e));
        }
      })
      .catch(e => rej(e));
    //   }
    // })
    // .catch(e => rej(e));
  });
  getSession = sessionId => dao.getSession(sessionId)
  leaveSession = ({ name, sessionId }) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    dao.removeParticipant(sessionId, name)
      .then(() => {
        socketManager.removeSocket(name);
        res(sessionId);
      })
      .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  });
  disconnect = ({ name, sessionId }) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    socketManager.removeSocket(name);
    // connectionManager.deregisterSocket(socketId)
    //   .then(() => {
    if (name) {
      dao.participantDisconnected(sessionId, name)
        .then(() => res())
        .catch(e => rej(e));
    }
    else res();
    // })
    // .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  });
  reconnect = ({ sessionId, name }, socket) => new Promise((res, rej) => {
    // connectionManager.getConnectionByToken(token)
    //   .then(({ sessionId, name }) => {
    if (!name && !sessionId) rej(new Error('unknown token'));
    // connectionManager.registerSocket(socket.id, name, sessionId, token)
    //   .then(() => {
    dao.participantReconnected(sessionId, name)
      .then((updatedSession) => {
        socketManager.saveSocket(name, socket);
        res(updatedSession);
      })
      .catch(e => rej(e));
    //     })
    //     .catch(e => rej(e));
    // });
  })
  addResponseType = ({ sessionId }, data) => new Promise((res, rej) => {
    const id = generate();
    // connectionManager.getConnection(socketId)
    //   .then(({ sessionId }) => {
    const { question, ...rest } = data;
    const newResponseType = { id, title: question, ...rest };
    dao.addResponseType(sessionId, newResponseType)
      .then(() => res(newResponseType))
      .catch(e => rej(e));
  })
  addResponse = ({ name, sessionId }, responseType, value) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    dao.addResponse(sessionId, newResponse)
      .then(updatedSession => res(updatedSession.responses[id]))
      .catch(e => rej(e));
    // });
  });
  upVoteResponse = ({ sessionId, name }, responseId) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    dao.upVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
    // });
  });
  cancelUpVoteResponse = ({ name, sessionId }, responseId) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    dao.cancelUpVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
    // });
  });
  deleteResponse = ({ sessionId }, responseId) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ name, sessionId }) => {
    dao.deleteResponse(sessionId, responseId)
      .then(() => res())
      .catch(e => rej(e));
    // });
  });
  setStatus = ({ sessionId }, status) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ sessionId }) => {
    dao.setStatus(sessionId, status)
      .then(updatedSession => res(updatedSession))
      .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  })
  addFeedback = ({ sessionId }, responseId, message) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ sessionId }) => {
    dao.addFeedback(sessionId, responseId, message)
      .then((updated) => {
        res(updated.responses[responseId]);
      })
      .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  })
  savePdfData = ({ sessionId, data }) => new Promise((res, rej) => {
    // connectionManager.getConnection(socketId)
    //   .then(({ sessionId }) => {
    dao.savePdfData(sessionId, data)
      .then(() => {
        res();
      })
      .catch(e => rej(e));
    // })
    // .catch(e => rej(e));
  })
}

export default new SessionManager();
