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
    const { initSocket, dispatch } = this.props;
    const socket = io.connect(process.env.SOCKET_URL || 'http://localhost:3000');
    this.setState({
      socket,
    });
    console.dir(socket);
    initSocket(socket);
    bindSocketListeners(Actions, socket, dispatch);
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

const dispatchToActions = dispatch => ({
  dispatch,
  initSocket: socket => dispatch(Actions.doInitSocket(socket)),
});

export default connect(mapStateToProps, dispatchToActions)(RawSocketProvider);
