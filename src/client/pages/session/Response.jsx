import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Feedback from '@material-ui/icons/Feedback';
import Delete from '@material-ui/icons/Delete';
import Form from 'material-ui-jsonschema-form';
import Modal from 'material-ui/Modal';
import Tooltip from 'material-ui/Tooltip';

const styles = theme => ({
  root: {
    'display': 'flex',
    'alignItems': 'center',
    'margin': `${theme.spacing.unit}px 0`,
    '&>p': {
      'flex': 8,
    },
    '& button': {
      'width': 'initial',
      'height': 'initial',
      'margin': `0 ${theme.spacing.unit}px`,
    },
    '&$outsideTopThree': {
      opacity: '0.5',
    },
  },
  outsideTopThree: {},
  formCtr: {
    width: '50%',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
  responseText: {
    '&$flagged': {
      textDecoration: 'line-through',
      opacity: '0.5',
    },
  },
  flagged: {},
});
export class RawResponse extends React.Component {
  state = {
    displayForm: false,
    formData: {
      message: '',
    },
  }
  onSubmit = ({ formData }) => {
    const { message } = formData;
    const { onSendFeedback } = this.props;
    this.setState({ displayForm: false });
    this.clearForm();
    if (this.props.onSendFeedback) onSendFeedback(message);
  }
  onCancel = () => {
    this.setState({ displayForm: false });
    this.clearForm();
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onClickSendFeedback = () => {
    this.setState({ displayForm: true });
  }
  clearForm = () => {
    this.setState({ formData: { message: '' } });
  }
  formSchema = {
    type: 'object',
    properties: {
      message: {
        title: 'Message',
        type: 'string',
      },
    },
  }
  render() {
    const {
      classes, response, voted, onUpVote, onCancelUpVote, sessionStatus, topThree, isOwner, name, onDeleteResponse,
    } = this.props;
    const voting = sessionStatus === 'voting';
    const ownResponse = (name === response.author);
    const { formData, displayForm } = this.state;
    const initial = sessionStatus === 'initial';
    return (
      <li
        className={classNames(
          classes.root,
          { [classes.outsideTopThree]: sessionStatus === 'discuss' && !topThree },
        )}
      >
        <Typography className={classNames(classes.responseText, { [classes.flagged]: response.flagged })}>
          {String(response.response)} {sessionStatus === 'discuss' && <span>({response.votes})</span>}
        </Typography>
        <div>
          {voting && voted && !ownResponse && <IconButton onClick={onCancelUpVote}><Star /></IconButton>}
          {voting && !voted && !ownResponse && <IconButton onClick={onUpVote}><StarBorder /></IconButton>}
          {initial && isOwner && !ownResponse && this.props.onAddResponseType && !response.flagged &&
            <Tooltip title={'Block this response'}>
              <IconButton onClick={this.onClickSendFeedback}>
                <Feedback />
              </IconButton>
            </Tooltip>
          }
          {ownResponse && sessionStatus === 'initial' && !response.flagged &&
            <Tooltip title={'Delete'}>
              <IconButton onClick={onDeleteResponse(response.id)}>
                <Delete />
              </IconButton>
            </Tooltip>
          }
          {response.flagged &&
            <Tooltip title={response.message}>
              <IconButton>
                <Feedback style={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          }
        </div>
        <Modal open={displayForm} onClose={this.onCancel} disableEnforceFocus>
          <div className={classes.formCtr}>
            {displayForm && <Form
              schema={this.formSchema}
              onCancel={this.onCancel}
              onSubmit={this.onSubmit}
              formData={formData}
              onChange={this.onChange}
            />}
          </div>
        </Modal>
      </li>
    );
  }
}


export default withStyles(styles)(RawResponse);
