import { createAction } from 'redux-actions';
import * as Types from './types';

const dismissError = createAction(Types.DISMISS_ERROR);
export const onDismissError = errorId => (dispatch) => {
  dispatch(dismissError({ errorId }));
};
