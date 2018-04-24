// import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';
import createToken from './create-token';

const sessionManager = require('../../session').default;
const { connectionManager } = require('../../session');

const notifyRoom = (toRoom, name) => toRoom('newParticipant', { name }, false);

const confirmToUser = (toSocket, session, name, token) =>
  toSocket('joinedSession', { token, session: modifySession(session, name), name });

export default ({ emitError, joinRoom, toRoom, toSocket }, io, socket) => ({ name, sessionId }) =>
  sessionManager.sessionExists(sessionId)
    .then((exists) => {
      if (exists) {
        return connectionManager.socketRegistered(socket.id)
          .then((registered) => {
            if (registered) {
              return emitError({ message: 'already in session' }, { name, sessionId });
            }
            return createToken()
              .then(token =>
                sessionManager.joinSession(socket, name, sessionId)
                  .then(session =>
                    connectionManager.registerSocket(socket.id, name, sessionId, token)
                      .then(() => Promise.all([
                        joinRoom(sessionId),
                        notifyRoom(toRoom(sessionId), name),
                        confirmToUser(toSocket, session, name, token),
                      ]))));
          });
      }
      return emitError({ message: 'no such session' }, { sessionId });
    });
