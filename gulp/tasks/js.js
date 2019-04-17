

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const config = require('../config').js;

gulp.task('js', () => gulp.src([config.src], { read: true })
    .pipe(concat(config.filename))
    .pipe(gulp.dest('build/')));

gulp.task('js-min', () => gulp.src([config.src], { read: true })
    .pipe(concat(config.filename.replace('.js', '.min.js')))
    .pipe(uglify(config.uglify))
    .pipe(gulp.dest('build/')));
