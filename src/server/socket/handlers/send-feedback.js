import socketManager from '../../session/socket-manager';
import emitError from './emit-error';

const sessionManager = require('../../session').default;
const { connectionManager } = require('../../session');


const sendFeedbackToAuthor = (socket, response, responseId, message) => {
  const authorSocket = socketManager.getSocket(response.author);
  authorSocket.emit('feedbackReceived', { responseId, message });
  socket.emit('feedbackReceived', { responseId, message });
};

export default (io, socket) => ({ responseId, message }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then(connection =>
      sessionManager.addFeedback(connection, responseId, message)
        .then((response) => {
          sendFeedbackToAuthor(socket, response, responseId, message);
          return Promise.resolve();
        }))
    .catch(onError);
};
