import bindSocketHandlers from './bind-socket-handlers';
import * as handlers from './handlers';
import callbacks from './callbacks';

export default io => (socket) => {
  console.log('client connected: %s', socket.id);
  bindSocketHandlers(io, socket, handlers, callbacks(io, socket));
  socket.emit('init');
};
