'use strict';

var gulp 	= require('gulp');
var del 	= require('del');
var config 	= require('../config').clean_js;


gulp.task('clean:js', function(cb) {
	del(config.src, cb);
});