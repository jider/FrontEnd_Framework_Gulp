// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp');
var config 	= require('../config');


// Watchify monitoriza y recompila nuestro JS al vuelo, por lo que no es necesario crear un 'gulp.watch' sobre estos ficheros
gulp.task('watch', ['watchify', 'browserSync'], function() {
	gulp.watch(config.sass.src, ['sass']);
	gulp.watch(config.markup.src, ['markup']);
	gulp.watch(config.markup_fw.src, ['markup:fw']);
});