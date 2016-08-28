/* jshint node: true */
'use strict';
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {};

config.context = path.join(__dirname, 'src');

config.entry = {
  app: ['./index']
};

config.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  sourceMapFilename: 'bundle.js.map'
};

config.resolve = {
  alias: {
    assets: path.resolve('./src/assets'),
    modernizr$: path.resolve(__dirname, ".modernizrrc")
  }
};

config.module = {
  loaders: [{
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: ['es2015']
    }
  }, {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ]
  }, {
    test: /\.css$/,
    loader: "style-loader!css-loader"
  }, {
    test: /\.modernizrrc$/,
    loader: "modernizr"
  }, {
    test: /manifest.json$/,
    loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
  }]
};

config.devServer = {
  contentBase: './dist',
  host: '0.0.0.0',
  port: '8080',
  stats: {
    colors: true,
    chunks: false
  }
};

config.plugins = [
  new HtmlWebpackPlugin({
    title: 'Match Three',
    template: './index.ejs'
  })
];

module.exports = config;
