import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const confirmToUser = (socket, responseId, name) => {
  socket.emit('upVoteCancelled', { responseId, name });
};
const notifyRoom = (socket, sessionId, name) => {
  socket.broadcast.to(sessionId).emit('userUnvoted', { name });
};

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then(connection => sessionManager.cancelUpVoteResponse(connection, responseId)
      .then(() => {
        const { sessionId, name } = connection;
        confirmToUser(socket, responseId, name);
        notifyRoom(socket, sessionId, name);
      }))
    .catch(e => onError(e));
};
