/* eslint-disable global-require */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import compression from 'compression';

import socket from './socket';
import getPdfData from './pdf/get-pdf-data';

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(compression());

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

app.get('/pdf/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  getPdfData(sessionId)
    .then(data => res.status(200)
      .header('Content-Disposition', 'attachment; filename="responses.pdf"')
      .header('Content-Type', 'application/pdf')
      .send(Buffer.from(data, 'base64')))
    .catch(() => res.status(500).send(''));
});

