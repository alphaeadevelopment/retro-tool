import React from 'react';
import Form from 'material-ui-jsonschema-form';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import { withStyles } from 'material-ui/styles';
import Modal from 'material-ui/Modal';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ResponseTypePanel from './ResponseTypePanel';
import getFormSchemaForType from './get-form-schema-for-type';
import getFormUiSchemaForType from './get-form-ui-schema-for-type';
import getDefaultFormDataForType from './get-default-form-data-for-type';

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
const defaultState = () => ({
  displayForm: false,
  formData: getDefaultFormDataForType('Text'),
  schema: getFormSchemaForType('Text'),
  uiSchema: getFormUiSchemaForType('Text'),
});
export class RawResponseTypes extends React.Component {
  state = defaultState()
  onSubmit = ({ formData }) => {
    this.clearForm();
    if (this.props.onAddResponseType) this.props.onAddResponseType(formData);
  }
  onCancel = () => {
    this.clearForm();
  }
  onChange = ({ formData }) => {
    const newState = { formData };
    if (formData.type !== this.state.formData.type) {
      newState.schema = getFormSchemaForType(formData.type);
      newState.uiSchema = getFormUiSchemaForType(formData.type);
      newState.formData = getDefaultFormDataForType(formData.type);
    }
    this.setState(newState);
  }
  onClickAddResponseType = () => {
    this.setState({ displayForm: true });
  }
  clearForm = () => {
    this.setState(defaultState());
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
