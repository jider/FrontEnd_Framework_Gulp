// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

var gulp 	= require('gulp');
var config 	= require('../config');

// Watchify will watch and recompile our JS, so no need to gulp.watch it
gulp.task('watch', ['watchify', 'browserSync'], function() {
	gulp.watch(config.sass_lib.src, ['sass-lib']);
	gulp.watch(config.markup.src, ['markup']);
});