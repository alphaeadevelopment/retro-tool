/* eslint-disable no-console */
import { createAction } from 'redux-actions';
import * as Types from './types';
// import * as CommonActions from '../common';

export const createdSession = createAction(Types.CREATED_SESSION);
export const leftSession = createAction(Types.LEFT_SESSION);
export const joinedSession = createAction(Types.JOINED_SESSION);
export const newParticipant = createAction(Types.NEW_PARTICIPANT);
export const noSuchSession = createAction(Types.NO_SUCH_SESSION);
export const participantLeft = createAction(Types.PARTICIPANT_LEFT);
export const responseAdded = createAction(Types.RESPONSE_ADDED);

export const doInitSocket = socket => () => {
  socket.on('initial', (res) => {
    console.log(res);
  });
};
export const onJoinSession = (socket, name, sessionId) => () => {
  socket.emit('joinSession', { name, sessionId });
};
export const onCreateSession = (socket, name) => () => {
  console.log(socket.id);
  socket.emit('createSession', name);
};
export const onLeaveSession = (socket, id) => () => {
  socket.emit('leaveSession', id);
};
export const onAddResponse = (socket, responseType, value) => () => {
  socket.emit('addResponse', { responseType, value });
};

export const onSocketEventSessionCreated = session => (dispatch) => {
  dispatch(createdSession({ session }));
};
export const onSocketEventLeftSession = () => (dispatch) => {
  dispatch(leftSession());
};
export const onSocketEventJoinedSession = session => (dispatch) => {
  dispatch(joinedSession({ session }));
};
export const onSocketEventNewParticipant = name => (dispatch) => {
  dispatch(newParticipant({ name }));
};
export const onSocketEventNoSuchSession = sessionId => (dispatch) => {
  dispatch(noSuchSession({ sessionId }));
};
export const onSocketEventParticipantLeft = name => (dispatch) => {
  dispatch(participantLeft({ name }));
};
export const onSocketEventResponseAdded = response => (dispatch) => {
  dispatch(responseAdded({ response }));
};

