import sessionManager from '../../session';

const notifyRoom = (toRoom, name) => {
  toRoom('participantDisconnected', { name }, false);
};
export default ({ toRoom, getConnection }) => () =>
  getConnection()
    .then((connection) => {
      const { sessionId, name } = connection;
      return sessionManager.disconnect(connection)
        .then(() =>
          // connectionManager.deregisterSocket(socket.id);
          notifyRoom(toRoom(sessionId), name),
        );
    });

