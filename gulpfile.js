// We will want to look into using gulp
// Checkout Chases gulpfile.js and this website brandonclapp.com/what-is-gulp-js-and-why-use-it/

var gulp = require('gulp');


var start = require('gulp-connect');

gulp.task('start', function () {
	start.server({
		root: 'client/',
		port: 1337
	});
});
