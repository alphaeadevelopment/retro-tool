import update from 'immutability-helper';

const defaultFormData = type => ({
  question: '',
  type,
});

export default (type) => {
  switch (type) {
    case 'Agree/Disagree':
      return update(defaultFormData(type), {
        allowMultiple: { $set: false },
      });
    case 'Choices':
      return update(defaultFormData(type), {
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
