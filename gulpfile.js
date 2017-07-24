// Assigning modules to local variables
var gulp = require('gulp');
var less = require('gulp-less');
var pug = require('gulp-pug');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

// Default task
gulp.task('default', ['pug', 'less', 'minify-css', 'minify-js', 'rename-out']);

// Less task to compile the less files and add the banner
gulp.task('less', function () {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Compile pug files to html
gulp.task('pug', function () {
    var YOUR_LOCALS = {};

    gulp.src('./pug/*.pug')
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('.'))
});

// Minify CSS
gulp.task('minify-css', ['less'], function () {
    return gulp.src('./build/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./build/css-min'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function () {
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Rename Output File
gulp.task('rename-out', ['pug', 'inject-js', 'inject-css'], function () {
    return gulp.src('./index.html')
        .pipe(rename({
            basename: 'CSMA_UUID',
            suffix: '.v' + pkg.version
        }))
        .pipe(gulp.dest('./'));
});