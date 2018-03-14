import sessionManager from '../../session';
import modifySession from './modify-session';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  const session = sessionManager.setStatus(socket.id, status);

  const name = sessionManager.getName(socket.id);

  io.to(session.id).emit('syncSession', { status, session: modifySession(session, name) });
};
