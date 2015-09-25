// -----------------------------------------------------------------------------
// Public assets clean Tasks
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp'),
	del 	= require('del');

var config 	= require('../config').clean;


/// -------------------------------------------------------------------------------------------------------

// Limpia los directorios 'public' y de 'distribucion'
gulp.task('clean', ['clean:public', 'clean:dist']);

// Limpia el directorio publico
gulp.task('clean:public', function(cb) {
	del(config.public).then(function(paths) {
		cb();
	});
});

// Limpia el directorio de distribución
gulp.task('clean:dist', function(cb) {
	del(config.dist).then(function(paths) {
		cb();
	});
});

// Limpia los ficheros JS de salida del proyecto de desarrollo del framework cuando se detecta un cambio
gulp.task('clean:js', function(cb) {
	del(config.js).then(function(paths) {
		cb();
	});
});