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
const agreementSpec = {
  'ui:widget': { $set: 'radio' },
  'ui:options': { $set: { 'inline': false } },
};

export default (responseType) => { // eslint-disable-line no-unused-vars
  switch (responseType.type) {
    case 'Choices':
      return update(defaultUiSchema, responseType.allowMultiple ? multiChoiceSpec : singleChoiceSpec);
    case '1 to 10':
      return update(defaultUiSchema, singleChoiceSpec);
    case 'Agree/Disagree':
      return update(defaultUiSchema, agreementSpec);
    default:
      return clone(defaultUiSchema);
  }
};
