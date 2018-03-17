export default (responseType) => {
  switch (responseType.type) {
    case 'Number':
      return '';
    case 'Yes/No':
      return false;
    case 'Choices':
      return [];
    case 'Text':
    default:
      return '';
  }
};
