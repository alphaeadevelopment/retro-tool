/* eslint-disable */
const fs = require('fs');
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const moduleConfig = require(fs.existsSync(path.join(__dirname, './module-config.js')) ? './module-config' : './default-module-config.js');

const extractScss = new ExtractTextPlugin({ filename: "style.css", allChunks: true })
const extractCss = new ExtractTextPlugin({ filename: "main.css", allChunks: true })

const alias = {
  'branding': path.join(__dirname, '../src/client/styles/branding'),
  'styles': path.join(__dirname, '../src/client/styles'),
  'api-stubs': path.join(__dirname, '../src/stubs/empty-stubs.js'),
}
if (process.env.NODE_ENV !== 'production' && process.env.NO_STUBS === undefined) {
  alias['api-stubs'] = path.join(__dirname, '../src/stubs/api-stubs.js');
}
if (process.env.NODE_ENV !== 'production') {
  Object.assign(alias, moduleConfig.aliases);
}

const babelExclude = /node_modules/

var config = {
  entry: {
    main: [
      path.join(__dirname, '../src/client', 'index.jsx'),
      path.join(__dirname, '../src/server', 'main.js'),
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: babelExclude,
          },
          {
            test: /\.scss$/,
            use: extractScss.extract({
              use: [{
                loader: 'css-loader',
                options: {
                  localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                  modules: true,
                  camelCase: true,
                }
              }, {
                loader: 'sass-loader',
              }]
            }),
          },
          {
            test: /\.css$/,
            use: extractCss.extract({
              use: [{
                loader: 'css-loader',
                options: {
                  localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                  modules: true,
                  camelCase: true,
                }
              }]
            }),
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            loaders: [
              {
                loader: 'url-loader',
                options: {
                  limit: 50000,
                },
              }, {
                loader: 'image-webpack-loader',
              }
            ]
          },
          {
            test: /\.(pem|txt)$/,
            use: 'raw-loader',
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    ]
  },
  resolve: {
    alias,
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    extractScss,
    extractCss,
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  target: 'node'
}

module.exports = config
