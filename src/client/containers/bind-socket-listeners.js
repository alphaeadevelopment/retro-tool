import forEach from 'lodash/forEach';
import forOwn from 'lodash/forOwn';
import pickBy from 'lodash/pickBy';
import camelCase from 'lodash/camelCase';
import startsWith from 'lodash/startsWith';

const HANDLER_PREFIX = 'on';

const getEvent = e => camelCase(e.substring(HANDLER_PREFIX.length));

const socketEventHandlers = actions => pickBy(forOwn(actions), (v, k) => startsWith(k, HANDLER_PREFIX));

const dispatchHandler = dispatch => action => payload => dispatch(action.call(null, payload));

export default (actions, socket, dispatch) => {
  const actionFunctions = socketEventHandlers(actions);
  const doDispatch = dispatchHandler(dispatch);
  forEach(actionFunctions, (func, action) => {
    const event = getEvent(action);
    socket.on(event, doDispatch(func));
  });
};
