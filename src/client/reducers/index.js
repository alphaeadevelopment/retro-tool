import { combineReducers } from 'redux';
import session from './session';
import votes from './votes';
import errors from './errors';

export default combineReducers({
  session,
  votes,
  errors,
});
