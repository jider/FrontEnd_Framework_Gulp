// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------

var gulp		= require('gulp');
var browserSync = require('browser-sync');
var config		= require('../config').browserSync_fw;


gulp.task('browserSync-fw', function() {
	// Inicializamos el servidor
	browserSync(config);
});