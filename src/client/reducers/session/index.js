import update from 'immutability-helper';
import without from 'lodash/without';
import omit from 'lodash/omit';
import * as Types from '../../actions/types';

const initial = {
  session: null,
  votes: [],
  name: null,
};
export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.CREATED_SESSION:
      return update(state, {
        session: { $set: payload.session },
        owner: { $set: true },
        name: { $set: payload.name },
      });
    case Types.JOINED_SESSION:
      return update(state, {
        session: { $set: payload.session },
        owner: { $set: false },
        name: { $set: payload.name },
      });
    case Types.LEFT_SESSION:
      return update(state, {
        session: { $set: null },
        owner: { $set: null },
      });
    case Types.NEW_PARTICIPANT:
      return update(state, {
        session: {
          participants: { $merge: { [payload.name]: { name: payload.name, votes: 0 } } },
        },
      });
    case Types.PARTICIPANT_LEFT:
      return update(state, {
        session: {
          participants: { $apply: p => omit(p, payload.name) },
        },
      });
    case Types.RESPONSE_ADDED:
      return update(state, {
        session: {
          responses: { $merge: { [payload.response.id]: payload.response } },
        },
      });
    case Types.RESPONSE_TYPE_ADDED:
      return update(state, {
        session: {
          responseTypes: { $merge: { [payload.responseType.id]: payload.responseType } },
        },
      });
    case Types.UP_VOTE_REGISTERED:
      return update(state, {
        votes: {
          $push: [payload.responseId],
        },
        session: {
          participants: {
            [state.name]: {
              votes: { $apply: v => v + 1 },
            },
          },
        },
      });
    case Types.UP_VOTE_CANCELLED:
      return update(state, {
        votes: {
          $apply: v => without(v, payload.responseId),
        },
        session: {
          participants: {
            [state.name]: {
              votes: { $apply: v => v - 1 },
            },
          },
        },
      });
    case Types.SYNC_SESSION:
      return update(state, {
        session: {
          $set: payload.session,
        },
      });
    case Types.USER_VOTED:
      return update(state, {
        session: {
          participants: {
            [payload.name]: {
              votes: { $apply: v => v + 1 },
            },
          },
        },
      });
    case Types.USER_UNVOTED:
      return update(state, {
        session: {
          participants: {
            [payload.name]: {
              votes: { $apply: v => v - 1 },
            },
          },
        },
      });
    default:
      return state;
  }
};
