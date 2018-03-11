import sessionManager from '../../session';

export default (io, socket) => ({ responseId, message }) => { // eslint-disable-line no-unused-vars
  sessionManager.sendFeedback(socket.id, responseId, message);
  const session = sessionManager.getSessionFromSocket(socket.id);

  const response = session.responses[responseId];
  const authorSocket = sessionManager.getSocket(session.id, response.author);
  authorSocket.emit('feedbackReceived', { responseId, message });
  socket.emit('feedbackReceived', { responseId, message });
};
