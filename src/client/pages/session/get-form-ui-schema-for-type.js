import update from 'immutability-helper';
import clone from 'lodash/clone';

const defaultUiSchema = {
};
const choicesProperties = {
  choices: {
    'ui:widget': 'radio',
    'ui:options': 'row',
  },
};
const textProperties = {
};

export default (type) => {
  switch (type) {
    case '1 to 10':
    case 'Choices':
      return update(defaultUiSchema, { $merge: choicesProperties });
    case 'Text':
      return update(defaultUiSchema, { $merge: textProperties });
    default:
      return clone(defaultUiSchema);
  }
};
