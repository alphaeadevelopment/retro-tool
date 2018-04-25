import React from 'react';
import { Route } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import '../styles/main.scss';
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

export default RawApp;
