/* globals window */
import React from 'react';
import 'typeface-roboto'; // eslint-disable-line import/extensions
// https://github.com/mui-org/material-ui/releases/tag/v1.0.0-beta.37
import CssBaseline from 'material-ui/CssBaseline';
import { createStore, applyMiddleware, compose } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers';
import App from './containers/App';
import { SocketProvider, LocalStorageTokenManager } from './containers';
import events from './socket-events';

const middleware = [thunk];

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middleware)),
);

export default () => (
  <Router>
    <Provider store={store}>
      <div>
        <CssBaseline />
        <SocketProvider listenFor={events}>
          <LocalStorageTokenManager>
            <App />
          </LocalStorageTokenManager>
        </SocketProvider>
      </div>
    </Provider>
  </Router>
);
