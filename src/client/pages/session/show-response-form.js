import filter from 'lodash/filter';

const showForType = (selfHasResponded, responseType) => {
  switch (responseType.type) {
    case 'Choices':
      return !selfHasResponded;
    default:
      return (selfHasResponded) ? Boolean(responseType.allowMultiple) : true;
  }
};
export default (responseType, responses, sessionStatus, name) => {
  const selfHasResponded = filter(responses, r => r.author === name).length !== 0;
  switch (sessionStatus) {
    case 'initial':
      return showForType(selfHasResponded, responseType);
    default:
      return false;
  }
};
