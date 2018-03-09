import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = {
  root: {

  },
};
export class RawNewResponseForm extends React.Component {
  state = {
    value: '',
  }
  onChange = (e) => {
    this.setState({ value: e.target.value });
  }
  onSubmit = () => {
    if (this.props.onAdd) this.props.onAdd(this.state.value);
    this.setState({ value: '' });
  }
  render() {
    const { value } = this.state;
    return (
      <div>
        <TextField value={value} onChange={this.onChange} />
        <Button onClick={this.onSubmit}>Submit</Button>
      </div>
    );
  }
}
export default withStyles(styles)(RawNewResponseForm);
