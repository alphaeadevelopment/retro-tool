import React from 'react';
import 'typeface-roboto'; // eslint-disable-line import/extensions
// https://github.com/mui-org/material-ui/releases/tag/v1.0.0-beta.37
import Reboot from 'material-ui/Reboot'; // becomes CssBaseline
import { createStore, applyMiddleware, compose } from 'redux';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { window } from 'js-services';
import reducer from './reducers';
import App from './containers/App';
import SocketProvider from './containers/SocketProvider';

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
        <Reboot />
        <SocketProvider>
          <App />
        </SocketProvider>
      </div>
    </Provider>
  </Router>
);
