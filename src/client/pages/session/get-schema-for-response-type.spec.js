/* globals describe, it */
import { expect } from 'chai';

import getSchemaForResponseType from './get-schema-for-response-type';

describe('getSchemaForResponseType', () => {
  describe('Choices', () => {
    it('returns expected schema - control', () => {
      const responseType = {
        type: 'Choices',
        choices: ['One', 'Two', 'Three'],
      };
      const expected = {
        'type': 'string',
        'enum': ['One', 'Two', 'Three'],
      };
      expect(getSchemaForResponseType(responseType)).to.deep.equal(expected);
    });
    it('returns expected schema - allow multiple', () => {
      const responseType = {
        type: 'Choices',
        allowMultiple: true,
        choices: ['One', 'Two', 'Three'],
      };
      const expected = {
        type: 'array',
        items: {
          type: 'string',
          enum: ['One', 'Two', 'Three'],
        },
        uniqueItems: true,
      };
      expect(getSchemaForResponseType(responseType)).to.deep.equal(expected);
    });
  });
});
