import sessionManager from '../../session';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  sessionManager.cancelUpVoteResponse(socket.id, responseId);
  sessionManager.getSessionIdAndName(socket.id)
    .then(({ name, sessionId }) => {
      socket.emit('upVoteCancelled', { responseId, name });
      socket.broadcast.to(sessionId).emit('userUnvoted', { name });
    });
};
