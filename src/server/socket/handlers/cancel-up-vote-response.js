import sessionManager from '../../session';

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  sessionManager.cancelUpVoteResponse(socket.id, responseId);
  socket.emit('upVoteCancelled', { responseId });
};
