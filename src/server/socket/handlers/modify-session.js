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
    case 'discuss':
      return mapValues(responses, r => ({ ...r, votes: r.votes.length }));
    default:
      return responses;
  }
};

export default (session, name) => ({
  ...session,
  sockets: undefined,
  responses: modifyResponses(filterResponses(session.responses, session.status, name), session.status, name),
});
