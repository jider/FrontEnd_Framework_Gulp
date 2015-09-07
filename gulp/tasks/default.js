// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');


// Forzamos 'browserSync.reload' tras lanzar todas las tareas de 'default', para asegurarnos 
// de que se han cargado en el navegador todos los assets.
// Puede no visualizarse correctamente la salida en el navegador la primera vez que se crean 
// todos los ficheros a distribuir.
gulp.task('default', ['sass', 'images', 'markup', 'markup:fw', 'watch'], browserSync.reload);

gulp.task('default:server', ['sass', 'images', 'markup', 'markup:fw', 'browserSync:server']);