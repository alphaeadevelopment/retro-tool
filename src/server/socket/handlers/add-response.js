import sessionManager from '../../session';

const notifySessionOwner = (toSessionOwner, newResponse) => toSessionOwner('responseAdded', { response: newResponse });

const confirmToUser = (toSocket, newResponse) => toSocket('responseAdded', { response: newResponse });

export default ({ getConnection, toSocket, toSessionOwner }) => ({ responseType, value }) => {
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.addResponse(connection, responseType, value)
        .then(newResponse => Promise.all([
          confirmToUser(toSocket, newResponse),
          notifySessionOwner(toSessionOwner(sessionId), newResponse),
        ]));
    });
};
