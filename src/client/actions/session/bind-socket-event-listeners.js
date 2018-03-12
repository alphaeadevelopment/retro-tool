import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';
import * as Types from '../types';

const listeners = {
  onSocketEventSessionCreated: {},
  onSocketEventLeftSession: {},
  onSocketEventJoinedSession: {},
  onSocketEventNewParticipant: {},
  onSocketEventNoSuchSession: {},
  onSocketEventParticipantLeft: {},
  onSocketEventResponseAdded: {},
  onSocketEventUpVoteRegistered: {},
  onSocketEventUpVoteCancelled: {},
  onSocketEventSyncSession: {},
  onSocketEventResponseTypeAdded: {},
  onSocketEventUserVoted: {},
  onSocketEventUserUnvoted: {},
  onSocketEventFeedbackReceived: {},
  onSocketEventApplicationError: {},
};

const listenerFunctions = mapValues(listeners, (options, handlerName) => {
  const type = snakeCase(handlerName.substring(13)).toUpperCase();
  const action = createAction(Types[type]);
  const handlerFunc = obj => (dispatch) => {
    dispatch(action(obj));
  };
  return handlerFunc;
});

export default ({
  ...listenerFunctions,
});
