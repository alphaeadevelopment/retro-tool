import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

const sendConfirmationToUser = (socket, responseId, name) => {
  socket.emit('upVoteRegistered', { responseId, name });
};

const sendConfirmationToRoom = (socket, sessionId, name) => {
  socket.broadcast.to(sessionId).emit('userVoted', { name });
};

export default (io, socket) => ({ responseId }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.upVoteResponse(connection, responseId)
        .then(() => {
          sendConfirmationToUser(socket, responseId, name);
          sendConfirmationToRoom(socket, sessionId, name);
          return Promise.resolve();
        });
    })
    .catch(onError);
};
