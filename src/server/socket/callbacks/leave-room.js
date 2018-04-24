
export default socket => sessionId => new Promise((res, rej) => {
  try {
    socket.leave(sessionId);
    res();
  }
  catch (e) {
    rej(e);
  }
});
