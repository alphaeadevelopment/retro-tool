import sessionManager, { newSessionId } from '../../session';

export default (io, socket) => (owner) => { // eslint-disable-line no-unused-vars
  const sessionId = newSessionId();
  const session = sessionManager.createSession(sessionId, socket, owner);
  socket.join(sessionId);
  console.log('created session: %s', sessionId);
  socket.emit('sessionCreated', { session, name: owner });
};
