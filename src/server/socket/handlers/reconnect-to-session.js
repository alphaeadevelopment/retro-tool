import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';

const sendConfirmationToUser = (toSocket, session, name) =>
  toSocket('reconnected', { name, session: modifySession(session, name) });

const notifyRoomUserReconnected = (toSession, name) => toSession('participantReconnected', { name }, false);

export default ({ joinRoom, emitError, toSocket, toSession }, io, socket) => ({ token }) => { // eslint-disable-line no-unused-vars
  console.log('reconnect with token %s', token);
  return connectionManager.getConnectionByToken(token)
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.reconnect(connection, socket)
        .then((session) => {
          console.log('reconnect %s with session %s; owner is %s', name, sessionId, session.owner);
          return connectionManager.registerSocket(socket.id, name, sessionId)
            .then(() => Promise.all([
              joinRoom(sessionId),
              sendConfirmationToUser(toSocket, session, name),
              notifyRoomUserReconnected(toSession(sessionId), name),
            ]));
        });
    })
    .catch((e) => {
      if (e.message === 'unknown token') {
        return toSocket('unknownToken', { token });
      }
      return emitError(e, { token });
    });
};
