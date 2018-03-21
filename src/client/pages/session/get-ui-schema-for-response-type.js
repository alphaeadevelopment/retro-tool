import update from 'immutability-helper';
import clone from 'lodash/clone';

const defaultUiSchema = {
};

const multiChoiceSpec = {
  'ui:widget': { $set: 'checkboxes' },
};
const singleChoiceSpec = {
  'ui:widget': { $set: 'radio' },
  'ui:options': { $set: { 'inline': true } },
};
const oneToTenSpec = {
  'ui:widget': { $set: 'radio' },
  'ui:options': { $set: { 'inline': true } },
};

export default (responseType) => { // eslint-disable-line no-unused-vars
  switch (responseType.type) {
    case 'Choices':
      return update(defaultUiSchema, responseType.allowMultiple ? multiChoiceSpec : singleChoiceSpec);
    case '1 to 10':
      return update(defaultUiSchema, oneToTenSpec);
    default:
      return clone(defaultUiSchema);
  }
};
