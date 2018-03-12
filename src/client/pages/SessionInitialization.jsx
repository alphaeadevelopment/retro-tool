import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import JoinSession from './JoinSession';
import CreateSession from './CreateSession';

const styles = theme => ({
  'root': {
    'textAlign': 'center',
    [theme.breakpoints.up('xs')]: {
      width: '100%',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    '&>div': {
      'margin': theme.spacing.unit * 5,
      '&>button': {
        'padding': `${theme.spacing.unit * 3}px ${theme.spacing.unit * 5}px`,
        'width': '100%',
        'fontSize': '1.5rem',
      },
    },
  },
});
export const RawSessionInit = ({ classes, onCreateSession, onJoinSession, sessionId }) => (
  <div className={classes.root}>
    <CreateSession onCreateSession={onCreateSession} />
    <JoinSession onJoinSession={onJoinSession} sessionId={sessionId} />
  </div>
);
export default withRouter(withStyles(styles)(RawSessionInit));
