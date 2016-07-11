var		gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		nib = require('nib'),
		concat = require('gulp-concat-util'),
		uglify = require('gulp-uglify'),
		replace = require('gulp-replace'),
		fs = require('fs');

var config = {
	src: {
		css: 'src/css/*.styl',
		js: 'src/js/*.js',
		shell: 'src/mcsandy.html',
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

gulp.task('componentbuild',['stylus', 'js'], function () {
	return gulp.src(['src/html/header.html', 'src/html/main.html', 'src/html/footer.html', 'src/html/modal.html'])
	.pipe(
		concat(
			config.dist.html
		)
	)
	.pipe(gulp.dest('dist/'));
});

gulp.task('build',['componentbuild', 'stylus', 'js'] ,function () {
	return gulp.src(config.src.shell)
		.pipe(replace(/<link href="mcsandy.min.css"[^>]*>/, function(s) {
			var style = fs.readFileSync('dist/mcsandy.min.css', 'utf8');
			console.log('style');
			return '<style type="text/css">\n' + style + '\n</style>';
		}))
		.pipe(replace(/<components src="components.html"[^>]*>/, function(s) {
			var components = fs.readFileSync('dist/components.html', 'utf8');
			return  '\n'+ components + '\n';
		}))
		.pipe(replace(/<scripts src="mcsandy.min.js"[^>]*>/, function(s) {
			var script = fs.readFileSync('dist/mcsandy.min.js', 'utf8');
			return '<script type="text/javascript">\n' + script + '\n</script>';
		}))
		.pipe(gulp.dest(''));
});

gulp.task('watch', function () {
	gulp.watch(config.src.js, ['build']);
	gulp.watch(config.src.css, ['build']);
	gulp.watch(config.src.html, ['build']);
})

gulp.task('default', ['componentbuild','js','stylus','build','watch']);


