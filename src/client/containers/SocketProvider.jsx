/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import forEach from 'lodash/forEach';
import snakeCase from 'lodash/snakeCase';

export const eventToReduxActionType = event => snakeCase(event).toUpperCase();

export const createActionDispatcher = (dispatch, action) => payload => dispatch(action.call(null, payload));

export const createActionForEvent = event => obj => dispatch =>
  dispatch({ type: eventToReduxActionType(event), payload: obj });

export const bindSocketHandlers = (events, socket, dispatch) => {
  forEach(events, (event) => {
    socket.on(event, createActionDispatcher(dispatch, createActionForEvent(event)));
  });
};

export class RawSocketProvider extends React.Component {
  state = {
    socket: null,
  }
  getChildContext() {
    return { socket: this.state.socket };
  }
  componentWillMount() {
    const { dispatch, listenFor } = this.props;
    const socket = io.connect(process.env.SOCKET_URL || 'http://localhost:3000');
    this.setState({
      socket,
    });
    bindSocketHandlers(listenFor, socket, dispatch);
  }
  render() {
    return this.props.children;
  }
}

RawSocketProvider.childContextTypes = {
  socket: PropTypes.object,
};

export default connect()(RawSocketProvider);
