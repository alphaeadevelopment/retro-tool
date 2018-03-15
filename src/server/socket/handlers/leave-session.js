import sessionManager from '../../session';

export default (io, socket) => () => { // eslint-disable-line no-unused-vars
  const name = sessionManager.getName(socket.id);
  if (name) {
    sessionManager.leaveSession(socket.id)
      .then((sessionId) => {
        socket.broadcast.to(sessionId).emit('participantLeft', { name });
        socket.leave(sessionId);
        socket.emit('leftSession');
      });
  }
  else {
    console.error('Socket %s not in a session', socket.id);
  }
};
