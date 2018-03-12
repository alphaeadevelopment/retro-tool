import React from 'react';
import PropTypes from 'prop-types';
import 'styles/main.scss'; // eslint-disable-line import/no-unresolved,import/no-extraneous-dependencies
import { MuiThemeProvider } from 'material-ui/styles';
import theme from '../styles/theme';
import { SessionLaunch } from '../pages';
import Errors from './Errors';

export const RawApp = () => (
  <MuiThemeProvider theme={theme}>
    <SessionLaunch />
    <Errors />
  </MuiThemeProvider>
);
RawApp.contextTypes = {
  socket: PropTypes.object,
};

export default RawApp;
