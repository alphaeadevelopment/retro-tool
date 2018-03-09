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
class RawCreateSession extends React.Component {
  state = {
    formData: {
      name: '',
    },
    displayForm: false,
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onSubmit = ({ formData }) => {
    const { onCreateSession } = this.props;
    const { name } = formData;
    onCreateSession(name);
    this.setState({ displayForm: false });
  }
  onClickCreateSession = () => {
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
    },
  }
  render() {
    const { formData, displayForm } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.login}>
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
        <Button className={classes.loginButton} variant={'raised'} onClick={this.onClickCreateSession}>
          Create Session
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(RawCreateSession);
