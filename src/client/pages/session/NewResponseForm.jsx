import React from 'react';
import { withStyles } from 'material-ui/styles';
import Form from 'material-ui-jsonschema-form';
import getSchema from './get-schema-for-response-type';
import getDefaultValue from './get-default-value';
import getUiSchema from './get-ui-schema-for-response-type';

const styles = {
  root: {
    'display': 'flex',
    'justifyContent': 'space-between',
    '&>div': {
      flex: 8,
    },
  },
  doneIcon: {
    color: 'green',
  },
};
export class RawNewResponseForm extends React.Component {
  state = {
    formSchema: {
      type: 'object',
      properties: {
        value: getSchema(this.props.responseType),
      },
    },
    uiSchema: {
      value: getUiSchema(this.props.responseType),
    },
    formData: {
      value: getDefaultValue(this.props.responseType),
    },
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onSubmit = ({ formData }) => {
    if (this.props.onAdd) this.props.onAdd(formData.value);
    this.setState({ formData: { value: getDefaultValue(this.props.responseType) } });
  }
  render() {
    const { formSchema, formData, uiSchema } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Form schema={formSchema} uiSchema={uiSchema} formData={formData} onChange={this.onChange} onSubmit={this.onSubmit} />
      </div>
    );
  }
}
// <TextField value={value} onChange={this.onChange} />
// <IconButton onClick={this.onSubmit}><Done className={classes.doneIcon} /></IconButton>
export default withStyles(styles)(RawNewResponseForm);
