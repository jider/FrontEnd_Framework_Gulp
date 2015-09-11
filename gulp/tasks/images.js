// -----------------------------------------------------------------------------
// Images optimization Tasks
// -----------------------------------------------------------------------------
'use strict';

var gulp       	= require('gulp'),
	changed    	= require('gulp-changed'),
	imagemin   	= require('gulp-imagemin');

var config     	= require('../config').images;


/// -------------------------------------------------------------------------------------------------------


// Optimiza las imágenes utilizadas en la aplicación de desarrollo del framework
gulp.task('images', function() {
  	return gulp.src(config.src)
	  	.pipe(changed(config.dest)) // Ignore unchanged files
	    .pipe(imagemin()) // Optimize
	    .pipe(gulp.dest(config.dest));
});