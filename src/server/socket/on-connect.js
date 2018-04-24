import bindSocketHandlers from 'bind-socketio-handlers';
import * as handlers from './handlers';
import callbacks from './callbacks';

export default io => (socket) => {
  bindSocketHandlers(io, socket, handlers, callbacks(io, socket));
  socket.emit('init');
};
