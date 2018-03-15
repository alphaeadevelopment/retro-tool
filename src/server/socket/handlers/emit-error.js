export default socket => ({ message = 'error' } = {}, parameters = {}) => {
  socket.emit('applicationError', { message, parameters });
};
