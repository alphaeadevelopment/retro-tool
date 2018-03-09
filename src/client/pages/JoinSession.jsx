import React from 'react';
import { withStyles } from 'material-ui/styles';
import Form from '@alphaeadev/material-ui-jsonschema-form';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

const styles = {
  formCtr: {
    width: '50%',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
};
class RawJoinSession extends React.Component {
  state = {
    formData: {
      name: '',
      session: '',
    },
    displayForm: false,
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onSubmit = ({ formData }) => {
    const { onJoinSession } = this.props;
    const { name, session } = formData;
    onJoinSession(name, session);
    this.setState({ displayForm: false });
  }
  onClickJoinSession = () => {
    this.setState({ displayForm: true });
  }
  onCancel = () => {
    this.setState({ displayForm: false });
  }
  formSchema = {
    type: 'object',
    properties: {
      name: {
        title: 'Your Name',
        type: 'string',
      },
      session: {
        title: 'Session Id',
        type: 'string',
      },
    },
  }
  render() {
    const { formData, displayForm } = this.state;
    const { authErrorMessage, classes } = this.props;

    return (
      <div className={classes.login}>
        {authErrorMessage && <p className={classes.errorMessage}>{authErrorMessage}</p>}
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
        <Button className={classes.loginButton} variant={'raised'} onClick={this.onClickJoinSession}>
          Join Session
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(RawJoinSession);
