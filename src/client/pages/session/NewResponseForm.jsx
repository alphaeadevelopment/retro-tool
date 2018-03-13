import React from 'react';
import { withStyles } from 'material-ui/styles';
import Form from 'material-ui-jsonschema-form';
import getValueSchema from './get-value-schema';
import getDefaultValue from './get-default-value';

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
        value: getValueSchema(this.props.responseType),
      },
    },
    formData: {
      value: getDefaultValue(this.props.repsonseType),
    },
  }
  onChange = ({ formData }) => {
    this.setState({ formData });
  }
  onSubmit = ({ formData }) => {
    if (this.props.onAdd) this.props.onAdd(formData.value);
    this.setState({ formData: { value: getDefaultValue(this.props.repsonseType) } });
  }
  render() {
    const { formSchema, formData } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Form schema={formSchema} formData={formData} onChange={this.onChange} onSubmit={this.onSubmit} />
      </div>
    );
  }
}
// <TextField value={value} onChange={this.onChange} />
// <IconButton onClick={this.onSubmit}><Done className={classes.doneIcon} /></IconButton>
export default withStyles(styles)(RawNewResponseForm);
