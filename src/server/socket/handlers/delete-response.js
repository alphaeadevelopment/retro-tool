import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const notifySessionOwner = (sessionId, responseId) =>
  sessionManager.getOwnerSocket(sessionId)
    .then(ownerSocket => ownerSocket.emit('responseDeleted', { responseId }));

const confirmToUser = (socket, responseId) => {
  socket.emit('responseDeleted', { responseId });
};

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.deleteResponse(connection, responseId)
        .then(() => {
          confirmToUser(socket, responseId);
          return sessionManager.isOwner(connection)
            .then((isOwner) => {
              if (!isOwner) {
                return notifySessionOwner(sessionId, responseId);
              }
              return Promise.resolve();
            });
        });
    })
    .catch(e => onError(e));
};
