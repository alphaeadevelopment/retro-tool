import update from 'immutability-helper';
import * as Types from '../actions/types';

const initial = {};

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.INIT:
      return update(state, { $set: initial });
    case Types.SESSION_CREATED:
      return update(state, { $set: payload.session });
    case Types.JOINED_SESSION:
      return update(state, { $set: payload.session });
    case Types.LEFT_SESSION:
      return update(state, { $set: {} });
    case Types.NEW_PARTICIPANT:
      return update(state, {
        participants: { $merge: { [payload.name]: { name: payload.name, votes: 0, connected: true } } },
      });
    case Types.PARTICIPANT_DISCONNECTED:
      return update(state, {
        participants: { [payload.name]: { connected: { $set: false } } },
      });
    case Types.PARTICIPANT_RECONNECTED:
      return update(state, {
        participants: { [payload.name]: { connected: { $set: true } } },
      });
    case Types.PARTICIPANT_LEFT:
      return update(state, {
        participants: { $unset: [[payload.name]] },
      });
    case Types.RESPONSE_ADDED:
      return update(state, {
        responses: { $merge: { [payload.response.id]: payload.response } },
      });
    case Types.RESPONSE_DELETED:
      return update(state, {
        responses: { $unset: [payload.responseId] },
      });
    case Types.RESPONSE_TYPE_DELETED:
      return update(state, {
        responseTypes: { $unset: [payload.responseTypeId] },
      });
    case Types.RESPONSE_TYPE_ADDED:
      return update(state, {
        responseTypes: { $merge: { [payload.responseType.id]: payload.responseType } },
      });
    case Types.UP_VOTE_REGISTERED:
      return update(state, {
        participants: {
          [payload.name]: {
            votes: { $apply: v => v + 1 },
          },
        },
      });
    case Types.UP_VOTE_CANCELLED:
      return update(state, {
        participants: {
          [payload.name]: {
            votes: { $apply: v => v - 1 },
          },
        },
      });
    case Types.SYNC_SESSION:
      return update(state, {
        $set: payload.session,
      });
    case Types.USER_VOTED:
      return update(state, {
        participants: {
          [payload.name]: {
            votes: { $apply: v => v + 1 },
          },
        },
      });
    case Types.USER_UNVOTED:
      return update(state, {
        participants: {
          [payload.name]: {
            votes: { $apply: v => v - 1 },
          },
        },
      });
    case Types.FEEDBACK_RECEIVED:
      return update(state, {
        responses: {
          [payload.responseId]: {
            flagged: { $set: true },
            message: { $set: payload.message },
          },
        },
      });
    case Types.RECONNECTED:
      return update(state, { $set: payload.session });
    default:
      return state;
  }
};
