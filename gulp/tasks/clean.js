// -----------------------------------------------------------------------------
// Public assets clean Tasks
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp');
var del 	= require('del');
var config 	= require('../config').clean;

gulp.task('clean', function(cb) {
    del(config.all, cb);
});

// Limpia el directorio publico
gulp.task('clean:public', function(cb) {
	del(config.public, cb);
});

// Limpia el directorio de distribución
gulp.task('clean:dist', function(cb) {
	del(config.dist, cb);
});

// Limpia los ficheros JS de salida del proyecto de desarrollo del framework cuando se detecta un cambio
gulp.task('clean:js', function(cb) {
	del(config.js, cb);
});