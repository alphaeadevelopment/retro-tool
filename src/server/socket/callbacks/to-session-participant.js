import { socketManager } from '../../session';
import toSocket from './to-socket';

export default (sessionId, name) => {
  const socket = socketManager.getSocket(name);
  return (socket) ?
    toSocket(socket) :
    () => Promise.reject(new Error(`no socket for session ${sessionId} participant ${name}`));
};
