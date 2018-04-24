import merge from 'lodash/merge';

const emitFunction = (event, options = {}) => {
  const { onSuccess, onError } = options;
  return (socket, payload) => (dispatch) => {
    try {
      socket.emit(event, payload);
      if (onSuccess) {
        dispatch(onSuccess({ event, payload }));
      }
    }
    catch (e) {
      if (onError) {
        dispatch(onError({ event, message: e.message }));
      }
    }
  };
};

export default (events, options) =>
  events.reduce((rv, event) => merge(rv, { [event]: emitFunction(event, options) }), {});
