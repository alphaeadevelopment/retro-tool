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
import IconButton from 'material-ui/IconButton';
import Star from 'material-ui-icons/Star';
import StarBorder from 'material-ui-icons/StarBorder';
import NewResponseForm from './NewResponseForm';
import * as Selectors from '../../selectors';

const sortResponses = responses => reverse(sortBy(responses, r => r.votes));

const Response = ({ response, className, voted, onUpVote, onCancelUpVote, sessionStatus }) => (
  <li className={className}>
    <Typography>
      {response.response} {sessionStatus === 'discuss' && <span>({response.votes})</span>}
    </Typography>
    {sessionStatus === 'voting' &&
      <div>
        {voted && <IconButton onClick={onCancelUpVote}><Star /></IconButton>}
        {!voted && <IconButton onClick={onUpVote}><StarBorder /></IconButton>}
      </div>
    }
  </li>
);
const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  responsesCtr: {
    padding: 0,
  },
  itemCtr: {
    'display': 'flex',
    'alignItems': 'center',
    'margin': `${theme.spacing.unit}px 0`,
    '&>p': {
      'flex': 8,
    },
    '& button': {
      'width': 'initial',
      'height': 'initial',
      'margin': `0 ${theme.spacing.unit}px`,
    },
  },
});
export const RawResponseTypePanel = ({
  classes, responseType, responses, onAdd, onUpVote, onCancelUpVote, votes, sessionStatus, ...rest
}) => {
  const typedVotes = filter(votes, v => find(responses, r => r.id === v));
  const sortedResponses = (sessionStatus === 'discuss') ? sortResponses(responses) : responses;
  return (
    <Paper className={classes.root}>
      <Typography variant={'subheading'}>{responseType.title}</Typography>
      <ul className={classes.responsesCtr}>
        {sortedResponses.map(r => (
          <Response
            onUpVote={typedVotes.length < 3 && onUpVote(r.id)}
            onCancelUpVote={onCancelUpVote(r.id)}
            key={r.id}
            className={classes.itemCtr}
            response={r}
            voted={includes(typedVotes, r.id)}
            sessionStatus={sessionStatus}
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
