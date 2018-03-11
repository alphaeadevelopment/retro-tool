import sessionManager from '../../session';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  sessionManager.upVoteResponse(socket.id, responseId);
  socket.emit('upVoteRegistered', { responseId });
  const { name, sessionId } = sessionManager.getSessionIdAndName(socket.id);

  socket.broadcast.to(sessionId).emit('userVoted', { name });
};
