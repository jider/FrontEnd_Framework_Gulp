// -----------------------------------------------------------------------------
// Framework Sass Compilation
// -----------------------------------------------------------------------------

var gulp 			= require('gulp');
var sass 			= require('gulp-sass');
var sourcemaps 		= require('gulp-sourcemaps');
var autoprefixer 	= require('gulp-autoprefixer');
var browserSync 	= require('browser-sync');
var handleErrors	= require('../util/handleErrors');
var config       	= require('../config').sass_fw;


gulp.task('sass:fw', function() {
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
		// Refrescamos los navegadores
		.pipe(browserSync.stream());
});