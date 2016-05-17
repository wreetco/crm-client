// We will want to look into using gulp
// Checkout Chases gulpfile.js and this website brandonclapp.com/what-is-gulp-js-and-why-use-it/

var gulp = require('gulp');
var sass = require('gulp-sass');
var start = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var striplog = require('gulp-strip-debug');
var gutil = require('gulp-util');


gulp.task('styles', function() {
	var css_src = './client/assets/materialize-src/sass/*.scss';
	var css_dest = './client/assets/css';

	gulp.src(css_src)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(css_dest));
});

gulp.task('scripts', function() {
	var js_src = './client/assets/materialize-src/js/*.js';
	var js_dest = './client/assets/js';

	gulp.src(js_src)
		.pipe(concat('materialize.min.js'))
		.pipe(striplog())
		.pipe(uglify())
		.pipe(gulp.dest(js_dest))
		.on('error', gutil.log);
});

gulp.task('start', function () {
	//Hopefully this would watch those sass files and recompile if they changed
	gulp.watch('./client/assets/materialize-src/sass/*.scss',['styles']);
	gulp.watch('./client/assets/sass/*.scss',['styles']);
	//and also start the server.
	start.server({
		root: './client/',
		port: 1337,
		hostname: '0.0.0.0'
	});
});
