import sessionManager from '../../session';

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  sessionManager.addResponseType(socket.id, data)
    .then((newResponseType) => {
      const sessionId = sessionManager.getSessionId(socket.id);
      io.to(sessionId).emit('responseTypeAdded', { responseType: newResponseType });
    })
    .catch(e => console.error(e));
};
