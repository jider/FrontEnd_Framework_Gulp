// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

var gulp 	= require('gulp');
var config 	= require('../config');


gulp.task('watch', ['browserSync'], function() {
	gulp.watch(config.sass_lib.src, ['sass-lib']);
	gulp.watch(config.markup.src, ['markup']);
});