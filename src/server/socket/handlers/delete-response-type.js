import sessionManager from '../../session';

const notifySession = (toRoom, responseTypeId) => toRoom('responseTypeDeleted', { responseTypeId }, true);

export default ({ getConnection, toRoom }) => ({ responseTypeId }) =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.deleteResponseType(connection, responseTypeId)
        .then(() =>
          notifySession(toRoom(sessionId), responseTypeId));
    });

