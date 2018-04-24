import forOwn from 'lodash/forOwn';

const callHandler = (io, socket, callbacks) => (event, handler) => {
  const fn = handler.call(null, callbacks, io, socket);
  return (payload) => {
    console.log('handle event %s', event);
    const rv = fn.call(null, payload);
    if (rv instanceof Promise && callbacks && callbacks.onError) {
      rv.catch(callbacks.onError);
    }
  };
};

export default (io, socket, handlers, callbacks) => {
  const doCall = callHandler(io, socket, callbacks);
  forOwn(handlers, (handler, event) => {
    socket.on(event, doCall(event, handler));
  });
};
