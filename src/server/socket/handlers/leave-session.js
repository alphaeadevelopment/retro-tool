import sessionManager, { connectionManager } from '../../session';
import modifySession from './modify-session';

const notifyRoomThatUserLeft = (toRoom, name) => toRoom('participantLeft', { name });
const confirmToUser = toSocket => toSocket('leftSession');

const updateWithNewOwner = (toRoom, toSessionOwner, toNewOwner, sessionId, nextOwner) =>
  sessionManager.setNewOwner(sessionId, nextOwner)
    .then(session => Promise.all([
      toNewOwner('syncSession', { session: modifySession(session, nextOwner) }),
      toRoom('newOwner', { name: nextOwner }),
    ]));

export default (
  { leaveRoom, emitError, getConnection, toSocket, toRoom, toSessionOwner, toSessionParticipant },
  io, socket,
) => () =>
  getConnection()
    .then((connection) => {
      const { name, sessionId } = connection;
      if (name) {
        return sessionManager.isOwner(connection)
          .then(isOwner => sessionManager.leaveSession(connection)
            .then(() => connectionManager.deregisterSocket(socket.id)
              .then(() => sessionManager.getNextOwner(sessionId)
                .then(nextOwner => Promise.all([
                  leaveRoom(sessionId),
                  notifyRoomThatUserLeft(toRoom(sessionId), name),
                  confirmToUser(toSocket),
                  (isOwner && nextOwner) ?
                    updateWithNewOwner(
                      toRoom(sessionId),
                      toSessionOwner(sessionId),
                      toSessionParticipant(sessionId, nextOwner),
                      sessionId,
                      nextOwner,
                    ) :
                    Promise.resolve(),
                ])))));
      }
      return emitError({ message: 'not in a session' });
    });

