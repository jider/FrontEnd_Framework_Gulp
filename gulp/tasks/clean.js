// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp');
var del 	= require('del');
var config 	= require('../config').clean;

// Limpia el directorio publico
gulp.task('clean:all', function(cb) {
	del(config.src, cb);
});

// Limpia los ficheros JS de salida del proyecto de desarrollo del framework cuando se detecta un cambio
gulp.task('clean:js', function(cb) {
	del(config.clean_js.src, cb);
});