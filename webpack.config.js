/* jshint node: true */
'use strict';
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

let config = {};

config.context = path.join(__dirname, 'src');

config.entry = {
  app: ['./index.jsx']
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
  },
  extensions: ['', '.js', '.jsx']
};

config.module = {
  loaders: [{
    test: /\.js[x]?$/,
    loaders: ['babel-loader?presets[]=es2015&presets[]=react'],
    exclude: /(node_modules|bower_components)/
  }, {
    test: /\.css$/,
    loaders: ['style', 'css']
  }, {
    test: /\.scss$/,
    loaders: ['style', 'css', 'postcss', 'sass']
  }, {
    test: /\.less$/,
    loaders: ['style', 'css', 'less']
  }, {
    test: /\.woff$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
  }, {
    test: /\.woff2$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
  }, {
    test: /\.(eot|ttf)$/,
    loader: "file-loader"
  }, {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ]
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
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
  new HtmlWebpackPlugin({
    title: 'Match Three',
    template: './index.ejs'
  })
];

config.postcss = function () {
  return [autoprefixer({
    browsers: ['last 3 versions']
  })];
}

module.exports = config;
