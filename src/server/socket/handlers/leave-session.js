import sessionManager, { connectionManager, socketManager } from '../../session';
import emitError from './emit-error';
import modifySession from './modify-session';

const notifyRoomThatUserLeft = (socket, sessionId, name) => {
  socket.broadcast.to(sessionId).emit('participantLeft', { name });
};

const leaveRoom = (socket, sessionId) => {
  socket.leave(sessionId);
};
const confirmToUser = (socket) => {
  socket.emit('leftSession');
};

const updateWithNewOwner = (io, sessionId, nextOwner) =>
  sessionManager.setNewOwner(sessionId, nextOwner)
    .then((session) => {
      io.to(sessionId).emit('newOwner', { name: nextOwner });
      const ownerSocket = socketManager.getSocket(nextOwner);
      ownerSocket.emit('syncSession', { session: modifySession(session, nextOwner) });
    });

export default (io, socket) => () => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name } = connection;
      if (name) {
        return sessionManager.isOwner(connection)
          .then(isOwner => sessionManager.leaveSession(connection)
            .then(sessionId => connectionManager.deregisterSocket(socket.id)
              .then(() => sessionManager.getNextOwner(sessionId)
                .then((nextOwner) => {
                  leaveRoom(socket, sessionId);
                  notifyRoomThatUserLeft(socket, sessionId, name);
                  confirmToUser(socket);
                  return isOwner && nextOwner && updateWithNewOwner(io, sessionId, nextOwner);
                }))));
      }
      onError({ message: 'not in a session' });
      return Promise.resolve();
    })
    .catch(onError);
};
