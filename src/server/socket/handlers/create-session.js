import sessionManager, { connectionManager } from '../../session';
import createToken from './create-token';
import newSessionId from './new-session-id';
import emitError from './emit-error';

export default (io, socket) => ({ name }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  const sessionId = newSessionId();
  const token = createToken();
  connectionManager.registerSocket(socket.id, name, sessionId, token)
    .then(() => {
      console.log('Attempt create session owned by %s', name);
      sessionManager.createSession(sessionId, socket, name, token)
        .then((session) => {
          socket.join(sessionId);
          console.log('%s created session: %s', name, sessionId);
          socket.emit('sessionCreated', { session, name, token });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
