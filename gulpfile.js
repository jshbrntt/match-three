var gulp = require('gulp');
var fs = require('fs');
var concat = require('gulp-concat-sourcemap');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');
var del = require('del');
var wiredep = require('wiredep').stream;

/*
Configuration
*/

var config = {
    src: './src',
    build: './build',
    dist: './dist'
};

//Variables
var bower_rc = JSON.parse(fs.readFileSync('.bowerrc', 'utf8'));
//var bower_js = bower({
//    'cwd': bower_rc.cwd
//}).js;

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

//Utility Tasks
gulp.task('clean', function (cb) {
    return del([config.dist], cb);
});

//Build Tasks
//gulp.task('build-bower', ['clean'], function () {
//    return gulp.src(config.src + '/markup/index.html')
//        .pipe(bower_js)
//        .pipe(gulp.dest(config.dist));
//});

gulp.task('copydep', function () {
    return gulp.src('./src/bower_components/**/*')
        .pipe(changed('./dist/bower_components'))
        .pipe(gulp.dest('./dist/bower_components'));
});

gulp.task('wiredep', ['copydep'], function () {
    return gulp.src('./src/markup/index.html')
        .pipe(wiredep({
            'cwd': bower_rc.cwd,
            'ignorePath': '../'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-markup', function () {
    return gulp.src(config.src + '/markup/**/*.html')
        .pipe(gulp.dest(config.dist));
});

gulp.task('build-styles', function () {
    return gulp.src(config.src + '/styles/**/*.css')
        .pipe(gulp.dest(config.dist));
});

gulp.task('build-scripts', function () {

    var bundler = browserify({
        entries: ['./src/scripts/app.js'],
        debug: true
    });

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.dist));
    };

    return bundle();
});

gulp.task('build', [
    'wiredep',
    'build-markup',
    'build-styles',
    'build-scripts'
]);

gulp.task('serve', ['build'], function () {
    
});

/*
Default Task
*/