// -----------------------------------------------------------------------------
// Markup Compilation
// -----------------------------------------------------------------------------
'use strict';

var gulp 		= require('gulp');
var browserSync = require('browser-sync');
var config 		= require('../config').markup;


// Tarea para el tratamiento del marcado HTML de la aplicación de desarrollo del framework
gulp.task('markup', function() {
	return gulp
		.src(config.src)
		.pipe(gulp.dest(config.dest))
		.pipe(browserSync.stream());
});