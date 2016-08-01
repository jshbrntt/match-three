'use strict';
const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: ['./index']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  devServer: {
    contentBase: './dist',
    stats: {
      colors: true,
      chunks: false
    }
  }
};
