

export default socket => sessionId => new Promise((res, rej) => {
  try {
    socket.join(sessionId);
    res();
  }
  catch (e) {
    rej(e);
  }
});
