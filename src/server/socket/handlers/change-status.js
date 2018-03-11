import sessionManager from '../../session';
import modifySession from './modify-session';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  sessionManager.setStatus(socket.id, status);

  const sessionId = sessionManager.getSessionId(socket.id);
  const name = sessionManager.getName(socket.id);
  const session = modifySession(sessionManager.getSession(sessionId), name);

  io.to(sessionId).emit('syncSession', { status, session });
};
