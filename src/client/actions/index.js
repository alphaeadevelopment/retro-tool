import { createAction } from 'redux-actions';
import createSocketEmitActions from './create-socket-emit-actions';
import socketEmitEvents from './socket-emit-events';
import * as Types from './types';

export * from './session';
export * from './errors';

export const Emit = createSocketEmitActions(socketEmitEvents, {
  onError: createAction(Types.SOCKET_EMIT_ERROR),
});
