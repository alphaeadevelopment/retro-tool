import sessionManager from '../../session';
import filterResponses from './filter-responses';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  sessionManager.setStatus(socket.id, status);

  const sessionId = sessionManager.getSessionId(socket.id);
  const session = filterResponses(sessionManager.getSession(sessionId));

  io.to(sessionId).emit('syncSession', { status, session });
};
