import dao from './session-dao';

class ConnectionManager {
  registerSocket = (socketId, name, sessionId, token) => dao.registerSocket(socketId, name, sessionId, token)

  deregisterSocket = socketId => dao.deregisterSocket(socketId)

  socketRegistered = socketId => dao.isSocketRegistered(socketId);

  getConnection = socketId =>
    this.socketRegistered(socketId)
      .then((isRegistered) => {
        if (isRegistered) {
          return dao.getConnection(socketId);
        }
        throw new Error('not connected');
      });

  getConnectionByToken = token => dao.getConnectionByToken(token).then(r => r || {})
}

export default new ConnectionManager();
