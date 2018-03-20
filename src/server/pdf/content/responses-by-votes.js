import forEach from 'lodash/forEach';
import orderBy from 'lodash/orderBy';
import reverse from 'lodash/reverse';

import addText from './add-text';

const inOrder = r => reverse(orderBy(r, 'votes'));

export default (responseType, responses, page) => {
  forEach(inOrder(responses), (r) => {
    addText(page, `${r.response}: ${r.votes}`, 'body');
  });
};
