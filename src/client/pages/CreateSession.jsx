import React from 'react';
import { withStyles } from 'material-ui/styles';
import Form from 'material-ui-jsonschema-form';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';

const styles = theme => ({
  formCtr: {
    [theme.breakpoints.up('xs')]: {
      width: '100%',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
      left: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
  },
  button: {
    [theme.breakpoints.up('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: '75%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
  },
});
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
    title: 'Host new session',
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
        <Button className={classes.button} variant={'raised'} onClick={this.onClickCreateSession}>
          Host New Session
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(RawCreateSession);
