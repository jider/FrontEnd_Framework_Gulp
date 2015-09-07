// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------

var gulp			= require('gulp');
var browserSync 	= require('browser-sync');
var config			= require('../config').browserSync;
var config_server 	= require('../config').browserSync_server;
var conf 	= require('../config');


gulp.task('browserSync', function() {
	// Inicializamos el servidor
	browserSync(config);
});


gulp.task('browserSync:server', ['nodemon'], function() {
	// Inicializamos el servidor
	//browserSync.create();
	browserSync.init(config_server);

    gulp.watch(conf.sass.src, ['sass']);
    gulp.watch(conf.markup.src, ['markup']);
    gulp.watch(conf.markup_fw.src, ['markup:fw']);
});
