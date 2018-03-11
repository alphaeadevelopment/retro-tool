import sessionManager from '../../session';
import modifySession from './modify-session';

export default (io, socket) => ({ name, sessionId }) => { // eslint-disable-line no-unused-vars
  if (sessionManager.sessionExists(sessionId)) {
    console.log('user %s joined session %s', name, sessionId);
    const session = sessionManager.joinSession(socket.id, name, sessionId);
    socket.join(sessionId);
    socket.broadcast.to(sessionId).emit('newParticipant', name);
    socket.emit('joinedSession', modifySession(session, name));
  }
  else {
    socket.emit('noSuchSession', sessionId);
  }
};
