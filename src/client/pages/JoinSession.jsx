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
const emptyFormData = (withSession) => {
  const rv = {
    name: '',
  };
  if (withSession) {
    rv.session = '';
  }
  return rv;
};
class RawJoinSession extends React.Component {
  state = {
    formData: emptyFormData(!this.props.sessionId),
    displayForm: false,
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.sessionId && !this.props.sessionId) {
      this.setState({ displayForm: true, formData: emptyFormData(false) });
    }
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onSubmit = ({ formData }) => {
    const { onJoinSession, sessionId } = this.props;
    const { name, session } = formData;
    onJoinSession(name, session || sessionId);
    this.setState({ displayForm: false });
    this.clearForm();
  }
  onClickJoinSession = () => {
    this.setState({ displayForm: true });
  }
  onCancel = () => {
    this.setState({ displayForm: false });
    this.clearForm();
  }
  clearForm = () => {
    this.setState({ formData: emptyFormData(!this.props.sessionId) });
  }
  formSchema = (withSession) => {
    const rv = {
      type: 'object',
      title: 'Join Session',
      properties: {
        name: {
          title: 'Your Name',
          type: 'string',
        },
      },
    };
    if (withSession) {
      rv.properties.session = {
        title: 'Session',
        type: 'string',
      };
    }
    return rv;
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
              schema={this.formSchema(!this.props.sessionId)}
              onCancel={this.onCancel}
              onSubmit={this.onSubmit}
              formData={formData}
              onChange={this.onChange}
            />}
          </div>
        </Modal>
        <Button className={classes.button} variant={'raised'} onClick={this.onClickJoinSession}>
          Join Session
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(RawJoinSession);
