// Assigning modules to local variables
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const less = require('gulp-less');
const pug = require('gulp-pug');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const frontMatter = require('gulp-front-matter');
const data = require('gulp-data');
const wrap = require('gulp-wrap');
const hljs = require('highlight.js');

const multiFence = require('./other/markdown-it-multi-fence/dist')
let multi = 0;
let multiLangs = {};
const customFence = function (md, options) {
    return multiFence(md, 'customFence', {
        render: function (tokens, idx, _options, env, self) {
            multi++;
            let token = tokens[idx];
            let tokenText = token.content;

            let block = md.render(tokenText);
            let tabs = '<div class="multi"><div class="tab">';
            let curLangs = multiLangs[multi];
            for (let i = 0; i < curLangs.length; i++) {
                let langClassName = 'lang-' + curLangs[i];
                let active = '';
                if (i === 0) {
                    active = 'active';
                }

                tabs = tabs + '<button class="tablinks ' + langClassName + ' ' + active + '" onclick="openTab(event, \'' + langClassName + '\' )">' + curLangs[i] + '</button>'
            }

            tabs += '</div>';
            tabs += block;
            tabs += "</div>";
            delete multiLangs[multi];
            multi--;
            return tabs;
        },
        validate: function (params) {
            return params === 'multi';
        }
    })
};
const md = require('markdown-it')({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                if (multi > 0) {
                    let curLangSet = multiLangs[multi];
                    let isFirstInMulti = false;
                    if (curLangSet === undefined) {
                        multiLangs[multi] = [];
                        curLangSet = multiLangs[multi];
                        isFirstInMulti = true
                    }
                    curLangSet.push(lang);

                    let hide = 'style="display: none;"';
                    if (isFirstInMulti) {
                        hide = '';
                    }

                    let result = '<pre class="hljs tabcontent lang-' + lang + '" ' + hide + '><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                    return result;
                } else {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                }
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
    linkify: true
}).use(customFence);

const buildPath = "./docs";


const blogHomeData = [];

// Default task
gulp.task('default', ['pug', 'make-posts', 'make-blog-home', 'less', 'copy-static-content', 'scripts']);

// Less task to compile the less files and add the banner
gulp.task('make-posts', function () {
    return gulp.src('./posts/*.md')
        .pipe(frontMatter({"property": 'data.frontMatter'}))
        .pipe(data(function (file) {
            let postData = file.data.frontMatter;
            postData.name = file.relative.slice(0, -3);
            blogHomeData.push(postData);
            let contents = md.render(file.contents.toString());
            return {"post": contents}
        }))
        .pipe(wrap({"src": "./templates/post.pug"}, null, {engine: 'pug', pretty: true}))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest(buildPath + '/blog/posts'));
});

gulp.task('make-blog-home', ['make-posts'], function () {
    return gulp.src('./templates/blog.pug')
        .pipe(pug({
            locals: {"posts": blogHomeData.reverse()},
            pretty: true
        }))
        .pipe(rename("index.html"))
        .pipe(gulp.dest(buildPath + '/blog/'))
        .pipe(browserSync.stream());
});

// Less task to compile the less files and add the banner
gulp.task('copy-static-content', function () {
    return gulp.src('./content/**')
        .pipe(gulp.dest(buildPath + '/content'));
});

// Less task to copy the scripts
gulp.task('scripts', function () {
    return gulp.src('./scripts/**')
        .pipe(gulp.dest(buildPath + '/scripts'));
});

// Less task to compile the less files and add the banner
gulp.task('less', function () {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(browserSync.stream());
});

// Compile pug files to html
gulp.task('pug', function () {
    let YOUR_LOCALS = {};

    gulp.src('./pug/**/*.pug')
        .pipe(pug({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(buildPath))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['default'], function () {
    browserSync.init({
        server: {
            baseDir: buildPath
        }
    });

    gulp.watch("./less/*.less", ['less']);
    gulp.watch("./pug/**/*.pug", ['pug']);
    gulp.watch("./posts/*.md", ['make-blog-home']);
    gulp.watch("./scripts/**/*.js", ['scripts']);
    gulp.watch("./templates/blog.pug", ['make-blog-home']);
    gulp.watch("./templates/post.pug", ['make-blog-home']);
});

// Minify CSS
// gulp.task('minify-css', ['less'], function () {
//     return gulp.src('./build/css/*.css')
//         .pipe(cleanCSS({compatibility: 'ie8'}))
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest(buildPath + '/css-min'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });
//
// // Minify JS
// gulp.task('minify-js', function () {
//     return gulp.src('./js/*.js')
//         .pipe(uglify())
//         .pipe(rename({suffix: '.min'}))
//         .pipe(gulp.dest(buildPath + '/js'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });

