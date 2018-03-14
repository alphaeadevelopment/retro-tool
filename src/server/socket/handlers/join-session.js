import sessionManager from '../../session';
import modifySession from './modify-session';
import createToken from './create-token';

export default (io, socket) => ({ name, sessionId }) => { // eslint-disable-line no-unused-vars
  if (sessionManager.sessionExists(sessionId)) {
    const token = createToken();
    try {
      const session = sessionManager.joinSession(socket, name, sessionId, token);
      socket.join(sessionId);
      socket.broadcast.to(sessionId).emit('newParticipant', { name });
      socket.emit('joinedSession', { token, session: modifySession(session, name), name });
    }
    catch (e) {
      socket.emit('applicationError', { message: e.message, parameters: { name, sessionId } });
    }
  }
  else {
    socket.emit('applicationError', { message: 'no such session', parameters: { sessionId } });
  }
};
