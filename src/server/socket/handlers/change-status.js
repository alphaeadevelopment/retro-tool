import sessionManager from '../../session';
import modifySession from './modify-session';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  sessionManager.setStatus(socket.id, status)
    .then((session) => {
      const name = sessionManager.getName(socket.id);
      io.to(session.id).emit('syncSession', { status, session: modifySession(session, name) });
    });
};
