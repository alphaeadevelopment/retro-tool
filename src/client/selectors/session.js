import { createSelector } from 'reselect';

export const getCurrentSession = state => state.session;

export const getSessionOwner = createSelector(getCurrentSession, session => session.owner);
