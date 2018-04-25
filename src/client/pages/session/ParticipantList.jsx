import React from 'react';
import keys from 'lodash/keys';
import classNames from 'classnames';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import hasAnonymity from './has-anonymity';

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
  disconnected: {
    textDecoration: 'line-through',
    opacity: 0.6,
  },
});
export const RawParticipantList = ({ isOwner, classes, owner, participants, responses }) => {
  const isAnonymous = hasAnonymity(responses);
  return (
    <Paper className={classes.root}>
      <Typography variant={'subheading'}>Participants</Typography>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {isOwner && <TableCell>Responses</TableCell>}
              <TableCell>Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys(participants).map((p) => {
              const numResponses = filter(responses, r => r.author === p).length;
              return (
                <TableRow key={p}>
                  <TableCell>
                    <span className={classNames({ [classes.disconnected]: !participants[p].connected })}>
                      {participants[p].name}
                    </span>
                    {owner === p && <span> *</span>}
                  </TableCell>
                  {isOwner && <TableCell>{isAnonymous ? numResponses : '-'}</TableCell>}
                  <TableCell>{isAnonymous ? participants[p].votes : '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};
export default withStyles(styles)(RawParticipantList);
