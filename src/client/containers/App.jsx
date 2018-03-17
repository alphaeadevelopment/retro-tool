import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'styles/main.scss'; // eslint-disable-line import/no-unresolved,import/no-extraneous-dependencies
import { MuiThemeProvider } from 'material-ui/styles';
import theme from '../styles/theme';
import { SessionLaunch } from '../pages';
import Errors from './Errors';
import Footer from './Footer';

export const RawApp = () => (
  <MuiThemeProvider theme={theme}>

    <Route path={'/:sessionId?'} component={SessionLaunch} />
    <Footer />
    <Errors />
  </MuiThemeProvider>
);
RawApp.contextTypes = {
  socket: PropTypes.object,
};

export default RawApp;
