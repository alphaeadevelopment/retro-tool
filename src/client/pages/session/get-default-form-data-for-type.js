import update from 'immutability-helper';

const defaultFormData = type => ({
  question: '',
  type,
});

export default (type) => {
  switch (type) {
    case 'Choices':
      return update(defaultFormData(type), {
        type: { $set: type },
        choices: { $set: [] },
        allowMultiple: { $set: true },
      });
    case 'Text':
      return update(defaultFormData(type), {
        allowMultiple: { $set: true },
      });
    default:
      return defaultFormData(type);
  }
};
