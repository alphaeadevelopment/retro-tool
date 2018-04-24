import sessionManager, { connectionManager } from '../../session';
import toSocket from './to-socket';

export default socket => (sessionId) => {
  const getOwnerSocket = () => connectionManager.getConnection(socket.id)
    .then(connection =>
      sessionManager.isOwner(connection)
        .then((isOwner) => {
          if (!isOwner) {
            return sessionManager.getOwnerSocket(sessionId)
              .then(ownerSocket => ({ isOwner, ownerSocket }));
          }
          return ({ isOwner });
        }));
  return (type, payload, sendIfOwner = false) =>
    getOwnerSocket()
      .then(({ isOwner, ownerSocket }) => {
        if (!isOwner) return toSocket(ownerSocket)(type, payload);
        if (sendIfOwner) return toSocket(socket)(type, payload);
        return Promise.resolve();
      });
};
