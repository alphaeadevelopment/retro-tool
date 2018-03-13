export default (type) => {
  switch (type) {
    case 'Number':
      return '';
    case 'Yes/No':
      return false;
    case 'Text':
    default:
      return '';
  }
};
