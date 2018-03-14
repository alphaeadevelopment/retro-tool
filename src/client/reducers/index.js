import { combineReducers } from 'redux';
import session from './session';
import votes from './votes';
import errors from './errors';
import token from './token';
import connection from './connection';

export default combineReducers({
  session,
  votes,
  errors,
  token,
  connection,
});
