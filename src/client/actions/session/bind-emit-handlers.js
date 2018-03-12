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
};

const handlerFunctions = mapValues(handlers, (options, handler) => {
  const event = camelCase(handler.substring(2));
  const handlerFunc = (socket, obj) => (dispatch) => {
    socket.emit(event, obj);
    if (options.dispatch) dispatch(emittedEvent({ event, ...obj }));
  };
  return handlerFunc;
});

export default ({
  ...handlerFunctions,
});
