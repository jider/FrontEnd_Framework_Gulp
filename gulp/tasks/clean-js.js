// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp');
var del 	= require('del');
var config 	= require('../config').clean_js;


// Limpia los ficheros JS de salida del proyecto de desarrollo del framework cuando se detecta un cambio
gulp.task('clean:js', function(cb) {
	del(config.src, cb);
});