import sessionManager from '../../session';

export default (io, socket) => ({ responseType, value }) => { // eslint-disable-line no-unused-vars
  const sessionId = sessionManager.getSessionId(socket.id);
  const newResponse = sessionManager.addResponse(socket.id, responseType, value);

  io.to(sessionId).emit('responseAdded', newResponse);
};
