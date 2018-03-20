import responseByVotes from './responses-by-votes';
import responsesByOccurrence from './responses-by-occurrence';
import addText from './add-text';

const getResponseRenderer = (responseType) => {
  switch (responseType.type) {
    case 'Choices':
    case 'Yes/No':
    case 'Number':
      return responsesByOccurrence;
    case 'text':
    default:
      return responseByVotes;
  }
};

export default (rt, responses, page) => {
  addText(page, rt.title, 'heading').moveDown();
  const renderer = getResponseRenderer(rt);
  renderer(rt, responses, page);
};
