import modifySession from './modify-session';
import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name, sessionId } = connection;
      sessionManager.setStatus(connection, status)
        .then((session) => {
          io.to(sessionId).emit('syncSession', { status, session: modifySession(session, name) });
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
