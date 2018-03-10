import React from 'react';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Left from 'material-ui-icons/KeyboardArrowLeft';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import ParticipantList from './ParticipantList';
import ResponseTypePanel from './ResponseTypePanel';

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
export const RawSession = ({ classes, session, onLeaveSession, onAddResponse, ...rest }) => (
  <div className={classes.root}>
    <Header className={classes.header}>
      <IconButton onClick={onLeaveSession}><Left /></IconButton>
      <Typography variant={'display1'}>Session: {session.id}</Typography>
    </Header>
    <Grid container spacing={0} className={classes.sessionBody} >
      <Grid item xs={12} sm={5} lg={3}>
        <ParticipantList owner={session.owner} participants={session.participants} />
      </Grid>
      <Grid item xs={12} sm={7} lg={9}>
        <Grid container>
          {keys(session.responseTypes).map(rt => (
            <Grid item xs={12} lg={4} key={rt}>
              <ResponseTypePanel
                responseType={session.responseTypes[rt]}
                responses={filter(session.responses, r => r.responseType === rt)}
                onAdd={onAddResponse(rt)}
                {...rest}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </div>
);
export default withStyles(styles)(RawSession);
