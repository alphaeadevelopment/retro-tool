import sessionManager from '../../session';

export default (io, socket) => (data) => { // eslint-disable-line no-unused-vars
  const { sessionId, name } = sessionManager.getSessionIdAndName(socket.id);
  sessionManager.disconnect(socket.id)
    .then(() => {
      io.to(sessionId).emit('participantDisconnected', { name });
    });
};
