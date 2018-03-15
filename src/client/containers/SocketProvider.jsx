/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import * as Actions from '../actions';
import bindSocketListeners from './bind-socket-listeners';

export class RawSocketProvider extends React.Component {
  state = {
    socket: null,
  }
  getChildContext() {
    return { socket: this.state.socket };
  }
  componentWillMount() {
    const { dispatch } = this.props;
    const socket = io.connect(process.env.SOCKET_URL || 'http://localhost:3000');
    this.setState({
      socket,
    });
    bindSocketListeners(Actions.Listeners, socket, dispatch);
  }
  render() {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    );
  }
}

RawSocketProvider.childContextTypes = {
  socket: PropTypes.object,
};

const mapStateToProps = () => ({
});

export default connect(mapStateToProps)(RawSocketProvider);
