import sessionManager from '../../session';

export default (io, socket) => () => { // eslint-disable-line no-unused-vars
  const name = sessionManager.getName(socket.id);
  if (name) {
    const sessionId = sessionManager.leaveSession(socket.id);
    socket.broadcast.to(sessionId).emit('participantLeft', name);
    socket.emit('leftSession');
  }
  else {
    console.error('Socket %s not in a session', socket.id);
  }
};
