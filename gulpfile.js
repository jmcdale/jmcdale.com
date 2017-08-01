// Assigning modules to local variables
var gulp = require('gulp');
var fs = require('fs');
var less = require('gulp-less');
var pug = require('gulp-pug');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var frontMatter = require('gulp-front-matter');
var data = require('gulp-data');
var wrap = require('gulp-wrap');
var hljs = require('highlight.js');
var md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
    linkify: true
});

var blogHomeData = [];

// Default task
gulp.task('default', ['pug', 'make-posts', 'make-blog-home', 'less']);

// Less task to compile the less files and add the banner
gulp.task('make-posts', function () {
    return gulp.src('./posts/*.md')
        .pipe(frontMatter({"property": 'data.frontMatter'}))
        .pipe(data(function (file) {

            var postData = file.data.frontMatter;
            postData.name = file.relative.slice(0, -3);
            blogHomeData.push(postData);
            var contents = md.render(file.contents.toString());
            return {"post": contents}
        }))
        .pipe(wrap({"src": "./templates/post.pug"}, null, {engine: 'pug', pretty: true}))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest('./build/blog/posts'))
});

gulp.task('make-blog-home', ['make-posts'], function () {
    return gulp.src('./templates/blog.pug')
        .pipe(pug({
            locals: {"posts": blogHomeData.reverse()},
            pretty: true
        }))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest('./build/blog/'))
});

// Less task to compile the less files and add the banner
gulp.task('less', function () {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./build/css'));
});

// Compile pug files to html
gulp.task('pug', function () {
    var YOUR_LOCALS = {};

    gulp.src('./pug/**/*.pug')
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest('./build'))
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