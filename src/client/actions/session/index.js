/* eslint-disable no-console */
// import { createAction } from 'redux-actions';
// import * as Types from './types';

import emitHandlers from './bind-emit-handlers';
import socketEventListeners from './bind-socket-event-listeners';

export const Emit = emitHandlers;
export const Listeners = socketEventListeners;

