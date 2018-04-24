import sessionManager from '../../session';

const confirmToUser = (toSocket, responseId, name) => toSocket('upVoteCancelled', { responseId, name });
const notifyRoom = (toSession, name) => toSession('userUnvoted', { name });

export default ({ toSession, toSocket, getConnection }) => ({ responseId }) =>
  getConnection()
    .then(connection => sessionManager.cancelUpVoteResponse(connection, responseId)
      .then(() => {
        const { name, sessionId } = connection;
        return Promise.all([
          confirmToUser(toSocket, responseId, name),
          notifyRoom(toSession(sessionId), name),
        ]);
      }));

