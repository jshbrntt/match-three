const cleanWebpackPlugin = require('clean-webpack-plugin');
const config             = require('config');
const express            = require('express');
const ghPages            = require('gulp-gh-pages');
const gulp               = require('gulp');
const gutil              = require('gulp-util');
const http               = require('http');
const MultiplayerServer  = require('./server/server.js');
const path               = require('path');
const webpack            = require('webpack');
const webpackDevServer   = require('webpack-dev-server');
const webpackConfig      = require('./webpack.config.js');

function build(config, callback) {
  webpackConfig.plugins = [...webpackConfig.plugins,
    new cleanWebpackPlugin([webpackConfig.output.path])
  ];
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    stats.toString(webpackConfig.devServer.stats).split('\n').map((line) => {
      gutil.log(gutil.colors.blue("[webpack]"), line);
    });
    callback();
  });
}

gulp.task('multiplayer', () => {
  let httpServer = http.createServer();
  httpServer.listen(config.get('socket.port'), config.get('socket.host'));
  let multiplayerServer = new MultiplayerServer(httpServer);
});

gulp.task('build:dev', (callback) => {
  let webpackConfig = require('./webpack.config');
  webpackConfig.devtool = 'source-map';
  return build(webpackConfig, callback);
});

gulp.task('build', (callback) => {
  let webpackConfig = require('./webpack.config');
  webpackConfig.plugins = [...webpackConfig.plugins,
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ];
  webpackConfig.output = JSON.parse(JSON.stringify(webpackConfig.output).replace(/.js/g, `.${Date.now()}.min.js`));
  return build(webpackConfig, callback);
});

gulp.task('deploy', ['build:production'], () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('watch', ['multiplayer'], (callback) => {
  let webpackConfig = require('./webpack.config');
  webpackConfig.devtool = 'source-map';
  webpackConfig.entry.app.unshift(`webpack-dev-server/client?http://${config.get('app.host')}:${config.get('app.port')}/`);
  new webpackDevServer(new webpack(webpackConfig), webpackConfig.devServer)
    .listen(config.get('app.port'), config.get('app.host'), (err) => {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      gutil.log(gutil.colors.cyan(`http://${config.get('app.host')}:${config.get('app.port')}`));
    });
});

gulp.task('app', ['multiplayer'], () => {
  let appServer = express();
  appServer.listen(config.get('app.port'), config.get('app.host'));
  appServer.use(express.static(path.join(__dirname, 'dist')));
});

gulp.task('default', ['app', 'multiplayer']);
