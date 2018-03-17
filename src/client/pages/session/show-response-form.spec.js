/* globals describe, it */
import { expect } from 'chai';

import showResponseForm from './show-response-form';

describe('getSchemaForResponseType', () => {
  describe('Choices', () => {
    it('voting - false, control', () => {
      const sessionStatus = 'voting';
      const responseType = {
        type: 'Choices',
      };
      const expected = false;
      const responses = [];
      expect(showResponseForm(responseType, responses, sessionStatus)).to.deep.equal(expected);
    });
    it('returns false for Choices(allowMultiple=true) when self has responded', () => {
      const sessionStatus = 'initial';
      const responseType = {
        type: 'Choices',
        allowMultiple: true,
      };
      const expected = false;
      const responses = [{
        author: 'me',
        response: 'x',
      }];
      const name = 'me';
      expect(showResponseForm(responseType, responses, sessionStatus, name)).to.deep.equal(expected);
    });
    it('returns false for Choices(allowMultiple=false) when self has responded', () => {
      const sessionStatus = 'initial';
      const responseType = {
        type: 'Choices',
        allowMultiple: false,
      };
      const expected = false;
      const responses = [{
        author: 'me',
        response: 'x',
      }];
      const name = 'me';
      expect(showResponseForm(responseType, responses, sessionStatus, name)).to.deep.equal(expected);
    });
    it('returns true for Choices(allowMultiple=true) when self has not responded', () => {
      const sessionStatus = 'initial';
      const responseType = {
        type: 'Choices',
        allowMultiple: true,
      };
      const expected = true;
      const responses = [{
        author: 'other',
        response: 'x',
      }];
      const name = 'me';
      expect(showResponseForm(responseType, responses, sessionStatus, name)).to.deep.equal(expected);
    });
    it('returns true for Choices(allowMultiple=fale) when self has not responded', () => {
      const sessionStatus = 'initial';
      const responseType = {
        type: 'Choices',
        allowMultiple: false,
      };
      const expected = true;
      const responses = [{
        author: 'other',
        response: 'x',
      }];
      const name = 'me';
      expect(showResponseForm(responseType, responses, sessionStatus, name)).to.deep.equal(expected);
    });
  });
});
