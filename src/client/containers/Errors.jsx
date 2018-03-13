import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import { connect } from 'react-redux';
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import * as Selectors from '../selectors';

import formatErrorMessage from './format-error-message';

import * as Actions from '../actions';

const styles = theme => ({
  root: {

  },
  errorCtr: {
    background: theme.palette.error,
  },
});
const TransitionUp = props => <Slide direction='up' {...props} />;

export class RawErrors extends React.Component {
  state = {
    open: {},
  }
  componentWillReceiveProps = (nextProps) => {
    const openChanges = {};
    forEach(keys(nextProps.errors), (e) => {
      if (this.state.open[e] === undefined) openChanges[e] = true;
    });
    this.setState({ open: openChanges });
  }
  handleClose = e => () => {
    this.setState({ open: { e: false } });
    if (this.props.onDismissError) this.props.onDismissError(e);
  }
  render() {
    const { errors, classes } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        {keys(errors).map(e => (
          <Snackbar
            key={e}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={open[e]}
            autoHideDuration={60000}
            onClose={this.handleClose(e)}
            SnackbarContentProps={{
              'aria-describedby': `message-id-${e}`,
            }}
            transition={TransitionUp}
            message={<span id={`message-id-${e}`}>{formatErrorMessage(errors[e])}</span>}
            action={[
              <IconButton
                key='close'
                aria-label='Close'
                color='inherit'
                className={classes.close}
                onClick={this.handleClose(e)}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errors: Selectors.getErrors(state),
});

const dispatchToActions = dispatch => ({
  onDismissError: e => dispatch(Actions.onDismissError(e)),
});

export default connect(mapStateToProps, dispatchToActions)(withStyles(styles)(RawErrors));
