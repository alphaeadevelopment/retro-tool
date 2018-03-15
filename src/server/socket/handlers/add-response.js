import sessionManager from '../../session';

export default (io, socket) => ({ responseType, value }) => { // eslint-disable-line no-unused-vars
  sessionManager.addResponse(socket.id, responseType, value)
    .then((newResponse) => {
      socket.emit('responseAdded', { response: newResponse });
      sessionManager.isOwner(socket.id)
        .then((isOwner) => {
          if (!isOwner) {
            const sessionId = sessionManager.getSessionId(socket.id);
            sessionManager.getOwnerSocket(sessionId)
              .then(ownerSocket => ownerSocket.emit('responseAdded', { response: newResponse }))
              .catch(e => console.log(e));
          }
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
};
