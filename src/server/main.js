/* eslint-disable global-require */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';

import socket from './socket';

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../../config/webpack.client');
  const webpackCompiler = webpack(webpackConfig);
  const webpackDevOptions = {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  };
  app.use(require('webpack-dev-middleware')(webpackCompiler, webpackDevOptions));
  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

// serve static files from webpack dist dir
const publicPath = path.join(__dirname, '../../dist');
app.use(express.static(publicPath));

// ping for load balancer checking health
app.get('/ping', (req, res) => res.status(200).send());


const serve = http.createServer(app);
socket.init(serve);

serve.listen(port, () => {
  console.log('Listening on %s', port); // eslint-disable-line no-console
});

