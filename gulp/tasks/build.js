

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const stylConfig = require('../config').stylus;
const jsConfig = require('../config').js;
const config = require('../config').build;

const stylStream = gulp.src([stylConfig.src], { read: true })
    .pipe(stylus(stylConfig.opts))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/'));


const jsStream = gulp.src([jsConfig.src], { read: true })
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/'));

gulp.task('build', () => {
    gulp.src(config.scaffold)
        .pipe(inject(gulp.src([`${config.partials}*.html`]), {
            starttag: '<!-- inject:{{path}} -->',
            relative: true,
            removeTags: true,
            transform(filePath, file) {
                return file.contents.toString('utf8');
            },
        }))
        .pipe(inject(jsStream, {
            starttag: '<!-- inject:js -->',
            removeTags: true,
            transform(filePath, file) {
                return `<script type="text/javascript">
                var mcsandy, mcsandyPrefs, mcsandyUI;
                ${file.contents.toString()}
                mcsandyUI.init();
                mcsandy.init();
                mcsandyPrefs.init();
                </script>`;
            },
        }))
        .pipe(inject(stylStream, {
            starttag: '<!-- inject:styl -->',
            removeTags: true,
            transform(filePath, file) {
                return `<style type="text/css"> 
                ${file.contents.toString('utf8')}</style>`;
            },
        }))
        .pipe(rename(config.rename))
        .pipe(gulp.dest('build/'));
});
