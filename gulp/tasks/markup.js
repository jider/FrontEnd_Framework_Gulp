// -----------------------------------------------------------------------------
// Markup Compilation
// -----------------------------------------------------------------------------
'use strict';

var gulp 		= require('gulp');
var config 		= require('../config');


/// -------------------------------------------------------------------------------------------------------


gulp.task('markup', ['markup:server', 'markup:fw', 'markup:client']);

gulp.task('markup:client', function() {
	return gulp
		.src(config.markup_client.src)
		.pipe(gulp.dest(config.markup_client.dest));
});

gulp.task('markup:fw', function() {
	return gulp
		.src(config.markup_fw.src)
		.pipe(gulp.dest(config.markup_fw.dest));
});

gulp.task('markup:server', function() {
	return gulp
		.src(config.markup_server.src)
		.pipe(gulp.dest(config.markup_server.dest));
});