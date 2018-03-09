import React from 'react';
import keys from 'lodash/keys';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import ParticipantList from './ParticipantList';
import ResponseSection from './ResponseSection';

const styles = {
  root: {

  },
};
export const RawSession = ({ classes, session, onLeaveSession, onAddResponse }) => (
  <div className={classes.root}>
    <Button className={classes.loginButton} variant={'raised'} onClick={onLeaveSession}>
      Leave Session
    </Button>
    {session.id}
    <ParticipantList owner={session.owner} participants={session.participants} />
    {
      keys(session.responses).map(r =>
        <ResponseSection key={r} responseId={r} responses={session.responses[r]} onAdd={onAddResponse(r)} />,
      )
    }
  </div>
);
export default withStyles(styles)(RawSession);
