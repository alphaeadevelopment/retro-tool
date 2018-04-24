import emitError from './emit-error';
import toSession from './to-session';
import toSocket from './to-socket';
import toSessionOwner from './to-session-owner';
import getConnection from './get-connection';
import joinRoom from './join-room';
import leaveRoom from './leave-room';
import toSessionParticipant from './to-session-participant';

export default (io, socket) => {
  const onError = emitError(socket);
  return ({
    toSession: toSession(io, socket),
    toSocket: toSocket(socket),
    toSessionOwner: toSessionOwner(socket),
    getConnection: getConnection(socket),
    onError,
    emitError: onError,
    joinRoom: joinRoom(socket),
    leaveRoom: leaveRoom(socket),
    toSessionParticipant,
  });
};
