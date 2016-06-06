var gulp = require('gulp');
var sass = require('gulp-sass');
var start = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var striplog = require('gulp-strip-debug');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var minify = require('gulp-minify-css');
var merge = require('merge-stream');


//we will add the app/controllers/services to this when it goes production
var js_paths = [
    'client/bower_components/jquery/dist/jquery.js',
		'client/bower_components/angular/angular.js',
		'client/bower_components/angular-route/angular-route.js',
		'client/bower_components/angular-loader/angular-loader.js',
		'client/bower_components/angular-animate/angular-animate.js',
		'client/assets/materialize-src/js/**/*.js',
		'client/bower_components/angular-materialize/src/angular-materialize.js',
		'client/bower_components/d3/d3.js',
		'client/bower_components/nvd3/build/nv.d3.js',
		'client/bower_components/angular-nvd3/dist/angular-nvd3.js',
];

var css_paths = [
  './client/assets/css/main/css',
  './client/bower_components/nvd3/build/nv.d3.css',
];
var sass_paths = [
  './client/assets/materialize-src/sass/*.scss',
];


// STYLES
//This compiles the sass files in the materialize folder
// then dumps the compiled sass in the css folder
gulp.task('styles', function() {
  var scssStream = gulp.src(sass_paths)
    .pipe(sass())
    .pipe(concat('scss-files.scss'))
  ;
  var cssStream = gulp.src(css_paths)
    .pipe(concat('css-files.css'))
  ;
  var mergedStream = merge(scssStream, cssStream)
    .pipe(concat('styles.css'))
    .pipe(minify())
    .pipe(gulp.dest('./client/assets/css'))
    .pipe(browserSync.stream());
  ;

  return mergedStream;

});


// SCRIPTS
//This grabs all the javascript files from materialize
// and minifies them
gulp.task('scripts', function() {
	//all the jquery we need for the front end
	//put them in order in src() to preserve load order
	return gulp.src(js_paths)
		.pipe(concat('assets.min.js'))
		.pipe(striplog())
		.pipe(uglify())
		.pipe(gulp.dest('./client/assets/js'))
		.on('error', gutil.log)
    .pipe(browserSync.stream());
});


// WATCH
//This should catch html changes and reload the browser
gulp.task('watch', function(){
	var index_src ="./client/index.html";
	var views_src ="./client/views/*.html";


  browserSync.init({
    server: {
      baseDir: './client'
    },
  })

  gulp.watch(js_paths, ['scripts']);
  gulp.watch(css_paths, ['styles']);

})


// START
//Starts the server on the localhost:1337
gulp.task('start', function () {
	start.server({
		root: './client/',
		port: 1337,
		hostname: '0.0.0.0'
	});
});


// RUN
//Start the server and watch for changes to do live reload
gulp.task('run', function (callback) {
  runSequence(['start', 'watch'],
    callback
  )
})
