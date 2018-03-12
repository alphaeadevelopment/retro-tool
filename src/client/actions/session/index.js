/* eslint-disable no-console */
// import { createAction } from 'redux-actions';
// import * as Types from './types';

import emitHandlers from './bind-emit-handlers';
import socketEventListeners from './bind-socket-event-listeners';

// export const createdSession = createAction(Types.SESSION_CREATED);
// export const leftSession = createAction(Types.LEFT_SESSION);
// export const joinedSession = createAction(Types.JOINED_SESSION);
// export const newParticipant = createAction(Types.NEW_PARTICIPANT);
// export const noSuchSession = createAction(Types.NO_SUCH_SESSION);
// export const participantLeft = createAction(Types.PARTICIPANT_LEFT);
// export const responseAdded = createAction(Types.RESPONSE_ADDED);
// export const upVoteRegistered = createAction(Types.UP_VOTE_REGISTERED);
// export const upVoteCancelled = createAction(Types.UP_VOTE_CANCELLED);
// export const syncSession = createAction(Types.SYNC_SESSION);
// export const responseTypeAdded = createAction(Types.RESPONSE_TYPE_ADDED);
// export const userVoted = createAction(Types.USER_VOTED);
// export const userUnvoted = createAction(Types.USER_UNVOTED);
// export const feedbackReceived = createAction(Types.FEEDBACK_RECEIVED);

export const Emit = emitHandlers;
export const Listeners = socketEventListeners;

