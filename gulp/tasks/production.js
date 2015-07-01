// -----------------------------------------------------------------------------
// Production Build
// -----------------------------------------------------------------------------

var gulp 		 = require('gulp');
var sass 		 = require('gulp-sass');
var handleErrors = require('../util/handleErrors');
var config 		 = require('../config').sass;

// gulp.task('production', ['sassdoc', 'markup', 'images', 'minifyCss', 'uglifyJs']);

gulp.task('production', ['sassdoc'], function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(config.src)
		// Ejecuta sass en los ficheros recuperados
		.pipe(sass(config.pro))
		// Control de errores
		.on('error', handleErrors)
		// Insertamos los prefijos por vendor en el CSS generado
		.pipe(autoprefixer())
		// Escribe el CSS resultante en la ruta de salida especificada en 'cssOutput'
		.pipe(gulp.dest(config.dest));
});