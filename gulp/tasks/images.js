// -----------------------------------------------------------------------------
// Lib images optimization Task
// -----------------------------------------------------------------------------
'use strict';

var gulp       	= require('gulp');
var changed    	= require('gulp-changed');
var imagemin   	= require('gulp-imagemin');
var browserSync = require('browser-sync');
var config     	= require('../config').images;


// Optimiza las imágenes utilizadas en la aplicación de desarrollo del framework
gulp.task('images', function() {
  	return gulp.src(config.src)
	  	.pipe(changed(config.dest)) // Ignore unchanged files
	    .pipe(imagemin()) // Optimize
	    .pipe(gulp.dest(config.dest))
	    .pipe(browserSync.stream());
});