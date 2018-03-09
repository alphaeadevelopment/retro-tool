import React from 'react';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {

  },
};
export const RawParticipantList = ({ classes, owner, participants }) => (
  <div className={classes.root}>
    <ul>
      <li>{owner} *</li>
      {participants.map(p => <li key={p}>{p}</li>)}
    </ul>
  </div>
);
export default withStyles(styles)(RawParticipantList);
