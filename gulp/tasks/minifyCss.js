// -----------------------------------------------------------------------------
// Minify CSS files Task
// -----------------------------------------------------------------------------
'use strict';

var gulp 		= require('gulp');
var minifyCSS 	= require('gulp-minify-css');
var md5     	= require('../util/md5Rename');
var logger 		= require('../util/logger');
var config 		= require('../config').production;


/// -------------------------------------------------------------------------------------------------------


gulp.task('minifyCss', ['sass'], function() {
	return gulp.src(config.cssSrc)
		.pipe(minifyCSS())
		.pipe(md5())
		.pipe(gulp.dest(config.cssDest))
		.pipe(logger.fileEnd('Minified style file'));
})