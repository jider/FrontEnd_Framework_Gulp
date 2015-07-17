// -----------------------------------------------------------------------------
// Watchers for the Framework
// -----------------------------------------------------------------------------

var gulp 	= require('gulp');
var config 	= require('../config');


gulp.task('watch-fw', ['browserSync-fw'], function() {
	gulp.watch(config.sass_fw.src, ['sass:fw']);
	gulp.watch(config.markup_fw.src, ['markup-fw']);
});