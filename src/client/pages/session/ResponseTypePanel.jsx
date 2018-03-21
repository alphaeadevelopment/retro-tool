import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui-icons/Delete';
import Tooltip from 'material-ui/Tooltip';
import NewResponseForm from './NewResponseForm';
import * as Selectors from '../../selectors';
import ResponseDisplay from './ResponseDisplay';
import showResponseForm from './show-response-form';

const styles = theme => ({
  root: {
    'margin': theme.spacing.unit * 2,
    'padding': theme.spacing.unit * 2,
    '&>div:first-child': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  },
});
export const RawResponseTypePanel = ({
  classes, name, responseType, responses, onAdd, sessionStatus, isOwner, onDeleteResponseType, ...rest
}) => {
  const showForm = showResponseForm(responseType, responses, sessionStatus, name);
  return (
    <Paper className={classes.root}>
      <div>
        {isOwner && sessionStatus === 'initial' &&
          <Tooltip title={'Delete'}>
            <IconButton onClick={onDeleteResponseType(responseType.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        }
        <Typography variant={'subheading'}>{responseType.title}</Typography>
      </div>
      <ResponseDisplay
        isOwner={isOwner}
        name={name}
        sessionStatus={sessionStatus}
        responses={responses}
        responseType={responseType}
        {...rest}
      />
      {showForm && <NewResponseForm onAdd={onAdd} responseType={responseType} />}
    </Paper>
  );
};

const mapStateToProps = state => ({
  votes: Selectors.getVotes(state),
});
export default connect(mapStateToProps)(withStyles(styles)(RawResponseTypePanel));
