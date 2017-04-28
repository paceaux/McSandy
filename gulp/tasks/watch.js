'use strict';

const config = require('../config').watch;
const gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch( config.html, ['build']);
  gulp.watch(config.css, ['build']);
  gulp.watch(config.js, ['build']);
});
