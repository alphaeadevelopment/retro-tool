// import { createSelector } from 'reselect';

export const getCurrentSession = state => state.session.session;
export const isSessionOwner = state => state.session.owner;
export const getVotes = state => state.session.votes;
