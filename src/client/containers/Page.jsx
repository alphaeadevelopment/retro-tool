import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import ArrowBack from 'material-ui-icons/ArrowBack';
import IconButton from 'material-ui/IconButton';
import classNames from 'classnames';
import { api } from '@alphaeadev/js-services';
import { getAuthToken } from '../selectors';
import { keepSessionAlive } from '../actions';
import { Title } from '../components';
// import styles from './Page.scss';

const styles = {
  page: {
    padding: '2em',
  },
  titleCtr: {
    display: 'flex',
    alignItems: 'center',
  },
};
export class RawPage extends React.Component {
  componentDidMount() {
    this.props.keepAlive(this.props.token);
    api.post('/analytics/page/enter', { id: this.props.id, timestamp: new Date().getTime() }).catch(() => null);
  }
  componentWillUnmount() {
    api.post('/analytics/page/exit', { id: this.props.id, timestamp: new Date().getTime() }).catch(() => null);
  }
  render() {
    const { title, backTo, history, classes } = this.props;
    return (
      <div className={classNames(classes.page, this.props.className)} style={{ ...this.props.style }}>
        <div className={classes.titleCtr}>
          {backTo &&
            <IconButton
              onClick={() => history.push(backTo)}
              color='inherit'
            >
              <ArrowBack />
            </IconButton>
          }
          {title && <Title>{title}</Title>}
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: getAuthToken(state),
});

const dispatchToActions = dispatch => ({
  keepAlive: token => dispatch(keepSessionAlive(token)),
});

export default withRouter(connect(mapStateToProps, dispatchToActions)(withStyles(styles)(RawPage)));
