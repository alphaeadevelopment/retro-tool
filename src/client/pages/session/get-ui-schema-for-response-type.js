
export default (responseType) => { // eslint-disable-line no-unused-vars
  const rv = {};

  if (responseType.type === 'Choices') {
    if (responseType.allowMultiple) {
      rv['ui:widget'] = 'checkboxes';
    }
    else {
      rv['ui:widget'] = 'radio';
      rv['ui:options'] = { inline: true };
    }
  }
  return rv;
};
