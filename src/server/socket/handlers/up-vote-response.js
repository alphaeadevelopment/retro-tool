import sessionManager from '../../session';

const sendConfirmationToUser = (toSocket, responseId, name) => toSocket('upVoteRegistered', { responseId, name });

const sendConfirmationToRoom = (toRoom, name) => toRoom('userVoted', { name }, false);

export default ({ getConnection, toSocket, toRoom }) => ({ responseId }) =>
  getConnection()
    .then((connection) => {
      const { name, sessionId } = connection;
      return sessionManager.upVoteResponse(connection, responseId)
        .then(() => Promise.all([
          sendConfirmationToUser(toSocket, responseId, name),
          sendConfirmationToRoom(toRoom(sessionId), name),
        ]));
    });

