import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

const ownResponsesFilter = name => response => response.author === name;

const filterResponses = (responses, status, name) => {
  switch (status) {
    case 'initial':
      return pickBy(responses, ownResponsesFilter(name));
    default:
      return responses;
  }
};

const modifyResponses = (responses, status) => {
  switch (status) {
    case 'voting':
    case 'initial':
      return mapValues(responses, r => omit(r, 'votes'));
    default:
      return responses;
  }
};

export default (session, name) => ({
  ...session,
  responses: modifyResponses(filterResponses(session.responses, session.status, name), session.status, name),
});
