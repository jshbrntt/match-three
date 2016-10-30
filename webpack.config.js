const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Package = require('./package')
const path = require('path');
const process = require('process')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack');

let config = {}

config.context = path.join(__dirname, 'src')

config.entry = {
  app: './index.js'
}

config.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  sourceMapFilename: 'bundle.js.map'
}

config.resolve = {
  alias: {
    assets: path.resolve('./src/assets')
  }
}

config.externals = {
  document: 'document',
  window: 'window',
  promise: 'Promise'
}

config.module = {
  rules: [{
    test: /\.js$/,
    include: [
      path.resolve(__dirname, 'src')
    ],
    loader: 'babel-loader',
    query: {
      compact: true,
      presets: [
        ['es2015', {modules: false}]
      ]
    }
  }, {
    test: /\.png$/,
    use: 'file-loader'
  }, {
    test: /\.scss$/,
    use: [{
      loader: 'style-loader'
    }, {
      loader: 'css-loader'
    }, {
      loader: 'sass-loader'
    }]
  }]
}

config.devtool = 'source-map'

config.devServer = {
  contentBase: './dist',
  host: '0.0.0.0',
  port: process.env.PORT || 443,
  stats: {
    colors: true,
    chunks: false
  }
}

config.plugins = [
  new HtmlWebpackPlugin({
    title: Package.name.split(' ').map(word => word.charAt(0) + word.slice(1)).join(' '),
    template: './index.ejs'
  }),
  new CleanWebpackPlugin([
    'dist'
  ])
]

if ('NODE_ENV' in process.env) {
  config.plugins.push(new UglifyJSPlugin())
}

module.exports = config
