/* globals window */
import update from 'immutability-helper';
import * as Types from '../actions/types';

const initial = window.localStorage.getItem('token');

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.SESSION_CREATED:
    case Types.JOINED_SESSION:
      return update(state, { $set: payload.token });
    case Types.LEFT_SESSION:
    case Types.UNKNOWN_TOKEN:
      return update(state, { $set: null });
    default:
      return state;
  }
};
