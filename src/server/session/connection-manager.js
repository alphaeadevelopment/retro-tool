import dao from './session-dao';

class ConnectionManager {
  registerSocket = (socketId, name, sessionId, token) => {
    return dao.registerSocket(socketId, name, sessionId, token);
  }

  deregisterSocket = (socketId) => {
    return dao.deregisterSocket(socketId);
  }

  socketRegistered = socketId => dao.isSocketRegistered(socketId);

  getConnection = socketId => new Promise((res, rej) => {
    this.socketRegistered(socketId)
      .then((isRegistered) => {
        if (isRegistered) {
          dao.getConnection(socketId)
            .then(connection => res(connection))
            .catch(e => rej(e));
        }
        else rej(new Error('not connected'));
      })
      .catch(e => rej(e));
  });

  getConnectionByToken = token => dao.getConnectionByToken(token)
}

export default new ConnectionManager();
