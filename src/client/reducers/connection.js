import update from 'immutability-helper';
import * as Types from '../actions/types';

const initial = {
  connected: false,
  name: null,
};

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.INIT:
      return update(state, { connected: { $set: true } });
    case Types.SESSION_CREATED:
      return update(state, { name: { $set: payload.name } });
    case Types.JOINED_SESSION:
      return update(state, { name: { $set: payload.name } });
    case Types.RECONNECTED:
      return update(state, { name: { $set: payload.name } });
    case Types.DISCONNECT:
      return update(state, { connected: { $set: false } });
    default:
      return state;
  }
};
