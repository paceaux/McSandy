

const gulp = require('gulp');
const config = require('../config').watch;

gulp.task('watch', () => {
    gulp.watch(config.html, ['build']);
    gulp.watch(config.css, ['build']);
    gulp.watch(config.js, ['build']);
});
