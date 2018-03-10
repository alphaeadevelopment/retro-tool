import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Done from 'material-ui-icons/Done';

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
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TextField value={value} onChange={this.onChange} />
        <IconButton onClick={this.onSubmit}><Done className={classes.doneIcon} /></IconButton>
      </div>
    );
  }
}
export default withStyles(styles)(RawNewResponseForm);
