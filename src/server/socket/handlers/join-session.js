import sessionManager from '../../session';
import modifySession from './modify-session';

export default (io, socket) => ({ name, sessionId }) => { // eslint-disable-line no-unused-vars
  if (sessionManager.sessionExists(sessionId)) {
    try {
      const session = sessionManager.joinSession(socket, name, sessionId);
      socket.join(sessionId);
      socket.broadcast.to(sessionId).emit('newParticipant', { name });
      socket.emit('joinedSession', { session: modifySession(session, name), name });
    }
    catch (e) {
      socket.emit('applicationError', { message: e.message });
    }
  }
  else {
    socket.emit('applicationError', { message: 'no such session' });
  }
};
