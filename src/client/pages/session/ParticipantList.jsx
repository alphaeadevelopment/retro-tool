import React from 'react';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    'margin': theme.spacing.unit * 2,
    'padding': theme.spacing.unit * 2,
    '&>div': {
      'marginTop': theme.spacing.unit,
      '&>table': {
        width: '100%',
      },
    },
  },
});
export const RawParticipantList = ({ isOwner, classes, owner, participants, responses }) => (
  <Paper className={classes.root}>
    <Typography variant={'subheading'}>Participants</Typography>
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {isOwner && <th>Responses</th>}
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {keys(participants).map((p) => {
            const numResponses = filter(responses, r => r.author === p).length;
            return (
              <tr key={p}>
                <td>
                  <span>{participants[p].name}</span>
                  {owner === p && <span> *</span>}
                </td>
                {isOwner && <td>{numResponses}</td>}
                <td>{participants[p].votes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Paper>
);
export default withStyles(styles)(RawParticipantList);
