import React from 'react';
import keys from 'lodash/keys';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Left from 'material-ui-icons/KeyboardArrowLeft';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import ParticipantList from './ParticipantList';
import ResponseSection from './ResponseSection';

const Header = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  sessionBody: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
});
export const RawSession = ({ classes, session, onLeaveSession, onAddResponse }) => (
  <div className={classes.root}>
    <Header className={classes.header}>
      <IconButton onClick={onLeaveSession}><Left /></IconButton>
      <Typography variant={'heading'}>Session: {session.id}</Typography>
    </Header>
    <Grid container spacing={0} className={classes.sessionBody} >
      <Grid item xs={12} sm={5} lg={3}>
        <ParticipantList owner={session.owner} participants={session.participants} />
      </Grid>
      <Grid item xs={12} sm={7} lg={9}>
        <Grid container>
          {keys(session.responses).map(r => (
            <Grid item xs={12} lg={4}>
              <ResponseSection key={r} responseId={r} responses={session.responses[r]} onAdd={onAddResponse(r)} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </div>
);
export default withStyles(styles)(RawSession);
