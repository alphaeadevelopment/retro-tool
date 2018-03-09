import socketIo from 'socket.io';
import onConnect from './on-connect';

export default (serve) => {
  const io = socketIo(serve);
  io.on('connection', onConnect(io));
};
