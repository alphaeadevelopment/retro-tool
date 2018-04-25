import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import SessionInitialization from './SessionInitialization';
import * as Selectors from '../selectors';
import * as Actions from '../actions';
import { withSocket } from '../containers';

const Session = Loadable({
  loader: () => import('./session'),
  loading: () => <div>Loading...</div>,
});

export default (props) => <Session {...props} />
