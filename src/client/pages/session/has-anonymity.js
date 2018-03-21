import size from 'lodash/size';
import values from 'lodash/values';
import uniq from 'lodash/uniq';

export default (responses) => {
  const numResponses = size(responses);
  const authors = uniq(values(responses).map(r => r.author));
  return size(authors) >= 2 && numResponses > 4;
};
