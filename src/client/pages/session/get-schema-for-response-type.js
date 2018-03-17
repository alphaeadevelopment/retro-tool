const mapType = (responseType) => {
  switch (responseType.type) {
    case 'Number':
      return 'integer';
    case 'Yes/No':
      return 'boolean';
    case 'Choices':
      return responseType.allowMultiple ? 'array' : 'string';
    case 'Text':
    default:
      return 'string';
  }
};

export default (responseType) => {
  const type = mapType(responseType);
  const rv = {
    type,
  };
  if (responseType.type === 'Choices') {
    if (responseType.allowMultiple) {
      rv.items = {
        type: 'string',
        enum: responseType.choices,
      };
      rv.uniqueItems = true;
    }
    else {
      rv.enum = responseType.choices;
    }
  }
  return rv;
};
