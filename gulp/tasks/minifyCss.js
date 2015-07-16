// -----------------------------------------------------------------------------
// Minify CSS files Task
// -----------------------------------------------------------------------------
'use strict';

var gulp 		= require('gulp');
var minifyCSS 	= require('gulp-minify-css');
var bundleLogger	= require('../util/bundleLogger');
var config 		= require('../config').production;


gulp.task('minifyCss', ['sass-lib'], function() {
	return gulp.src(config.cssSrc)
		.pipe(minifyCSS())
		.pipe(gulp.dest(config.cssDest));
})