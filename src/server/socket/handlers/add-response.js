import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ responseType, value }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId } = connection;
      sessionManager.addResponse(connection, responseType, value)
        .then((newResponse) => {
          socket.emit('responseAdded', { response: newResponse });
          sessionManager.isOwner(connection)
            .then((isOwner) => {
              if (!isOwner) {
                sessionManager.getOwnerSocket(sessionId)
                  .then(ownerSocket => ownerSocket.emit('responseAdded', { response: newResponse }))
                  .catch(e => onError(e));
              }
            })
            .catch(e => onError(e));
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
