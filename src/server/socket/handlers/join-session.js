// import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';
import createToken from './create-token';
import emitError from './emit-error';

const sessionManager = require('../../session').default;
const { connectionManager } = require('../../session');

const joinRoom = (socket, sessionId) => {
  socket.join(sessionId);
};

const notifyRoom = (socket, sessionId, name) => {
  socket.broadcast.to(sessionId).emit('newParticipant', { name });
};

const confirmToUser = (socket, session, name, token) => {
  socket.emit('joinedSession', { token, session: modifySession(session, name), name });
};

export default (io, socket) => ({ name, sessionId }) => {
  const onError = emitError(socket);
  sessionManager.sessionExists(sessionId)
    .then((exists) => {
      if (exists) {
        return connectionManager.socketRegistered(socket.id)
          .then((registered) => {
            if (registered) {
              onError({ message: 'already in session' }, { name, sessionId });
              return Promise.resolve();
            }
            const token = createToken();
            return sessionManager.joinSession(socket, name, sessionId)
              .then(session =>
                connectionManager.registerSocket(socket.id, name, sessionId, token)
                  .then(() => {
                    joinRoom(socket, sessionId);
                    notifyRoom(socket, sessionId, name);
                    confirmToUser(socket, session, name, token);
                    return Promise.resolve();
                  }));
          });
      }
      onError({ message: 'no such session' }, { sessionId });
      return Promise.resolve();
    })
    .catch((e) => {
      onError(e, { name, sessionId });
    });
};
