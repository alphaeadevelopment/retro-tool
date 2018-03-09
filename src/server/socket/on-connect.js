import createSession from './create-session';
import joinSession from './join-session';
import leaveSession from './leave-session';
import addResponse from './add-response';

export default io => (socket) => {
  console.log('client connected: %s', socket.id);
  socket.emit('initial', ['one']);
  socket.on('createSession', createSession(io, socket));
  socket.on('joinSession', joinSession(io, socket));
  socket.on('leaveSession', leaveSession(io, socket));
  socket.on('addResponse', addResponse(io, socket));
};
