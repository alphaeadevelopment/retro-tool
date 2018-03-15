import socketManager from '../../session/socket-manager';
import emitError from './emit-error';

const sessionManager = require('../../session').default;
const { connectionManager } = require('../../session');

export default (io, socket) => ({ responseId, message }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  return new Promise((res, rej) => {
    connectionManager.getConnection(socket.id)
      .then((connection) => {
        sessionManager.addFeedback(connection, responseId, message)
          .then((response) => {
            const authorSocket = socketManager.getSocket(response.author);
            authorSocket.emit('feedbackReceived', { responseId, message });
            socket.emit('feedbackReceived', { responseId, message });
            res();
          })
          .catch((e) => {
            onError(e);
            rej(e);
          });
      })
      .catch(e => onError(e));
  });
};
