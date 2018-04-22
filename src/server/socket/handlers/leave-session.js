import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const notifyRoomThatUserLeft = (socket, sessionId, name) => {
  socket.broadcast.to(sessionId).emit('participantLeft', { name });
};

const leaveRoom = (socket, sessionId) => {
  socket.leave(sessionId);
};
const confirmToUser = (socket) => {
  socket.emit('leftSession');
};

export default (io, socket) => () => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name } = connection;
      if (name) {
        return sessionManager.leaveSession(connection)
          .then(sessionId => connectionManager.deregisterSocket(socket.id)
            .then(() => {
              leaveRoom(socket, sessionId);
              notifyRoomThatUserLeft(socket, sessionId, name);
              confirmToUser(socket);
              return Promise.resolve();
            }));
      }
      onError({ message: 'not in a session' });
      return Promise.resolve();
    })
    .catch(onError);
};
