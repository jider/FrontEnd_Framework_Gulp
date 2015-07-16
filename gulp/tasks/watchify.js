// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp           = require('gulp');
var browserifyTask = require('./browserify');


// Monitoriza y compila al vuelo los ficheros JS de salida del proyecto de desarrollo del framework, cuando se detecta un cambio
gulp.task('watchify', ['clean:js'], function() {
  // Inicializamos la tarea de browserify con el modo de desarrollo activado (devMode === true)
  return browserifyTask(true);
});