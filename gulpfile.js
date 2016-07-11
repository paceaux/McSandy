var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var concat = require('gulp-concat');

var config = {
	src: {
		css: 'src/css/*.styl',
		js: 'src/js',
		html: 'src/html'
	},
	dist: {
		css: 'mcsandy.min.css',
		js: 'McSandy.min.js'
	}
}

gulp.task('stylus', function () {
	return gulp.src(config.src.css)
		.pipe(
			stylus({
				linenos: false,
				compress: true,
				use: nib(),
				import: ['nib']
			})
		)
		.pipe(concat(config.dist.css))
		.pipe(gulp.dest('dist/'));
});