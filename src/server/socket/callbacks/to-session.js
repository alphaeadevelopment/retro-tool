

export default (io, socket) => sessionId => (type, payload = {}, sendToSelf = false) => new Promise((res, rej) => {
  try {
    if (sendToSelf) io.to(sessionId).emit(type, payload);
    else socket.broadcast.to(sessionId).emit(type, payload);
    res();
  }
  catch (e) {
    rej(e);
  }
});
