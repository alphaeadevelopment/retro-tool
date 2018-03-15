import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  return connectionManager.getConnection(socket.id)
    .then((connection) => {
      sessionManager.addResponseType(connection, data)
        .then((newResponseType) => {
          const sessionId = sessionManager.getSessionId(socket.id);
          io.to(sessionId).emit('responseTypeAdded', { responseType: newResponseType });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
