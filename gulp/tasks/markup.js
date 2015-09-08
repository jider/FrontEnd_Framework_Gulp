// -----------------------------------------------------------------------------
// Markup Compilation
// -----------------------------------------------------------------------------
'use strict';

var gulp 		= require('gulp');
var config 		= require('../config');


// Tarea para el tratamiento del marcado HTML de la aplicación de desarrollo del framework
gulp.task('markup', function() {
	return gulp
		.src(config.markup.src)
		.pipe(gulp.dest(config.markup.dest));
});

gulp.task('markup:fw', function() {
	return gulp
		.src(config.markup_fw.src)
		.pipe(gulp.dest(config.markup_fw.dest));
});