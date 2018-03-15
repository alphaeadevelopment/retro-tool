import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      sessionManager.cancelUpVoteResponse(connection, responseId)
        .then(() => {
          const { sessionId, name } = connection;
          socket.emit('upVoteCancelled', { responseId, name });
          socket.broadcast.to(sessionId).emit('userUnvoted', { name });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
