import sessionManager from '../../session';
import socketManager from '../../session/socket-manager';

export default (io, socket) => ({ responseId, message }) => { // eslint-disable-line no-unused-vars
  sessionManager.addFeedback(socket.id, responseId, message)
    .then((response) => {
      const authorSocket = socketManager.getSocket(response.author);
      authorSocket.emit('feedbackReceived', { responseId, message });
      socket.emit('feedbackReceived', { responseId, message });
    });
};
