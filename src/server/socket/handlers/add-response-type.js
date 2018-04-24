import sessionManager from '../../session';

const notifyEntireRoom = (toRoom, newResponseType) =>
  toRoom('responseTypeAdded', { responseType: newResponseType }, true);

export default ({ toRoom, getConnection }) => data =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.addResponseType(connection, data)
        .then(newResponseType =>
          notifyEntireRoom(toRoom(sessionId), newResponseType));
    });

