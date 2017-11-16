const autoprefixer = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Package = require('./package')
const path = require('path')
const process = require('process')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

let config = {}

config.context = path.join(__dirname, 'src')

config.entry = {
  tetra: './tetra'
}

config.output = {
  path: path.join(__dirname, 'dist'),
  filename: `[name].bundle.js`,
  sourceMapFilename: `[name].bundle.js.map`
}

config.resolve = {
  alias: {
    assets: path.resolve('src', 'tetra', 'assets'),
    tetra: path.resolve('src', 'tetra', 'tetra'),
    icosa: path.resolve('src', 'icosa'),
    wasm: path.resolve('src', 'wasm')
  }
}

config.externals = {
  document: 'document',
  image: 'Image',
  location: 'location',
  promise: 'Promise',
  window: 'window',
  fs: true,
  path: true
}

const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
})

config.module = {
  rules: [
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'standard-loader',
      exclude: /(node_modules|bower_components)/
    },
    {
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
    },
    {
      test: /\.scss$/,
      use: extractStyles.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }],
        fallback: 'style-loader'
      })
    },
    {
      test: /\.css$/,
      use: extractStyles.extract({
        use: [{
          loader: 'css-loader'
        }],
        fallback: 'style-loader'
      })
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },
    {
      test: /\.modernizrrc$/,
      loader: 'modernizr'
    },
    {
      test: /manifest.json$/,
      loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.rs$/,
      use: {
        loader: 'rust-wasm-loader',
        options: {
          path: ''
        }
      }
    }
  ]
}

config.devtool = 'source-map'

config.devServer = {
  contentBase: './dist',
  host: '0.0.0.0',
  port: process.env.PORT || 443,
  stats: {
    colors: true,
    chunks: false
  },
  inline: true
}

config.plugins = [
  extractStyles,
  new HtmlWebpackPlugin(),
  new CleanWebpackPlugin([
    'dist'
  ])
]

if ('NODE_ENV' in process.env) {
  config.plugins.push(new UglifyJSPlugin())
}

module.exports = config
