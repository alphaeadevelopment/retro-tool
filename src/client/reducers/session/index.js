import update from 'immutability-helper';
import without from 'lodash/without';
import * as Types from '../../actions/types';

const initial = {
  session: null,
  votes: [],
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
          participants: { $merge: { [payload.name]: { name: [payload.name] } } },
        },
      });
    case Types.PARTICIPANT_LEFT:
      return update(state, {
        session: {
          participants: { [payload.name]: { $set: null } },
        },
      });
    case Types.RESPONSE_ADDED:
      return update(state, {
        session: {
          responses: { $merge: { [payload.response.id]: payload.response } },
        },
      });
    case Types.UP_VOTE_REGISTERED:
      return update(state, {
        votes: {
          $push: [payload.responseId],
        },
      });
    case Types.UP_VOTE_CANCELLED:
      return update(state, {
        votes: {
          $apply: v => without(v, payload.responseId),
        },
      });
    default:
      return state;
  }
};
