import React from 'react';
import update from 'immutability-helper';
import Form from 'material-ui-jsonschema-form';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ResponseTypePanel from './ResponseTypePanel';

const defaultSchema = {
  type: 'object',
  properties: {
    question: {
      title: 'Title',
      type: 'string',
    },
    type: {
      title: 'Type',
      type: 'string',
      enum: ['Text', 'Number', 'Yes/No', 'Choices'],
    },
    allowMultiple: {
      title: 'Allow Multiple',
      type: 'boolean',
    },
  },
};
const choicesProperty = {
  choices: {
    title: 'Choices',
    type: 'array',
    items: {
      type: 'string',
      default: '',
    },
  },
};
const styles = theme => ({
  root: {
    '&>div:first-child': {
      marginBottom: theme.spacing.unit * 2,
    },
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
      allowMultiple: true,
      type: 'Text',
      choices: [''],
    },
    schema: defaultSchema,
  }
  onSubmit = ({ formData }) => {
    this.setState({ displayForm: false });
    this.clearForm();
    if (this.props.onAddResponseType) this.props.onAddResponseType(formData);
  }
  onCancel = () => {
    this.setState({ displayForm: false });
    this.clearForm();
  }
  onChange = ({ formData }) => {
    const newState = { formData };
    if (formData.type !== this.state.formData.type) {
      newState.schema = this.getFormSchemaForType(formData.type);
    }
    this.setState(newState);
  }
  onClickAddResponseType = () => {
    this.setState({ displayForm: true });
  }
  getFormSchemaForType = (type) => {
    if (type === 'Choices') {
      return update(defaultSchema, { properties: { $merge: choicesProperty } });
    }
    return defaultSchema;
  }
  clearForm = () => {
    this.setState({ formData: { question: '', type: 'Text', allowMultiple: true } });
  }
  render() {
    const { isOwner, classes, session, onAddResponse, ...rest } = this.props;
    const { displayForm, formData, schema } = this.state;
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
                isOwner={isOwner}
                {...rest}
              />
            </Grid>
          ))}
        </Grid>
        <Modal open={displayForm} onClose={this.onCancel} disableEnforceFocus>
          <div className={classes.formCtr}>
            {displayForm && <Form
              schema={schema}
              onCancel={this.onCancel}
              onSubmit={this.onSubmit}
              formData={formData}
              onChange={this.onChange}
            />}
          </div>
        </Modal>
        {isOwner && session.status === 'initial' &&
          <Button className={classes.loginButton} variant={'raised'} onClick={this.onClickAddResponseType}>
            Add Feedback Question
          </Button>
        }
      </div>
    );
  }
}
export default withStyles(styles)(RawResponseTypes);
