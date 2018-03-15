// import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';
import createToken from './create-token';
import emitError from './emit-error';

const sessionManager = require('../../session').default;
const { connectionManager } = require('../../session');

export default (io, socket) => ({ name, sessionId }) => {
  const onError = emitError(socket);
  return new Promise((res) => {
    sessionManager.sessionExists(sessionId)
      .then((exists) => {
        if (exists) {
          connectionManager.socketRegistered(socket.id)
            .then((registered) => {
              if (registered) {
                onError({ message: 'already in session' }, { name, sessionId });
                res();
              }
              else {
                const token = createToken();
                sessionManager.joinSession(socket, name, sessionId)
                  .then((session) => {
                    connectionManager.registerSocket(socket.id, name, sessionId, token)
                      .then(() => {
                        socket.join(sessionId);
                        socket.broadcast.to(sessionId).emit('newParticipant', { name });
                        socket.emit('joinedSession', { token, session: modifySession(session, name), name });
                        res();
                      })
                      .catch((e) => {
                        onError(e, { name, sessionId });
                        res();
                      });
                  })
                  .catch((e) => {
                    onError(e, { name, sessionId });
                    res();
                  });
              }
            })
            .catch((e) => {
              onError(e, { name, sessionId });
              res();
            });
        }
        else {
          onError({ message: 'no such session' }, { sessionId });
          res();
        }
      });
  });
};
