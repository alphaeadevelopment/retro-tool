import sessionManager from '../../session';

const confirmToUser = (toSocket, responseId, name) => toSocket('upVoteCancelled', { responseId, name });
const notifyRoom = (toRoom, name) => toRoom('userUnvoted', { name });

export default ({ toRoom, toSocket, getConnection }) => ({ responseId }) =>
  getConnection()
    .then(connection => sessionManager.cancelUpVoteResponse(connection, responseId)
      .then(() => {
        const { name, sessionId } = connection;
        return Promise.all([
          confirmToUser(toSocket, responseId, name),
          notifyRoom(toRoom(sessionId), name),
        ]);
      }));

