// We will want to look into using gulp
// Checkout Chases gulpfile.js and this website brandonclapp.com/what-is-gulp-js-and-why-use-it/

var gulp = require('gulp');
var sass = require('gulp-sass');
var start = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var striplog = require('gulp-strip-debug');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');


//This compiles the sass files in the materialize folder
// then dumps the compiled sass in the css folder
gulp.task('styles', function() {
	var css_src = './client/assets/materialize-src/sass/\*.scss';
	var css_dest = './client/assets/css';

	gulp.src(css_src)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(css_dest))
		.pipe(browserSync.reload({
      		stream: true
    	}));
});

//This grabs all the javascript files from materialize
// and minifies them
gulp.task('materialize-scripts', function() {
	var js_src = './client/assets/materialize-src/js/\*.js';
	var js_dest = './client/assets/js';

	gulp.src(js_src)
		.pipe(concat('materialize.min.js'))
		.pipe(striplog())
		.pipe(uglify())
		.pipe(gulp.dest(js_dest))
		.on('error', gutil.log)
		.pipe(browserSync.reload({
      		stream: true
    	}));
});

//This should catch *most* project changes and automagically reload your browser, neato
gulp.task('watch', ['browserSync', 'styles', 'scripts',], function(){
	var js_src = './client/assets/materialize-src/js/*.js';
	var css_src = './client/assets/materialize-src/sass/**/*.scss';
	var index_src ="./client/index.html";
	var views_src ="./client/views/*.html";

    gulp.watch(js_src, ['scripts']); 
  	gulp.watch(css_src, ['styles']);
  	gulp.watch(index_src, browserSync.reload);
  	gulp.watch(views_src, browserSync.reload);
  
})

//Reload browser when you make a change to sass or js
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './client'
    },
  })
})

//Starts the server on the localhost:1337
gulp.task('start', function () {
	start.server({
		root: './client/',
		port: 1337,
		hostname: '0.0.0.0'
	});
});

//Start the server and watch for changes to do live reload
gulp.task('run', function (callback) {
  runSequence(['start', 'watch'], 
    callback
  )
})
