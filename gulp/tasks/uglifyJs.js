// -----------------------------------------------------------------------------
// Uglify JS files Task
// -----------------------------------------------------------------------------
'use strict'

var gulp 	= require('gulp');
var uglify 	= require('gulp-uglify');
var logger 	= require('../util/logger');
var config 	= require('../config').production;


gulp.task('uglifyJs', ['browserify'], function() {
	return gulp.src(config.jsSrc)
		.pipe(uglify())
		.pipe(gulp.dest(config.jsDest))
		.pipe(logger.fileEnd('Uglified file'));
});