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
export const upVoteRegistered = createAction(Types.UP_VOTE_REGISTERED);
export const upVoteCancelled = createAction(Types.UP_VOTE_CANCELLED);
export const syncSession = createAction(Types.SYNC_SESSION);
export const responseTypeAdded = createAction(Types.RESPONSE_TYPE_ADDED);
export const userVoted = createAction(Types.USER_VOTED);
export const userUnvoted = createAction(Types.USER_UNVOTED);
export const feedbackReceived = createAction(Types.FEEDBACK_RECEIVED);

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
export const onUpVoteResponse = (socket, responseId) => () => {
  socket.emit('upVoteResponse', { responseId });
};
export const onCancelUpVoteResponse = (socket, responseId) => () => {
  socket.emit('cancelUpVoteResponse', { responseId });
};
export const onChangeStatus = (socket, status) => () => {
  socket.emit('changeStatus', { status });
};
export const onAddResponseType = (socket, question, type) => () => {
  socket.emit('addResponseType', { question, type });
};
export const onSendFeedback = (socket, responseId, message) => () => {
  socket.emit('sendFeedback', { responseId, message });
};

export const onSocketEventSessionCreated = ({ session, name }) => (dispatch) => {
  dispatch(createdSession({ session, name }));
};
export const onSocketEventLeftSession = () => (dispatch) => {
  dispatch(leftSession());
};
export const onSocketEventJoinedSession = ({ session, name }) => (dispatch) => {
  dispatch(joinedSession({ session, name }));
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
export const onSocketEventResponseAdded = ({ response }) => (dispatch) => {
  dispatch(responseAdded({ response }));
};
export const onSocketEventUpVoteRegistered = ({ responseId }) => (dispatch) => {
  dispatch(upVoteRegistered({ responseId }));
};
export const onSocketEventUpVoteCancelled = ({ responseId }) => (dispatch) => {
  dispatch(upVoteCancelled({ responseId }));
};
export const onSocketEventSyncSession = ({ session }) => (dispatch) => {
  dispatch(syncSession({ session }));
};
export const onSocketEventResponseTypeAdded = ({ responseType }) => (dispatch) => {
  dispatch(responseTypeAdded({ responseType }));
};
export const onSocketEventUserVoted = ({ name }) => (dispatch) => {
  dispatch(userVoted({ name }));
};
export const onSocketEventUserUnvoted = ({ name }) => (dispatch) => {
  dispatch(userUnvoted({ name }));
};
export const onSocketEventFeedbackReceived = ({ responseId, message }) => (dispatch) => {
  dispatch(feedbackReceived({ responseId, message }));
};

