import browserSync from 'browser-sync';
import data from 'gulp-data'
import del from 'del';
import frontMatter from 'gulp-front-matter'
import gulp from 'gulp';
import less from 'gulp-less'
import pug from 'gulp-pug'
import rename from 'gulp-rename'
import wrap from 'gulp-wrap'
import md from './other/custom-markdown'

const server = browserSync.create();

const buildPath = "./docs";

const blogHomeData = [];

const clean = () => del([buildPath]);

function reload(done) {
    server.reload();
    done();
}

function _serve(done) {
    server.init({
        server: {
            baseDir: buildPath
        }
    });
    done()
}

function pugTask() {
    return gulp.src('./pug/**/*.pug')
        .pipe(pug({locals: {}, pretty: true}))
        .pipe(gulp.dest(buildPath))
        .pipe(browserSync.stream());
}

function convertLess() {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src('./scripts/**')
        .pipe(gulp.dest(buildPath + '/scripts'));
}

function copyStaticContent() {
    return gulp.src('./content/**')
        .pipe(gulp.dest(buildPath + '/content'));
}

function copyCNAME() {
    return gulp.src('./other/CNAME')
        .pipe(gulp.dest(buildPath));
}

function _makeBlogHome() {
    return gulp.src('./templates/blog.pug')
        .pipe(pug({
            locals: {"posts": blogHomeData.reverse()},
            pretty: true
        }))
        .pipe(rename("index.html"))
        .pipe(gulp.dest(buildPath + '/blog/'))
        .pipe(browserSync.stream());
}

const makeBlogHome = gulp.series(makePosts, _makeBlogHome)

function makePosts() {
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
}

const watchLess = () => gulp.watch("./less/*.less", gulp.series(less, reload));
const watchPug = () => gulp.watch("./pug/**/*.pug", gulp.series(pugTask, reload));
const watchScripts = () => gulp.watch("./scripts/**/*.js", gulp.series(scripts, reload));
const watchHomePosts = () => gulp.watch("./posts/*.md", gulp.series(makeBlogHome, reload));
const watchBlogTemplate = () => gulp.watch("./templates/blog.pug", gulp.series(makeBlogHome, reload));
const watchPostTemplate = () => gulp.watch("./templates/post.pug", gulp.series(makeBlogHome, reload));

const watch = gulp.parallel(watchLess, watchPug, watchScripts, watchHomePosts, watchBlogTemplate, watchPostTemplate)

const build = gulp.series(clean, pugTask, makeBlogHome, convertLess, copyStaticContent, copyCNAME, scripts);
const serve = gulp.series(build, _serve, watch);

export {clean, serve};
export default build;