/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import modifySession from './modify-session';

describe('filterResponses', () => {
  describe('initial', () => {
    it('only shows own responses', () => {
      const session = {
        status: 'initial',
        owner: 'harry',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).to.have.property('abc');
      expect(actual.responses).not.to.have.property('def');
    });
    it('owner gets all responses', () => {
      const session = {
        status: 'initial',
        owner: 'bob',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
  });
  describe('voting', () => {
    it('include all responses', () => {
      const session = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
    it('exclude votes', () => {
      const session = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses.abc).not.to.have.property('votes');
      expect(actual.responses.def).not.to.have.property('votes');
    });
    it('exclude flagged responses when status=voting', () => {
      const session = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
            flagged: true,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
        owner: 'harry',
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).not.to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
    it('don\'t exclude flagged responses for owner when status=voting', () => {
      const session = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            flagged: true,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
          },
        },
        owner: 'bob',
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
    it('exclude flagged responses when status=discuss', () => {
      const session = {
        status: 'discuss',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
            flagged: true,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).not.to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
    it('exclude flagged responses for owner when status=discuss', () => {
      const session = {
        status: 'discuss',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
            flagged: true,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
        },
        owner: 'bob',
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses).not.to.have.property('abc');
      expect(actual.responses).to.have.property('def');
    });
  });
  describe('discuss', () => {
    it('include number of votes', () => {
      const session = {
        status: 'discuss',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: ['a', 'b', 'c'],
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: ['a', 'b'],
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual.responses.abc).to.have.property('votes', 3);
      expect(actual.responses.def).to.have.property('votes', 2);
    });
  });
});
