import sessionManager from '../../session';

const notifyEntireRoom = (toSession, newResponseType) =>
  toSession('responseTypeAdded', { responseType: newResponseType }, true);

export default ({ toSession, getConnection }) => data =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.addResponseType(connection, data)
        .then(newResponseType =>
          notifyEntireRoom(toSession(sessionId), newResponseType));
    });

