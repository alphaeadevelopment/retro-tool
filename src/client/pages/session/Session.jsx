import React from 'react';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Left from 'material-ui-icons/KeyboardArrowLeft';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ParticipantList from './ParticipantList';
import ResponseTypePanel from './ResponseTypePanel';

const SessionButtons = ({ sessionStatus, onChangeStatus }) => (
  <div>
    {sessionStatus === 'initial' && <Button onClick={onChangeStatus('voting')}>Open for Voting</Button>}
    {sessionStatus === 'voting' && <Button onClick={onChangeStatus('initial')}>Re-open for comments</Button>}
    {sessionStatus === 'voting' && <Button onClick={onChangeStatus('discuss')}>Close Voting</Button>}
    {sessionStatus === 'discuss' && <Button onClick={onChangeStatus('voting')}>Re-open for Voting</Button>}
  </div>
);

const styles = theme => ({
  root: {
  },
  sessionBody: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: theme.spacing.unit * 2,
  },
  header: {
    'alignItems': 'center',
    '&>div': {
      'display': 'flex',
      'alignItems': 'center',
      '&:first-child': {
        'justifyContent': 'space-between',
        'background': theme.palette.primary.dark,
        '& *': {
          color: theme.palette.primary.contrastText,
        },
        'padding': `0 ${theme.spacing.unit * 2}px`,
      },
      '&:nth-child(2)': {
        justifyContent: 'flex-start',
      },
    },
  },
});
export const RawSession = ({ classes, name, isOwner, session, onLeaveSession, onAddResponse, onChangeStatus, ...rest }) => (
  <div className={classes.root}>
    <div className={classes.header}>
      <div>
        <Typography variant={'display3'}>Retrospective Tool</Typography>
        <Typography variant={'display1'}>{name}</Typography>
      </div>
      <div>
        <IconButton onClick={onLeaveSession}><Left /></IconButton>
        <Typography variant={'display1'}>Session: {session.id}</Typography>
      </div>
    </div>
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
                sessionStatus={session.status}
                {...rest}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    {isOwner && <SessionButtons onChangeStatus={onChangeStatus} sessionStatus={session.status} />}
  </div>
);
export default withStyles(styles)(RawSession);
