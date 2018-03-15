import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId, name } = connection;
      sessionManager.disconnect(connection)
        .then(() => {
          // connectionManager.deregisterSocket(socket.id);
          io.to(sessionId).emit('participantDisconnected', { name });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
