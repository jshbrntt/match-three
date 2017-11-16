const browserSync = require('browser-sync').create()
const gulp = require('gulp')
const gutil = require('gulp-util')
const path = require('path')
const process = require('process')
const stripAnsi = require('strip-ansi')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const { IcosaServer } = require('../src/icosa')

function log (color, label, ...message) {
  gutil.log(gutil.colors[color](`[${label}]`), ...message)
}

function handleOutput (stats, err = null) {
  if (err) {
    log('red', 'webpack', err.stack || err)
    if (err.details) {
      log('red', 'webpack', err.details)
    }
    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    info.errors.map(error => error.split('\n').map(line => {
      log('red', 'webpack', line)
    }))
  }

  if (stats.hasWarnings()) {
    info.warnings.map(warning => warning.split('\n').map(line => {
      log('yellow', 'webpack', line)
    }))
  }

  stats.toString({colors: true}).split('\n').map((line) => {
    log('blue', 'webpack', line)
  })

  if (stats.hasErrors()) {
    process.exit(1)
  }
}

const icosaServer = new IcosaServer()

gulp.task('dev', done => {
  icosaServer.listen(9000)
  const WebpackConfig = require(path.join(global.__base, 'webpack.config'))
  const WebpackCompiler = webpack(WebpackConfig)
  WebpackCompiler.plugin('done', stats => {
    handleOutput(stats)
    if (stats.hasErrors()) {
      return browserSync.sockets.emit('fullscreen:message', {
        title: 'Webpack Error:',
        body: stripAnsi(stats.toString()),
        timeout: 100000
      })
    }
    browserSync.reload()
  })

  browserSync.init({
    port: process.env.PORT,
    open: false,
    logFileChanges: false,
    middleware: [
      webpackDevMiddleware(WebpackCompiler, {
        publicPath: WebpackConfig.output.publicPath
      })
    ],
    plugins: ['bs-fullscreen-message']
  })
})
