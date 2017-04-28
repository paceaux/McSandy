'use strict';

const gulp = require('gulp');
const config = require('../config').js
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('js', ()=>{
    return gulp.src([jsConfig.src], {read: true})
        .pipe(concat(config.filename))
        .pipe(gulp.dest('build/'));
});

gulp.task('js-min', ()=>{
    return gulp.src([jsConfig.src], {read: true})
        .pipe(concat(config.filename.replace('.js', '.min.js')))
        .pipe(uglify(config.uglify))
        .pipe(gulp.dest('build/'));
});