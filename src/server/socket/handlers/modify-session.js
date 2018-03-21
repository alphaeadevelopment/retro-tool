import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

const ownResponsesFilter = name => response => response.author === name;
const notFlaggedFilter = response => !response.flagged;

const filterResponses = (responses, status, name, owner) => {
  switch (status) {
    case 'initial':
      return name === owner ? responses : pickBy(responses, ownResponsesFilter(name));
    case 'voting':
      return name === owner ? responses : pickBy(responses, notFlaggedFilter);
    case 'discuss':
      return pickBy(responses, notFlaggedFilter);
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
  responses: modifyResponses(filterResponses(session.responses, session.status, name, session.owner), session.status, name),
});
