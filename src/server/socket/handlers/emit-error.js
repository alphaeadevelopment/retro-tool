export default socket => (e = {}, parameters = {}) => {
  if (e.trace) console.error(e.trace);
  if (e.stack) console.error(e.stack);
  socket.emit('applicationError', { message: e.message, parameters });
};
