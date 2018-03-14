import sessionManager from '../../session';
import createToken from './create-token';
import newSessionId from './new-session-id';

export default (io, socket) => ({ name }) => { // eslint-disable-line no-unused-vars
  const sessionId = newSessionId();
  const token = createToken();
  const session = sessionManager.createSession(sessionId, socket, name, token);
  socket.join(sessionId);
  console.log('%s created session: %s', name, sessionId);
  socket.emit('sessionCreated', { session, name, token });
};
