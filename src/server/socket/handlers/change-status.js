import modifySession from './modify-session';
import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';
import createPdf from '../../pdf/create-pdf';

const preGeneratePdf = session =>
  createPdf(session)
    .then(data =>
      sessionManager.savePdfData({ sessionId: session.id, data })
        .then(() => null))
    .catch(() => {
      console.error('Error generating pdf');
    });

const syncSessionToEntireRoom = (io, sessionId, status, session, name) => {
  io.to(sessionId).emit('syncSession', { status, session: modifySession(session, name) });
};

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name, sessionId } = connection;
      return sessionManager.setStatus(connection, status)
        .then((session) => {
          syncSessionToEntireRoom(io, sessionId, status, session, name);
          if (status === 'discuss') {
            return preGeneratePdf();
          }
          return Promise.resolve();
        });
    })
    .catch(e => onError(e));
};
