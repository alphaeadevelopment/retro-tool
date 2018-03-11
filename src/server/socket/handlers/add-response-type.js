import sessionManager from '../../session';

export default (io, socket) => ({ question, type }) => { // eslint-disable-line no-unused-vars
  const newResponseType = sessionManager.addResponseType(socket.id, question, type);
  const sessionId = sessionManager.getSessionId(socket.id);

  io.to(sessionId).emit('responseTypeAdded', { responseType: newResponseType });
};
