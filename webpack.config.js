module.exports = {
  context: __dirname + '/src',
  entry: {
    app: ['./index']
  },
  output: {
    path: __dirname + '/dist',
		publicPath: '/dist/',
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
