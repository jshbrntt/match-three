const CleanWebpackPlugin = require('clean-webpack-plugin')
const ghPages = require('gulp-gh-pages')
const gulp = require('gulp')
const gutil = require('gulp-util')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { IcosaServer } = require('./icosa')

function build (config, callback) {
  config.plugins = [...config.plugins,
    new CleanWebpackPlugin([config.output.path])
  ]
  Webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    stats.toString(config.devServer.stats).split('\n').map((line) => {
      gutil.log(gutil.colors.blue('[webpack]'), line)
    })
    callback()
  })
}

gulp.task('multiplayer', () => {
  let httpServer = http.createServer();
  httpServer.listen(config.get('socket.port'), config.get('socket.host'));
  let multiplayerServer = new MultiplayerServer(httpServer);
});

gulp.task('build:dev', (callback) => {
  let config = require('./webpack.config')
  config.devtool = 'source-map'
  return build(config, callback)
})

gulp.task('build', (callback) => {
  let config = require('./webpack.config')
  config.plugins = [...config.plugins,
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
  config.output = JSON.parse(JSON.stringify(config.output).replace(/.js/g, `.${Date.now()}.min.js`))
  return build(config, callback)
})

gulp.task('deploy', ['build'], () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages())
})

gulp.task('dev', done => {
  let server = new IcosaServer(3000)
  let config = require('./webpack.config')
  new WebpackDevServer(new Webpack(config), config.devServer)
    .listen(config.devServer.port, config.devServer.host, err => {
      if (err) throw new gutil.PluginError('webpack-dev-server', err)
      gutil.log(gutil.colors.cyan(`${config.devServer.https ? 'https' : 'http'}://${config.devServer.host}:${config.devServer.port}`))
    })
})
