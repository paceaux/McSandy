'use strict';

const gulp = require('gulp');
const config = require('../config').build;
const jsConfig = require('../config').js;
const stylConfig = require('../config').stylus;
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const inject = require('gulp-inject');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

var stylStream = gulp.src([stylConfig.src], {read: true})
    .pipe(stylus(stylConfig.opts))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/'));


var jsStream = gulp.src([jsConfig.src], {read: true})
    .pipe(concat('main.js'))
    .pipe(uglify(jsConfig.uglify))
    .pipe(gulp.dest('build/'));

gulp.task('build', ()=> {
    gulp.src(config.scaffold)
        .pipe(inject(gulp.src([`${config.partials}*.html`]), {
            starttag: '<!-- inject:{{path}} -->',
            relative: true,
            removeTags: true,
            transform: function (filePath, file) {
                return file.contents.toString('utf8')
            }
        }))
        .pipe(inject(jsStream ,{
            starttag: '<!-- inject:js-->',
            removeTags: true,
            transform: function( filePath, file) {
                console.log(file.contents.toString());
                return `<script type="text/javascript">${file.contents.toString()}</script>`;
                
            }
        }))
        .pipe(inject(stylStream,{
            starttag: '<!-- inject:styl -->',
            removeTags: true,
            transform: function (filePath, file) {
                return `<style type="text/css">
                ${file.contents.toString('utf8')}</style>`;
            }
        }))
    .pipe(rename(config.rename))
    .pipe(gulp.dest('build/'));
});