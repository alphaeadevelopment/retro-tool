import sessionManager from '../../session';

const notifyRoom = (toSession, name) => {
  toSession('participantDisconnected', { name }, false);
};
export default ({ toSession, getConnection }) => () =>
  getConnection()
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.disconnect(connection)
        .then(() =>
          // connectionManager.deregisterSocket(socket.id);
          notifyRoom(toSession(sessionId), name),
        );
    });

