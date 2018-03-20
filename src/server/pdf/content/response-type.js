import responseByVotes from './responses-by-votes';
import responsesByOccurrence from './responses-by-occurrence';

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
  page.fontSize(25).text(rt.title).fontSize(20).moveDown(2);
  const renderer = getResponseRenderer(rt);
  renderer(rt, responses, page);
};
