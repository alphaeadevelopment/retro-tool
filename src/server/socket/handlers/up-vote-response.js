import sessionManager from '../../session';

const sendConfirmationToUser = (toSocket, responseId, name) => toSocket('upVoteRegistered', { responseId, name });

const sendConfirmationToRoom = (toSession, name) => toSession('userVoted', { name }, false);

export default ({ getConnection, toSocket, toSession }) => ({ responseId }) =>
  getConnection()
    .then((connection) => {
      const { name, sessionId } = connection;
      return sessionManager.upVoteResponse(connection, responseId)
        .then(() => Promise.all([
          sendConfirmationToUser(toSocket, responseId, name),
          sendConfirmationToRoom(toSession(sessionId), name),
        ]));
    });

