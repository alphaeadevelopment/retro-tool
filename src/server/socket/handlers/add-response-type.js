import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const notifyEntireRoom = (io, sessionId, newResponseType) => {
  io.to(sessionId).emit('responseTypeAdded', { responseType: newResponseType });
};

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  return connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.addResponseType(connection, data)
        .then((newResponseType) => {
          notifyEntireRoom(io, sessionId, newResponseType);
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
