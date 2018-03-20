import modifySession from './modify-session';
import sessionManager, { connectionManager } from '../../session';
import emitError from './emit-error';
import createPdf from '../../pdf/create-pdf';

export default (io, socket) => ({ status }) => { // eslint-disable-line no-unused-vars
  const onError = emitError(socket);
  connectionManager.getConnection(socket.id)
    .then((connection) => {
      const { name, sessionId } = connection;
      sessionManager.setStatus(connection, status)
        .then((session) => {
          io.to(sessionId).emit('syncSession', { status, session: modifySession(session, name) });
          if (status === 'discuss') {
            createPdf(session)
              .then((data) => {
                sessionManager.savePdfData({ sessionId, data })
                  .then(() => null)
                  .catch((e) => {
                    console.error(e);
                    console.error('Error saving pdf');
                  });
              })
              .catch((e) => {
                console.error(e);
                console.error('Error generating pdf');
              });
          }
        })
        .catch(e => onError(e));
    })
    .catch(e => onError(e));
};
