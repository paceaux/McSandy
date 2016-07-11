var		gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		concat = require('gulp-concat-util'),
		uglify = require('gulp-uglify'),
		inline = require('gulp-inline');

var config = {
	src: {
		css: 'src/css/*.styl',
		js: 'src/js/*.js',
		shell: 'src/pre-mcsandy.html',
		html: 'src/html/*.html'
	},
	dist: {
		css: 'mcsandy.min.css',
		js: 'mcsandy.min.js',
		html: 'components.html'
	}
};

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

gulp.task('js', function () {
	return gulp.src(config.src.js)
		.pipe(
			concat(
				config.dist.js,
				{
					process: function (src, filepath) {
						return '// Source: ' + filepath + '\n' + src;
					}
				}
			)
		)
		.pipe(concat.header('/* MCSANDY: THE OFFLINE HTML5 SANDBOX */\n' + 'var store, mcsandyAppData, mcsandy, mcsandyPrefs, mcsandyUI;\n'))
		.pipe(concat.footer('\n' + 'mcsandyUI.init();\n' + 'mcsandy.init();\n' + 'mcsandyPrefs.init();\n'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('componentbuild', function () {
	return gulp.src(['src/html/header.html', 'src/html/main.html', 'src/html/footer.html', 'src/html/modal.html'])
	.pipe(
		concat(
			config.dist.html
		)
	)
	.pipe(gulp.dest('dist/'));
});
