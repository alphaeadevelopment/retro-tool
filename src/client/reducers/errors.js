import update from 'immutability-helper';
import generate from 'shortid';
import omit from 'lodash/omit';
import * as Types from '../actions/types';

const createError = (payload) => {
  const id = generate();
  return ({
    [id]: { id, message: payload.message, timestamp: new Date().getTime() },
  });
};
const initial = {};
export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.APPLICATION_ERROR:
      return update(state, {
        $merge: createError(payload),
      });
    case Types.DISMISS_ERROR:
      return update(state, {
        $apply: errors => omit(errors, payload.errorId),
      });
    default:
      return state;
  }
};
