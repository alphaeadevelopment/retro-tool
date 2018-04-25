/* globals window */
import React from 'react';
import 'typeface-roboto'; // eslint-disable-line import/extensions
// https://github.com/mui-org/material-ui/releases/tag/v1.0.0-beta.37
import CssBaseline from 'material-ui/CssBaseline';
import { createStore, applyMiddleware, compose } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from './containers/App';
import { SocketProvider, LocalStorageTokenManager } from './containers';
import events from './socket-events';

const middleware = [thunk];
let composedMiddleware;
// eslint-disable-next-line no-underscore-dangle
if (process.env.NODE_ENV !== 'production') {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const createLogger = require('redux-logger').createLogger;
  middleware.push(createLogger());
  composedMiddleware = composeEnhancers(applyMiddleware(...middleware));
}
else {
  composedMiddleware = applyMiddleware(...middleware);
}

const store = createStore(
  reducer,
  composedMiddleware,
);

export default () => (
  <Router>
    <Provider store={store}>
      <React.Fragment>
        <CssBaseline />
        <SocketProvider listenFor={events}>
          <LocalStorageTokenManager>
            <App />
          </LocalStorageTokenManager>
        </SocketProvider>
      </React.Fragment>
    </Provider>
  </Router>
);
