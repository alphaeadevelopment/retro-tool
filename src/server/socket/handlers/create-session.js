import sessionManager, { connectionManager } from '../../session';
import createToken from './create-token';
import newSessionId from './new-session-id';
import emitError from './emit-error';

const joinSession = (socket, sessionId) => {
  socket.join(sessionId);
};
const confirmToUser = (socket, session, name, token) => {
  socket.emit('sessionCreated', { session, name, token });
};

export default (io, socket) => ({ name }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  newSessionId()
    .then((sessionId) => {
      const token = createToken();
      return connectionManager.registerSocket(socket.id, name, sessionId, token)
        .then(() =>
          sessionManager.createSession(sessionId, socket, name, token)
            .then((session) => {
              joinSession(socket, sessionId);
              confirmToUser(socket, session, name, token);
            }));
    })
    .catch(onError);
};
