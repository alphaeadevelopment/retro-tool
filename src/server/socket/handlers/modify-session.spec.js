/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import modifySession from './modify-session';

describe('filterResponses', () => {
  describe('initial', () => {
    it('only shows own responses', () => {
      const session = {
        status: 'initial',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: 3,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: 2,
          },
        },
      };
      const expected = {
        status: 'initial',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual).to.deep.equal(expected);
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
          },
          'def': {
            author: 'harry',
            responseType: 'x',
          },
        },
      };
      const expected = {
        status: 'voting',
        responses: session.responses,
      };

      const actual = modifySession(session, 'bob');
      expect(actual).to.deep.equal(expected);
    });
    it('exclude number of votes', () => {
      const session = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
            votes: 3,
          },
          'def': {
            author: 'harry',
            responseType: 'x',
            votes: 2,
          },
        },
      };
      const expected = {
        status: 'voting',
        responses: {
          'abc': {
            author: 'bob',
            responseType: 'x',
          },
          'def': {
            author: 'harry',
            responseType: 'x',
          },
        },
      };

      const actual = modifySession(session, 'bob');
      expect(actual).to.deep.equal(expected);
    });
  });
});
