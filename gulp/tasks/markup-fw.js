// -----------------------------------------------------------------------------
// Markup Compilation FW
// -----------------------------------------------------------------------------

var gulp 		= require('gulp');
var browserSync = require('browser-sync');
var config 		= require('../config').markup_fw;


gulp.task('markup-fw', function() {
	return gulp
		.src(config.src)
		.pipe(browserSync.stream());
});