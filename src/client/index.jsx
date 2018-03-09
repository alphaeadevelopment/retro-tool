import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { document, configuration } from '@alphaeadev/js-services';
import Root from './Root';

configuration.setConfiguration({ apiBaseUri: process.env.PROXY_SERVER });

const doRender = Component => render(<AppContainer><Component /></AppContainer>, document.getElementById('react-root'));

doRender(Root);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    doRender(Root);
  });
}
