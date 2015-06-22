'use strict';

/*
  
  En vez de administrar un enorme fichero que configure las tareas, 
  cada tarea se ha separado en un fichero dentro de la ruta 'gulp/tasks'.
  Cada uno de los ficheros de tarea definidos en esta carpeta se cargarán de forma automática.
  Esta separación modular de tareas nos permite compartir reutilizar los ficheros en diferentes royectos.

  Para añadir una nueva tarea, simplemente añade un nuevo fichero de tarea en el directorio 'gulp/tasks'.

  gulp/tasks/default.js especifica las tarea a ejecutar por defecto cuando lanzamos 'gulp'.

*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

 
// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

//var gulp = require('gulp');
//var sass = require('gulp-sass');
//var sourcemaps = require('gulp-sourcemaps');
//var autoprefixer = require('gulp-autoprefixer');
//var sassdoc = require('sassdoc');
//var browsersync = require('browser-sync').create();



// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// var appPath = './lib';
// var cssInput = appPath + '/scss/**/*.scss';
// var htmlInput = appPath + '/*.html';
// var cssOutput = appPath +'/css';
// var sassOptions = {
// 	dev: {
// 		errLogToConsole: true,
// 		includePaths: ['bower_components/foundation/scss'],
// 		outputStyle: 'expanded',
// 	},
// 	pro: {
// 		errLogToConsole: true,		
// 		includePaths: ['bower_components/foundation/scss'],
// 		outputStyle: 'compressed'
// 	}
// };
// var sourcemapsOutput = '.';
// var browsersyncOptions = { server: appPath };


/*
// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------

gulp.task('serve', ['sass'], function() {
	// Inicializamos el servidor
	browsersync.init(browsersyncOptions);

	// Watchers
	// Monitorizamos los cambios en CSS y HTML
	gulp.watch(cssInput, ['sass']);
	gulp.watch(htmlInput).on('change', browsersync.reload);
});
*/


/*
// -----------------------------------------------------------------------------
// Sass Compilation
// -----------------------------------------------------------------------------

gulp.task('sass', function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(cssInput)
		// Inicializamos los mapas de código para el CSS a generar
		.pipe(sourcemaps.init())
		// Ejecuta sass en los ficheros recuperados
		.pipe(sass(sassOptions.dev).on('error', sass.logError))
		// Insertamos los prefijos por vendor en el CSS generado
		.pipe(autoprefixer())
		// Escribe los mapas de código para el CSS generado
		.pipe(sourcemaps.write(sourcemapsOutput))		
		// Escribe el CSS resultante en la ruta de salida especificada en 'cssOutput'
		.pipe(gulp.dest(cssOutput))
		// Refrescamos los navegadores
		.pipe(browsersync.stream());
});
*/


/*
// -----------------------------------------------------------------------------
// Sass Documentation Generation
// -----------------------------------------------------------------------------

gulp.task('sassdoc', function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(cssInput)
		// Generamos la documentación incluida en los ficheros .scss
		.pipe(sassdoc())
		// liberamos la carga en memoria (este proceso puede ser pesado)
		.resume();
});
*/

/*
// -----------------------------------------------------------------------------
// Production Build
// -----------------------------------------------------------------------------

gulp.task('pro', ['sassdoc'], function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(cssInput)
		// Ejecuta sass en los ficheros recuperados
		.pipe(sass(sassOptions.pro).on('error', sass.logError))
		// Insertamos los prefijos por vendor en el CSS generado
		.pipe(autoprefixer())
		// Escribe el CSS resultante en la ruta de salida especificada en 'cssOutput'
		.pipe(gulp.dest(cssOutput));
});
*/


/*
// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------

gulp.task('default', ['browserSync']);
*/