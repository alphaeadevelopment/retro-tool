import socketIo from 'socket.io';
import onConnect from './on-connect';
import dao from '../session/session-dao';

export default (serve) => {
  dao.resetAllConnections()
    .then(() => {
      const io = socketIo(serve);
      io.on('connection', onConnect(io));
    });
};
