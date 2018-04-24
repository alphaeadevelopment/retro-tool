import has from 'lodash/has';
import generate from 'shortid';

import socketManager from './socket-manager';
import dao from './session-dao';
import newSession from './new-session';

class SessionManager {
  newSessionId = () => dao.next('sessionId')
    .then(r => `${r}`);
  getOwner = sessionId => new Promise((res, rej) => {
    dao.getSession(sessionId)
      .then((session = {}) => {
        res(session.owner);
      })
      .catch(e => rej(e));
  });
  createSession = (sessionId, socket, owner) => new Promise((res, rej) => {
    const session = newSession(sessionId, owner);
    dao.save(session)
      .then((saved) => {
        socketManager.saveSocket(owner, socket);
        res(saved);
      })
      .catch(e => rej(e));
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
  getNextOwner = sessionId => dao.getMostRecentNonOwnerParticipant(sessionId);
  setNewOwner = (sessionId, name) => dao.setOwner(sessionId, name)

  sessionExists = sessionId => new Promise((res, rej) => {
    dao.sessionExists(sessionId)
      .then(r => res(r))
      .catch(e => rej(e));
  })
  joinSession = (socket, name, sessionId) =>
    this.getSession(sessionId)
      .then((session) => {
        if (has(session.participants, name)) {
          throw new Error('name in use');
        }
        else {
          const newParticipant = {
            id: name,
            name,
            votes: 0,
            connected: true,
            joinedAt: Date.now(),
          };
          return dao.addParticipant(sessionId, newParticipant)
            .then((updated) => {
              socketManager.saveSocket(name, socket);
              return updated;
            });
        }
      });
  getSession = sessionId => dao.getSession(sessionId)
  leaveSession = ({ name, sessionId }) => new Promise((res, rej) => {
    dao.removeParticipant(sessionId, name)
      .then(() => {
        socketManager.removeSocket(name);
        res(sessionId);
      })
      .catch(e => rej(e));
  });
  disconnect = ({ name, sessionId }) => new Promise((res, rej) => {
    socketManager.removeSocket(name);
    if (name) {
      dao.participantDisconnected(sessionId, name)
        .then(() => res())
        .catch(e => rej(e));
    }
    else res();
  });
  reconnect = ({ sessionId, name }, socket) => new Promise((res, rej) => {
    if (!name && !sessionId) rej(new Error('unknown token'));
    dao.participantReconnected(sessionId, name)
      .then((updatedSession) => {
        socketManager.saveSocket(name, socket);
        res(updatedSession);
      })
      .catch(e => rej(e));
  })
  addResponseType = ({ sessionId }, data) => new Promise((res, rej) => {
    const id = generate();
    const { question, ...rest } = data;
    const newResponseType = { id, title: question, ...rest };
    dao.addResponseType(sessionId, newResponseType)
      .then(() => res(newResponseType))
      .catch(e => rej(e));
  })
  addResponse = ({ name, sessionId }, responseType, value) => new Promise((res, rej) => {
    const id = generate();
    const newResponse = {
      id, author: name, response: value, responseType, votes: [],
    };
    dao.addResponse(sessionId, newResponse)
      .then(updatedSession => res(updatedSession.responses[id]))
      .catch(e => rej(e));
  });
  upVoteResponse = ({ sessionId, name }, responseId) => new Promise((res, rej) => {
    dao.upVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
  });
  cancelUpVoteResponse = ({ name, sessionId }, responseId) => new Promise((res, rej) => {
    dao.cancelUpVoteResponse(sessionId, responseId, name)
      .then(() => res())
      .catch(e => rej(e));
  });
  deleteResponse = ({ sessionId }, responseId) => new Promise((res, rej) => {
    dao.deleteResponse(sessionId, responseId)
      .then(() => res())
      .catch(e => rej(e));
  });
  deleteResponseType = ({ sessionId }, responseTypeId) => new Promise((res, rej) => {
    dao.deleteResponseType(sessionId, responseTypeId)
      .then(() => res())
      .catch(e => rej(e));
  });
  setStatus = ({ sessionId }, status) => new Promise((res, rej) => {
    dao.setStatus(sessionId, status)
      .then(updatedSession => res(updatedSession))
      .catch(e => rej(e));
  })
  addFeedback = ({ sessionId }, responseId, message) => new Promise((res, rej) => {
    dao.addFeedback(sessionId, responseId, message)
      .then((updated) => {
        res(updated.responses[responseId]);
      })
      .catch(e => rej(e));
  })
  savePdfData = ({ sessionId, data }) => new Promise((res, rej) => {
    dao.savePdfData(sessionId, data)
      .then(() => {
        res();
      })
      .catch(e => rej(e));
  })
}

export default new SessionManager();
