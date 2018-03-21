/* globals window */
import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';
import snakeCase from 'lodash/snakeCase';
import * as Types from '../types';

const listeners = {
  onSessionCreated: {
    fn: ({ token }) => {
      window.localStorage.setItem('token', token);
    },
  },
  onLeftSession: {
    fn: () => {
      window.localStorage.removeItem('token');
    },
  },
  onJoinedSession: {
    fn: ({ token }) => {
      window.localStorage.setItem('token', token);
    },
  },
  onUnknownToken: {
    fn: () => {
      window.localStorage.removeItem('token');
    },
  },
  onNewParticipant: {},
  onReconnected: {},
  onNoSuchSession: {},
  onParticipantLeft: {},
  onParticipantReconnected: {},
  onParticipantDisconnected: {},
  onResponseAdded: {},
  onResponseDeleted: {},
  onResponseTypeDeleted: {},
  onUpVoteRegistered: {},
  onUpVoteCancelled: {},
  onSyncSession: {},
  onResponseTypeAdded: {},
  onUserVoted: {},
  onUserUnvoted: {},
  onFeedbackReceived: {},
  onApplicationError: {},
  onInit: {},
  onDisconnect: {},
}; // remember to add action type to ./types.js

const listenerFunctions = mapValues(listeners, (options, handlerName) => {
  const type = snakeCase(handlerName.substring(2)).toUpperCase();
  const action = createAction(Types[type]);
  const handlerFunc = obj => (dispatch) => {
    console.log('Received %s(%o)', type, obj); // eslint-disable-line no-console
    if (options.fn) options.fn.call(null, obj);
    dispatch(action(obj));
  };
  return handlerFunc;
});

export default ({
  ...listenerFunctions,
});
