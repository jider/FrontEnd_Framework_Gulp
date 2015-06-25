// -----------------------------------------------------------------------------
// Default Framework Task
// -----------------------------------------------------------------------------

var gulp 	= require('gulp');
var config 	= require('../config');


gulp.task('default-fw', ['sass-fw'], function() {
	gulp.watch(config.sass_fw.src, ['sass-fw']);	
});