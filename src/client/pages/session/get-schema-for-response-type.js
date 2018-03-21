const mapType = (responseType) => {
  switch (responseType.type) {
    case 'Number':
    case '1 to 10':
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
  else if (responseType.type === '1 to 10') {
    rv.enum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
  else if (responseType.type === 'Agree/Disagree') {
    rv.enum = [
      'Strongly agree', 'Somewhat agree', 'Neither agree nor disagree', 'Somewhat disagree', 'Strongly disagree',
    ];
  }
  return rv;
};
