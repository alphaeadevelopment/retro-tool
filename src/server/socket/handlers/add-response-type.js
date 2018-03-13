import sessionManager from '../../session';

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const newResponseType = sessionManager.addResponseType(socket.id, data);
  const sessionId = sessionManager.getSessionId(socket.id);

  io.to(sessionId).emit('responseTypeAdded', { responseType: newResponseType });
};
