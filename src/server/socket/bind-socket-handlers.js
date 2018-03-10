import forOwn from 'lodash/forOwn';

export default (io, socket, handlers) => {
  forOwn(handlers, (handler, event) => {
    socket.on(event, handler.call(null, io, socket));
  });
};
