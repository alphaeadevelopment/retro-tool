import { createSelector } from 'reselect';
import { getSessionOwner } from './session';

export const getConnection = state => state.connection;
export const isConnected = state => state.connection.connected;
export const getName = state => state.connection.name;

export const isSessionOwner = createSelector(
  getConnection, getSessionOwner, (connection, sessionOwner) => connection.name === sessionOwner,
);
