

const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const config = require('../config').stylus;

gulp.task('stylus', () => gulp.src(config.src)
    .pipe(stylus(config.opts))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/')));
