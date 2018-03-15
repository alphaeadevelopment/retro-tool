import update from 'immutability-helper';
import clone from 'lodash/clone';
import find from 'lodash/find';
import keys from 'lodash/keys';
import dao from './session-dao';

class ConnectionManager {
  connections = {}

  registerSocket = (socketId, name, sessionId, token) => {
    this.connections[socketId] = { name, sessionId, token };
    return Promise.resolve();
  }

  deregisterSocket = (socketId) => {
    this.connections = update(this.connections, { $unset: [socketId] });
    return Promise.resolve();
  }

  socketRegistered = socketId => Promise.resolve(this.connections[socketId] && true)

  getConnection = socketId => new Promise((res, rej) => {
    this.socketRegistered(socketId)
      .then((isRegistered) => {
        if (isRegistered) {
          res(clone(this.connections[socketId]));
        }
        else rej(new Error('not connected'));
      })
      .catch(e => rej(e));
  });

  getConnectionByToken = (token) => {
    const socketId = find(keys(this.connections), s => this.connections[s].token === token) || {};
    return Promise.resolve(this.connections[socketId] || {});
  }

  withConnection = (socketId, fn) => {
    this.getConnection(socketId)
      .then(connection => fn.call(null, connection));
  }
}

export default new ConnectionManager();
