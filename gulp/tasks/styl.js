'use strict';

const config = require('../config').stylus;
const gulp = require('gulp');
const stylus = require('gulp-stylus');

gulp.task('stylus', ()=> {
    return gulp.src(config.src)
        .pipe(stylus(config.opts))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('build/'));
});
