import sessionManager from '../../session';

const notifySessionOwner = (toSessionOwner, responseId) =>
  toSessionOwner('responseDeleted', { responseId });

const confirmToUser = (toSocket, responseId) => toSocket('responseDeleted', { responseId });

export default ({ toSessionOwner, toSocket, getConnection }) => ({ responseId }) =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.deleteResponse(connection, responseId)
        .then(() => Promise.all([
          confirmToUser(toSocket, responseId),
          notifySessionOwner(toSessionOwner(sessionId), responseId),
        ]));
    });
