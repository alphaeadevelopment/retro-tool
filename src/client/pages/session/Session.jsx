/* globals window */
import React from 'react';
import parseuri from 'parseuri';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import Left from '@material-ui/icons/KeyboardArrowLeft';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ParticipantList from './ParticipantList';
import ResponseTypes from './ResponseTypes';

const SessionButtons = ({ className, sessionStatus, onChangeStatus }) => (
  <div className={className}>
    {sessionStatus === 'initial' && <Button onClick={onChangeStatus('voting')}>Open for Voting</Button>}
    {sessionStatus === 'voting' && <Button onClick={onChangeStatus('initial')}>Re-open for comments</Button>}
    {sessionStatus === 'voting' && <Button onClick={onChangeStatus('discuss')}>Close Voting</Button>}
    {sessionStatus === 'discuss' && <Button onClick={onChangeStatus('voting')}>Re-open for Voting</Button>}
  </div>
);

const styles = theme => ({
  'root': {
  },
  'sessionBody': {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: theme.spacing.unit * 2,
  },
  'header': {
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
    '& $pdfLink': {
      marginLeft: '3em',
    },
  },
  'pdfLink': {},
  'sessionButtons': {
    marginTop: theme.spacing.unit * 2,
  },
});
export const RawSession = ({
  classes, name, isOwner, session, onLeaveSession, onAddResponse, onChangeStatus, ...rest
}) => {
  const { protocol, authority } = parseuri(window.location.href);
  const homeUrl = `${protocol}://${authority}`;
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div>
          <Typography variant={'display3'}><a href={homeUrl}>Retrospective Tool</a></Typography>
          <Typography variant={'display1'}>{name}</Typography>
        </div>
        <div>
          <IconButton onClick={onLeaveSession}><Left /></IconButton>
          {isOwner && <Typography variant={'display1'}>{homeUrl}/#/{session.id}</Typography>}
        </div>
        {session.status === 'discuss' &&
          <div className={classes.pdfLink}>
            <a href={`/pdf/${session.id}`}>Download as PDF</a>
          </div>
        }
      </div>
      <Grid container spacing={0} className={classes.sessionBody} >
        <Grid item sm={12} md={5} lg={3}>
          <ParticipantList
            responses={session.responses}
            owner={session.owner}
            isOwner={isOwner}
            participants={session.participants}
          />
        </Grid>
        <Grid item sm={12} md={7} lg={9}>
          <ResponseTypes isOwner={isOwner} session={session} onAddResponse={onAddResponse} name={name} {...rest} />
        </Grid>
      </Grid>
      {isOwner && <Divider />}
      {isOwner &&
        <SessionButtons
          className={classes.sessionButtons}
          onChangeStatus={onChangeStatus}
          sessionStatus={session.status}
        />
      }
    </div>
  );
};
export default withStyles(styles)(RawSession);
