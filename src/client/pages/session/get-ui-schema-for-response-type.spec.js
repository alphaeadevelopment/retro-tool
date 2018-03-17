/* globals describe, it */
import { expect } from 'chai';

import getUiSchemaForResponseType from './get-ui-schema-for-response-type';

describe('getSchemaForResponseType', () => {
  describe('Choices', () => {
    it('returns expected schema - control', () => {
      const responseType = {
        type: 'Choices',
      };
      const expected = {
        'ui:widget': 'radio',
        'ui:options': {
          'inline': true,
        },
      };
      expect(getUiSchemaForResponseType(responseType)).to.deep.equal(expected);
    });
    it('returns expected schema - allowMultiple', () => {
      const responseType = {
        type: 'Choices',
        allowMultiple: true,
      };
      const expected = {
        'ui:widget': 'checkboxes',
      };
      expect(getUiSchemaForResponseType(responseType)).to.deep.equal(expected);
    });
  });
});
