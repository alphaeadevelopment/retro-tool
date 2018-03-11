import sessionManager from '../../session';

export default (io, socket) => ({ responseType, value }) => { // eslint-disable-line no-unused-vars
  const newResponse = sessionManager.addResponse(socket.id, responseType, value);

  socket.emit('responseAdded', { response: newResponse });
  if (!sessionManager.isOwner(socket.id)) {
    const sessionId = sessionManager.getSessionId(socket.id);
    sessionManager.getOwnerSocket(sessionId).emit('responseAdded', { response: newResponse });
  }
};
