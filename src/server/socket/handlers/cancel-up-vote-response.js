import sessionManager from '../../session';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  sessionManager.cancelUpVoteResponse(socket.id, responseId);
  const { name, sessionId } = sessionManager.getSessionIdAndName(socket.id);
  socket.emit('upVoteCancelled', { responseId, name });
  socket.broadcast.to(sessionId).emit('userUnvoted', { name });
};
