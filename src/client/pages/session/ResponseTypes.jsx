import React from 'react';
import Form from 'material-ui-jsonschema-form';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ResponseTypePanel from './ResponseTypePanel';

const styles = () => ({
  root: {
  },
  formCtr: {
    width: '50%',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
});
export class RawResponseTypes extends React.Component {
  state = {
    displayForm: false,
    formData: {
      question: '',
      type: '',
    },
  }
  onSubmit = ({ formData }) => {
    const { question, type } = formData;
    this.setState({ displayForm: false });
    this.clearForm();
    if (this.props.onAddResponseType) this.props.onAddResponseType(question, type);
  }
  onCancel = () => {
    this.setState({ displayForm: false });
    this.clearForm();
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onClickAddResponseType = () => {
    this.setState({ displayForm: true });
  }
  clearForm = () => {
    this.setState({ formData: { question: '', type: '' } });
  }
  formSchema = {
    type: 'object',
    properties: {
      question: {
        title: 'Title',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      },
    },
  }
  render() {
    const { isOwner, classes, session, onAddResponse, ...rest } = this.props;
    const { displayForm, formData } = this.state;
    return (
      <div className={classes.root}>
        <Grid container>
          {keys(session.responseTypes).map(rt => (
            <Grid item xs={12} lg={4} key={rt}>
              <ResponseTypePanel
                responseType={session.responseTypes[rt]}
                responses={filter(session.responses, r => r.responseType === rt)}
                onAdd={onAddResponse(rt)}
                sessionStatus={session.status}
                {...rest}
              />
            </Grid>
          ))}
        </Grid>
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
        {isOwner &&
          <Button className={classes.loginButton} variant={'raised'} onClick={this.onClickAddResponseType}>
            Add Feedback Question
          </Button>
        }
      </div>
    );
  }
}
export default withStyles(styles)(RawResponseTypes);
