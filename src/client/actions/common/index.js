import { createAction } from 'redux-actions';
import * as Types from './types';

export const onError = createAction(Types.ON_ERROR);
