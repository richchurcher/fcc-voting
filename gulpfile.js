var gulp = require('gulp');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var Server = require('karma').Server;
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
 
gulp.task('default', ['watch']);
gulp.task('build', ['bower', 'lib', 'css', 'icons', 'front']);
gulp.task('start', ['build', 'test', 'serve']);

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('lib', ['bower'], function () {
  return gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/lodash/lodash.min.js'
  ])
    .pipe(gulp.dest('./src/lib'));
});

gulp.task('css', ['bower'], function () {
  return gulp.src([
    './bower_components/bootstrap-css/css/bootstrap.min.css',
    './bower_components/font-awesome/css/font-awesome.min.css'
  ])
    .pipe(gulp.dest('./css'));
});

gulp.task('icons', ['bower'], function () {
  return gulp.src('./bower_components/font-awesome/fonts/**.*') 
    .pipe(gulp.dest('./fonts')); 
});

gulp.task('front', ['lib'], function () {
  return gulp.src([
    '!src/back{,/**}',
    'src/lib/**.js',
    'src/app.js',
    'src/**/module.js',
    'src/**/*.js'
  ])
    .pipe(sourcemaps.init())
      .pipe(concat('dist/bundle.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('back', ['clean'], function() {
  return gulp.src([
      'src/back/*.js'
    ], { base: '.' })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['front'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('serve', ['build'], function () {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: 'index.html'
    }));
});

gulp.task('watch', ['front'], function () {
  gulp.watch('src/**/*.js', ['front', 'test']);
});

