'use strict';
let gulp             = require('gulp');
let gutil            = require('gulp-util');
let WebpackDevServer = require('webpack-dev-server');
let webpack          = require('webpack');
let ghPages          = require('gulp-gh-pages');

gulp.task('build', (callback) => {
  let config = require('./webpack.config.js');
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    stats.toString(config.devServer.stats).split('\n').map((line) => {
      gutil.log(gutil.colors.blue("[webpack]"), line);
    });
    callback();
  });
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', (callback) => {
  let config = require('./webpack.config.js');
  config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
  new WebpackDevServer(new webpack(config), config.devServer)
    .listen(8080, 'localhost', (err) => {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
    });
});
