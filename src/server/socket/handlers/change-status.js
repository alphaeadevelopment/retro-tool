import modifySession from './modify-session';
import sessionManager from '../../session';
import createPdf from '../../pdf/create-pdf';

const preGeneratePdf = session =>
  createPdf(session)
    .then(data => sessionManager.savePdfData({ sessionId: session.id, data }));

const syncSessionToEntireRoom = (toRoom, status, session, name) =>
  toRoom('syncSession', { status, session: modifySession(session, name) }, true);

export default ({ getConnection, toRoom }) => ({ status }) =>
  getConnection()
    .then((connection) => {
      const { name, sessionId } = connection;
      return sessionManager.setStatus(connection, status)
        .then((session) => {
          const p1 = syncSessionToEntireRoom(toRoom(sessionId), status, session, name);
          const p2 = (status === 'discuss') ? preGeneratePdf() : Promise.resolve();
          return Promise.all([p1, p2]);
        });
    });

