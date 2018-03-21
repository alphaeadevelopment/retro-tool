import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ responseTypeId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId } = connection;
      sessionManager.deleteResponseType(connection, responseTypeId)
        .then(() => {
          socket.emit('responseTypeDeleted', { responseTypeId });
          io.to(sessionId).emit('responseTypeDeleted', { responseTypeId });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
