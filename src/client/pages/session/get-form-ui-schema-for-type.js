import update from 'immutability-helper';
import clone from 'lodash/clone';

const defaultUiSchema = {
};
const singleRowChoicesProperties = {
  choices: {
    'ui:widget': 'radio',
    'ui:options': 'row',
  },
};
const onePerRowChoicesProperties = {
  choices: {
    'ui:widget': 'radio',
  },
};
const textProperties = {
};

export default (type) => {
  switch (type) {
    case '1 to 10':
    case 'Choices':
      return update(defaultUiSchema, { $merge: singleRowChoicesProperties });
    case 'Agree/Disagree':
      return update(defaultUiSchema, { $merge: onePerRowChoicesProperties });
    case 'Text':
      return update(defaultUiSchema, { $merge: textProperties });
    default:
      return clone(defaultUiSchema);
  }
};
