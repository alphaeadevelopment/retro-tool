import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';


export default (io, socket) => () => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  // TODO get connection
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name } = connection;
      if (name) {
        sessionManager.leaveSession(connection)
          .then((sessionId) => {
            socket.broadcast.to(sessionId).emit('participantLeft', { name });
            socket.leave(sessionId);
            socket.emit('leftSession');
          })
          .catch(e => onError(e));
      }
      else {
        onError({ message: 'not in a session' });
      }
    })
    .catch(e => onError(e));
};
