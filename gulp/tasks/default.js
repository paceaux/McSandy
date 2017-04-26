'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);

gulp.task('default', ()=>{
    runSequence(
        [
            'build'
        ]
    );
});