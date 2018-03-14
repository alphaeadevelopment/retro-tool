/* globals window */
import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';
import * as Types from '../types';

const listeners = {
  onSocketEventSessionCreated: {
    fn: ({ token }) => {
      window.localStorage.setItem('token', token);
    },
  },
  onSocketEventLeftSession: {
    fn: () => {
      window.localStorage.removeItem('token');
    },
  },
  onSocketEventJoinedSession: {
    fn: ({ token }) => {
      window.localStorage.setItem('token', token);
    },
  },
  onSocketEventUnknownToken: {
    fn: () => {
      window.localStorage.removeItem('token');
    },
  },
  onSocketEventNewParticipant: {},
  onSocketEventReconnected: {},
  onSocketEventNoSuchSession: {},
  onSocketEventParticipantLeft: {},
  onSocketEventParticipantReconnected: {},
  onSocketEventParticipantDisconnected: {},
  onSocketEventResponseAdded: {},
  onSocketEventUpVoteRegistered: {},
  onSocketEventUpVoteCancelled: {},
  onSocketEventSyncSession: {},
  onSocketEventResponseTypeAdded: {},
  onSocketEventUserVoted: {},
  onSocketEventUserUnvoted: {},
  onSocketEventFeedbackReceived: {},
  onSocketEventApplicationError: {},
  onSocketEventInit: {},
};

const listenerFunctions = mapValues(listeners, (options, handlerName) => {
  const type = snakeCase(handlerName.substring(13)).toUpperCase();
  const action = createAction(Types[type]);
  const handlerFunc = obj => (dispatch) => {
    console.log('Received %s(%o)', type, obj);
    if (options.fn) options.fn.call(null, obj);
    dispatch(action(obj));
  };
  return handlerFunc;
});

export default ({
  ...listenerFunctions,
});
