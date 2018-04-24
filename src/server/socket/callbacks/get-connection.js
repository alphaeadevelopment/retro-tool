import { connectionManager } from '../../session';

export default socket => () => connectionManager.getConnection(socket.id);
