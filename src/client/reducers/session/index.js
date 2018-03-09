import update from 'immutability-helper';
import without from 'lodash/without';
import * as Types from '../../actions/types';

const initial = {
  session: null,
};
export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.CREATED_SESSION:
      return update(state, {
        session: { $set: payload.session },
        owner: { $set: true },
      });
    case Types.JOINED_SESSION:
      return update(state, {
        session: { $set: payload.session },
        owner: { $set: false },
      });
    case Types.LEFT_SESSION:
      return update(state, {
        session: { $set: null },
        owner: { $set: null },
      });
    case Types.NEW_PARTICIPANT:
      return update(state, {
        session: {
          participants: { $push: [payload.name] },
        },
      });
    case Types.PARTICIPANT_LEFT:
      return update(state, {
        session: {
          participants: { $apply: p => without(p, payload.name) },
        },
      });
    case Types.RESPONSE_ADDED:
      return update(state, {
        session: {
          responses: {
            [payload.response.responseType]: { $push: [payload.response] },
          },
        },
      });
    default:
      return state;
  }
};
