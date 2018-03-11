import sessionManager from '../../session';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  sessionManager.cancelUpVoteResponse(socket.id, responseId);
  socket.emit('upVoteCancelled', { responseId });
  const { name, sessionId } = sessionManager.getSessionIdAndName(socket.id);
  socket.broadcast.to(sessionId).emit('userUnvoted', { name });
};
