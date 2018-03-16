import React from 'react';
import { withStyles } from 'material-ui/styles';
import filter from 'lodash/filter';
import find from 'lodash/find';
import includes from 'lodash/includes';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import Response from './Response';

const sortResponses = responses => reverse(sortBy(responses, r => r.votes));
const styles = {
  responsesCtr: {
    padding: 0,
  },
};

export const RawResponsesList = ({
  classes, votes, responses, sessionStatus, onCancelUpVote, onSendFeedback, onUpVote, ...rest
}) => {
  const typedVotes = filter(votes, v => find(responses, r => r.id === v));
  const sortedResponses = (sessionStatus === 'discuss') ? sortResponses(responses) : responses;
  return (
    <ul className={classes.responsesCtr}>
      {sortedResponses.map((r, idx) => (
        <Response
          topThree={idx <= 2}
          onUpVote={typedVotes.length < 3 ? onUpVote(r.id) : undefined}
          onCancelUpVote={onCancelUpVote(r.id)}
          key={r.id}
          response={r}
          voted={includes(typedVotes, r.id)}
          sessionStatus={sessionStatus}
          onSendFeedback={onSendFeedback(r.id)}
          {...rest}
        />
      ))}
    </ul>
  );
};
export default withStyles(styles)(RawResponsesList);
