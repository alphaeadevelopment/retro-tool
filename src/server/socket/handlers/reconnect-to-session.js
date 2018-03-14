import sessionManager from '../../session';
import modifySession from './modify-session';


export default (io, socket) => ({ token }) => { // eslint-disable-line no-unused-vars
  console.log('reconnect with token %s', token);
  try {
    const { session, name } = sessionManager.reconnect(socket, token);
    const sessionId = session.id;
    console.log('reconnect %s with session %s', name, sessionId);
    socket.join(sessionId);

    socket.emit('reconnected', { name, session: modifySession(session, name) });
    socket.to(sessionId).emit('participantReconnected', { name });
  }
  catch (e) {
    if (e.message === 'unknown token') {
      socket.emit('unknownToken', { token });
    }
    else {
      socket.emit('applicationError', { message: e.message, parameters: { token } });
    }
  }
};
