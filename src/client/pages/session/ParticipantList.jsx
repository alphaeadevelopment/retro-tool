import React from 'react';
import keys from 'lodash/keys';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    'margin': theme.spacing.unit * 2,
    'padding': theme.spacing.unit * 2,
    '&>ul': {
      'marginTop': theme.spacing.unit,
      '&>li': {
        listStyle: 'none',
      },
    },
  },
});
export const RawParticipantList = ({ classes, owner, participants }) => (
  <Paper className={classes.root}>
    <Typography variant={'subheading'}>Participants</Typography>
    <ul>
      <li>{owner} *</li>
      {keys(participants).map(p => <li key={p}>{participants[p].name}</li>)}
    </ul>
  </Paper>
);
export default withStyles(styles)(RawParticipantList);
