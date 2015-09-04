// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------

var gulp			= require('gulp');
var browserSync 	= require('browser-sync');
var config			= require('../config').browserSync;
var config_server 	= require('../config').browserSync_server;


gulp.task('browserSync', function() {
	// Inicializamos el servidor
	browserSync(config);
});


gulp.task('browserSync:server', ['nodemon'], function() {
	// Inicializamos el servidor
	browserSync.init(config_server);
});