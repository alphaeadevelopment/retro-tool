import keys from 'lodash/keys';
import bindSocketHandlers from './bind-socket-handlers';
import * as handlers from './handlers';

export default io => (socket) => {
  console.log('client connected: %s', socket.id);
  bindSocketHandlers(io, socket, handlers);
  socket.emit('init');
  console.log('bound listeners: %o', keys(handlers));
};
