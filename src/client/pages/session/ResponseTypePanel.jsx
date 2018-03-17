import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import NewResponseForm from './NewResponseForm';
import * as Selectors from '../../selectors';
import ResponseDisplay from './ResponseDisplay';
import showResponseForm from './show-response-form';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
});
export const RawResponseTypePanel = ({
  classes, name, responseType, responses, onAdd, sessionStatus, ...rest
}) => {
  const showForm = showResponseForm(responseType, responses, sessionStatus, name);
  return (
    <Paper className={classes.root}>
      <Typography variant={'subheading'}>{responseType.title}</Typography>
      <ResponseDisplay sessionStatus={sessionStatus} responses={responses} responseType={responseType} {...rest} />
      {showForm && <NewResponseForm onAdd={onAdd} responseType={responseType} />}
    </Paper>
  );
};

const mapStateToProps = state => ({
  votes: Selectors.getVotes(state),
});
export default connect(mapStateToProps)(withStyles(styles)(RawResponseTypePanel));
