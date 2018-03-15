import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId, name } = connection;
      sessionManager.upVoteResponse(connection, responseId)
        .then(() => {
          socket.emit('upVoteRegistered', { responseId, name });
          socket.broadcast.to(sessionId).emit('userVoted', { name });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
