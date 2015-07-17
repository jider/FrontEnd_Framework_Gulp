// -----------------------------------------------------------------------------
// Lib Sass Compilation
// -----------------------------------------------------------------------------
'use strict';

var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var sourcemaps 		= require('gulp-sourcemaps');
var autoprefixer 	= require('gulp-autoprefixer');
var browserSync 	= require('browser-sync');
var logger 			= require('../util/logger');
var handleErrors	= require('../util/handleErrors');
var config       	= require('../config').sass_lib;


gulp.task('sass:lib', function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(config.src)
		// Inicializamos los mapas de código para el CSS a generar
		.pipe(sourcemaps.init())
		// Ejecuta sass en los ficheros recuperados
		.pipe(sass(config.dev))
		// Control de errores
		.on('error', handleErrors)
		// Insertamos los prefijos por vendor en el CSS generado
		.pipe(autoprefixer())
		// Escribe los mapas de código para el CSS generado
		.pipe(sourcemaps.write(config.srcMapDest))		
		// Escribe el CSS resultante en la ruta de salida especificada en 'cssOutput'
		.pipe(gulp.dest(config.dest))
		// Log file size
		.pipe(logger.fileEnd('Generated style file'))
		// Refrescamos los navegadores
		.pipe(browserSync.stream());
});
