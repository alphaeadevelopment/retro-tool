import React from 'react';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import find from 'lodash/find';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import NewResponseForm from './NewResponseForm';
import * as Selectors from '../../selectors';
import Response from './Response';

const sortResponses = responses => reverse(sortBy(responses, r => r.votes));
const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  responsesCtr: {
    padding: 0,
  },
});
export const RawResponseTypePanel = ({
  classes, responseType, responses, onAdd, onUpVote, onCancelUpVote, votes, sessionStatus,
  onSendFeedback, ...rest
}) => {
  const typedVotes = filter(votes, v => find(responses, r => r.id === v));
  const sortedResponses = (sessionStatus === 'discuss') ? sortResponses(responses) : responses;
  return (
    <Paper className={classes.root}>
      <Typography variant={'subheading'}>{responseType.title}</Typography>
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
      {sessionStatus === 'initial' && <NewResponseForm onAdd={onAdd} />}
    </Paper>
  );
};

const mapStateToProps = state => ({
  votes: Selectors.getVotes(state),
});
export default connect(mapStateToProps)(withStyles(styles)(RawResponseTypePanel));
