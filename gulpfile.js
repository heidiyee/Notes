var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    plumber = require('gulp-plumber'),
    bourbon = require("node-bourbon").includePaths,
    neat = require("node-neat").includePaths;

//error handler for plumber
function onError(err) {
	console.log(err);
    this.emit('end');
}

//sass to css
gulp.task('sass', function() {
return gulp.src('_ui/scss/**/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass({
        includePaths: bourbon,
        includePaths: neat
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
    }))
    .pipe(gulp.dest('_ui/css/'))
    .pipe(browserSync.reload({
        stream:true
    }))

});

//watches html, css, and js files to reload
gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('_ui/scss/**/*.scss', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('_ui/js/**/*.js', browserSync.reload);
});

//reloads browser
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

//concat one file for css and js files and minifying
gulp.task('useref', function() {
    return gulp.src('*.html')
        .pipe(plumber({errorHandler: onError}))
        .pipe(useref())
        .pipe(gulpIf('_ui/js/*.js', uglify()))
        .pipe(gulpIf('_ui/css/*.css', cleanCSS()))
        .pipe(gulp.dest('dist'))
});

//move fonts to dist folder
gulp.task('fonts', function() {
    return gulp.src('_ui/fonts/**/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulp.dest('dist/fonts'))

});

//cleaners
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

//sequence for pre-building
gulp.task('pretty', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  )
});

//minify and creating dist folder
gulp.task('build', function (callback) {
  runSequence('clean:dist', 'sass',
    ['useref', 'fonts'],
    callback
  )
});
