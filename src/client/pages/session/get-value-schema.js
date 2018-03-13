const mapType = (type) => {
  switch (type) {
    case 'Number':
      return 'integer';
    case 'Yes/No':
      return 'boolean';
    case 'Text':
    default:
      return 'string';
  }
};

export default (responseType) => {
  const rv = {
    type: mapType(responseType.type),
  };
  return rv;
};
