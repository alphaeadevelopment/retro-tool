import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';
import emitError from './emit-error';

const joinRoom = (socket, sessionId) => {
  socket.join(sessionId);
};
const sendConfirmationToUser = (socket, session, name) => {
  socket.emit('reconnected', { name, session: modifySession(session, name) });
};
const notifyRoomUserReconnected = (socket, sessionId, name) => {
  socket.to(sessionId).emit('participantReconnected', { name });
};

export default (io, socket) => ({ token }) => { // eslint-disable-line no-unused-vars
  console.log('reconnect with token %s', token);
  const onError = emitError(socket);
  connectionManager.getConnectionByToken(token)
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.reconnect(connection, socket)
        .then((session) => {
          console.log('reconnect %s with session %s; owner is %s', name, sessionId, session.owner);
          return connectionManager.registerSocket(socket.id, name, sessionId)
            .then(() => {
              joinRoom(socket, sessionId);
              sendConfirmationToUser(socket, session, name);
              notifyRoomUserReconnected(socket, sessionId, name);
              return Promise.resolve();
            });
        });
    })
    .catch((e) => {
      if (e.message === 'unknown token') {
        socket.emit('unknownToken', { token });
      }
      else {
        onError(e, { token });
      }
    });
};
