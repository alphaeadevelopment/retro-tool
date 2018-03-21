import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';
import emitError from './emit-error';

export default (io, socket) => ({ token }) => { // eslint-disable-line no-unused-vars
  console.log('reconnect with token %s', token);
  const onError = emitError(socket);
  connectionManager.getConnectionByToken(token)
    .then((connection) => {
      const { sessionId, name } = connection;
      sessionManager.reconnect(connection, socket)
        .then((session) => {
          console.log('reconnect %s with session %s; owner is %s', name, sessionId, session.owner);
          connectionManager.registerSocket(socket.id, name, sessionId)
            .then(() => {
              socket.join(sessionId);
              socket.emit('reconnected', { name, session: modifySession(session, name) });
              socket.to(sessionId).emit('participantReconnected', { name });
            })
            .catch(e => onError(e));
        })
        .catch((e) => {
          if (e.message === 'unknown token') {
            socket.emit('unknownToken', { token });
          }
          else {
            onError(e, { token });
          }
        });
    })
    .catch(e => onError(e));
};
