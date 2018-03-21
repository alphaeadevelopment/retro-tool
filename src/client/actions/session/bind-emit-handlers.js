import { createAction } from 'redux-actions';
import mapValues from 'lodash/mapValues';
import camelCase from 'lodash/camelCase';
import * as Types from '../types';

export const emittedEvent = createAction(Types.EMITTED_EVENT);

const handlers = {
  onJoinSession: {
    dispatch: true,
  },
  onCreateSession: {
    dispatch: true,
  }, //
  onLeaveSession: {}, //
  onAddResponse: {},
  onUpVoteResponse: {},
  onCancelUpVoteResponse: {},
  onChangeStatus: {},
  onAddResponseType: {},
  onSendFeedback: {},
  onReconnectToSession: {},
  onDeleteResponse: {},
  onDeleteResponseType: {},
};

const handlerFunctions = mapValues(handlers, (options, handler) => {
  const event = camelCase(handler.substring(2));
  const handlerFunc = (socket, obj) => (dispatch) => {
    console.info('Emit event %s(%o) to socket %s', event, obj, socket.id); // eslint-disable-line no-console
    socket.emit(event, obj);
    if (options.dispatch) dispatch(emittedEvent({ event, ...obj }));
  };
  return handlerFunc;
});

export default ({
  ...handlerFunctions,
});
