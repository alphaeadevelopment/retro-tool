/* globals window */
import update from 'immutability-helper';
import * as Types from '../actions/types';

const initial = window.localStorage.getItem('token');

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.SESSION_CREATED:
      return update(state, { $set: payload.session.id });
    case Types.JOINED_SESSION:
      return update(state, { $set: payload.session.id });
    default:
      return state;
  }
};
