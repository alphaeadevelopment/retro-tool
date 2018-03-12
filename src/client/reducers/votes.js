import update from 'immutability-helper';
import without from 'lodash/without';
import * as Types from '../actions/types';

const initial = [];

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.INIT:
      return update(state, { $set: initial });
    case Types.UP_VOTE_REGISTERED:
      return update(state, {
        $push: [payload.responseId],
      });
    case Types.UP_VOTE_CANCELLED:
      return update(state, {
        $apply: v => without(v, payload.responseId),
      });
    default:
      return state;
  }
};
