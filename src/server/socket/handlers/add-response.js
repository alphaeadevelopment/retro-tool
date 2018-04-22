import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const notifySessionOwner = (connection, newResponse) => {
  const { sessionId } = connection;
  return sessionManager.isOwner(connection)
    .then((isOwner) => {
      if (!isOwner) {
        return sessionManager.getOwnerSocket(sessionId)
          .then(ownerSocket => ownerSocket.emit('responseAdded', { response: newResponse }));
      }
      return Promise.resolve();
    });
};

const confirmToUser = (socket, newResponse) => {
  socket.emit('responseAdded', { response: newResponse });
};

export default (io, socket) => ({ responseType, value }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then(connection => sessionManager.addResponse(connection, responseType, value)
      .then((newResponse) => {
        confirmToUser(socket, newResponse);
        return notifySessionOwner(connection, newResponse);
      }))
    .catch(e => onError(e));
};
