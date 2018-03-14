import update from 'immutability-helper';

class SocketManager {
  sockets = {}
  saveSocket = (name, socket) => {
    this.sockets = update(this.sockets, { [name]: { $set: socket } });
  }
  removeSocket = (name) => {
    this.sockets = update(this.sockets, { $unset: [name] });
  }
  getSocket = name => this.sockets[name]
}

export default new SocketManager();
