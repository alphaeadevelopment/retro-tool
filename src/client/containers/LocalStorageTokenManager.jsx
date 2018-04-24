/* globals window */
/* eslint-disable no-console */
import React from 'react';
import { connect } from 'react-redux';
import * as Selectors from '../selectors';


const unsetToken = () => {
  window.localStorage.removeItem('token');
};
const setToken = (token) => {
  window.localStorage.setItem('token', token);
};

export class RawLocalStorage extends React.Component {
  componentWillReceiveProps = (nextProps) => {
    if (this.props.token && !nextProps.token) unsetToken();
    else if (!this.props.token && nextProps.token) setToken(nextProps.token);
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

const mapStateToProps = state => ({
  token: Selectors.getToken(state),
});

export default connect(mapStateToProps)(RawLocalStorage);
