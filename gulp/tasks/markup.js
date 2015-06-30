// -----------------------------------------------------------------------------
// Markup Compilation
// -----------------------------------------------------------------------------

var gulp 		= require('gulp');
var browserSync = require('browser-sync');
var config 		= require('../config').markup;


gulp.task('markup', function() {
	return gulp
		.src(config.src)
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.stream());
});