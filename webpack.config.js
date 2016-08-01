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

config.devtool = 'source-map';

config.resolve = {
  alias: {
    assets: path.resolve('./src/assets')
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
  }]
};

config.devServer = {
  contentBase: './dist',
  stats: {
    colors: true,
    chunks: false
  }
};

config.plugins = [
  new HtmlWebpackPlugin({
    title: 'Match Three'
  })
];

module.exports = config;
