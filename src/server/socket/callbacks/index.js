import toSessionOwner from './to-session-owner';
import getConnection from './get-connection';
import toSessionParticipant from './to-session-participant';

export default (io, socket) => ({
  toSessionOwner: toSessionOwner(socket),
  getConnection: getConnection(socket),
  toSessionParticipant,
});
