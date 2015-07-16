'use strict';

var gulp 	= require('gulp');
var testLog	= require('../util/test');
var config 	= require('../config').browserify;


gulp.task('testTask', function(cb) {
	gulp.src(config.bundleConfigs[0].entries)
	.pipe(testLog());
});
