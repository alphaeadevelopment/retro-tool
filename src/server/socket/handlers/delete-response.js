import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId, name } = connection;
      sessionManager.deleteResponse(connection, responseId)
        .then(() => {
          socket.emit('responseDeleted', { responseId, name });
          sessionManager.isOwner(connection)
            .then((isOwner) => {
              if (!isOwner) {
                sessionManager.getOwnerSocket(sessionId)
                  .then(ownerSocket => ownerSocket.emit('responseDeleted', { responseId }))
                  .catch(e => onError(e));
              }
            })
            .catch(e => onError(e));
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
