import React from 'react';
import { withStyles } from 'material-ui/styles';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';

const styles = theme => ({
  'root': {
    'position': 'absolute',
    'left': '50%',
    'top': '50%',
    'transform': 'translateX(-50%) translateY(-50%)',
    'textAlign': 'center',
    '&>div': {
      'margin': theme.spacing.unit * 2,
      '&>button': {
        width: '100%',
      },
    },
  },
});
export const RawSessionInit = ({ classes, onCreateSession, onJoinSession }) => (
  <div className={classes.root}>
    <JoinSession onJoinSession={onJoinSession} />
    <CreateSession onCreateSession={onCreateSession} />
  </div>
);
export default withStyles(styles)(RawSessionInit);
