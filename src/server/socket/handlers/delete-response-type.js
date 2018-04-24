import sessionManager from '../../session';

const notifySession = (toSession, responseTypeId) => toSession('responseTypeDeleted', { responseTypeId }, true);

export default ({ getConnection, toSession }) => ({ responseTypeId }) =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.deleteResponseType(connection, responseTypeId)
        .then(() =>
          notifySession(toSession(sessionId), responseTypeId));
    });

