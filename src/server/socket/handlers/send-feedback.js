import sessionManager from '../../session';

const sendFeedbackToAuthor = (toAuthor, response, responseId, message) =>
  toAuthor('feedbackReceived', { responseId, message });

const confirmToSender = (toSocket, responseId, message) => toSocket('feedbackReceived', { responseId, message });

export default ({ getConnection, toSocket, toSessionParticipant }) => ({ responseId, message }) =>
  getConnection()
    .then((connection) => {
      const { sessionId } = connection;
      return sessionManager.addFeedback(connection, responseId, message)
        .then(response => Promise.all([
          sendFeedbackToAuthor(toSessionParticipant(sessionId, response.author), response, responseId, message),
          confirmToSender(toSocket, responseId, message),
        ]));
    });
