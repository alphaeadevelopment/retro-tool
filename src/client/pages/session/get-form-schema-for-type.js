import update from 'immutability-helper';
import clone from 'lodash/clone';

const defaultSchema = {
  type: 'object',
  properties: {
    question: {
      title: 'Title',
      type: 'string',
    },
    type: {
      title: 'Type',
      type: 'string',
      enum: ['Text', 'Number', 'Yes/No', 'Choices', '1 to 10', 'Agree/Disagree'],
    },
  },
};
const choicesProperties = {
  choices: {
    title: 'Choices',
    type: 'array',
    items: {
      type: 'string',
      default: '',
    },
  },
  allowMultiple: {
    title: 'Allow Multiple',
    type: 'boolean',
  },
};
const textProperties = {
  allowMultiple: {
    title: 'Allow Multiple',
    type: 'boolean',
  },
};

export default (type) => {
  switch (type) {
    case 'Choices':
      return update(defaultSchema, { properties: { $merge: choicesProperties } });
    case 'Text':
      return update(defaultSchema, { properties: { $merge: textProperties } });
    default:
      return clone(defaultSchema);
  }
};
