import sessionManager from '../../session';
import modifySession from './modify-session';
import createToken from './create-token';

export default (io, socket) => ({ name, sessionId }) => {
  return new Promise((res) => {
    sessionManager.sessionExists(sessionId)
      .then((exists) => {
        if (exists) {
          const token = createToken();
          sessionManager.joinSession(socket, name, sessionId, token)
            .then((session) => {
              socket.join(sessionId);
              socket.broadcast.to(sessionId).emit('newParticipant', { name });
              socket.emit('joinedSession', { token, session: modifySession(session, name), name });
              res();
            })
            .catch((e) => {
              socket.emit('applicationError', { message: e.message, parameters: { name, sessionId } });
              res();
            });
        }
        else {
          socket.emit('applicationError', { message: 'no such session', parameters: { sessionId } });
          res();
        }
      });
  });
};
