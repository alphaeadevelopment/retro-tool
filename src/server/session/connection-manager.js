import update from 'immutability-helper';
import clone from 'lodash/clone';
import find from 'lodash/find';
import keys from 'lodash/keys';

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
  getConnection = socketId =>
    Promise.resolve((this.socketRegistered(socketId) ? clone(this.connections[socketId]) : {}))
  getConnectionByToken = (token) => {
    const socketId = find(keys(this.connections), s => this.connections[s].token === token) || {};
    return Promise.resolve(this.connections[socketId]);
  }
}

export default new ConnectionManager();
