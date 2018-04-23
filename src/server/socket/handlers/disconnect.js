import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const notifyRoom = (io, sessionId, name) => {
  io.to(sessionId).emit('participantDisconnected', { name });
};
export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.disconnect(connection)
        .then(() => {
          // connectionManager.deregisterSocket(socket.id);
          notifyRoom(io, sessionId, name);
        });
    })
    .catch(e => onError(e));
};
