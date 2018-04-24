import sessionManager, { connectionManager } from '../../session';
import createToken from './create-token';
import newSessionId from './new-session-id';

const confirmToUser = (toSocket, session, name, token) => toSocket('sessionCreated', { session, name, token });

export default ({ toSocket, joinRoom }, io, socket) => ({ name }) => {
  console.log('create new session');
  return newSessionId()
    .then(sessionId =>
      createToken()
        .then((token) => {
          console.log('new token created %s', token);
          return connectionManager.registerSocket(socket.id, name, sessionId, token)
            .then(() =>
              sessionManager.createSession(sessionId, socket, name, token)
                .then(session => Promise.all([
                  joinRoom(sessionId),
                  confirmToUser(toSocket, session, name, token),
                ])));
        }));
};

