import sessionManager from '../../session';
import createToken from './create-token';
import newSessionId from './new-session-id';

export default (io, socket) => ({ name }) => { // eslint-disable-line no-unused-vars
  const sessionId = newSessionId();
  const token = createToken();
  console.log('Attempt create session owned by %s', name);
  sessionManager.createSession(sessionId, socket, name, token)
    .then((session) => {
      socket.join(sessionId);
      console.log('%s created session: %s', name, sessionId);
      socket.emit('sessionCreated', { session, name, token });
    })
    .catch(e => console.error(e));
};
