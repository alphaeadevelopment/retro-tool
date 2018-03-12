import sessionManager, { newSessionId } from '../../session';

export default (io, socket) => ({ name }) => { // eslint-disable-line no-unused-vars
  const sessionId = newSessionId();
  const session = sessionManager.createSession(sessionId, socket, name);
  socket.join(sessionId);
  console.log('%s created session: %s', name, sessionId);
  socket.emit('sessionCreated', { session, name });
};
