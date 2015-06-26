// -----------------------------------------------------------------------------
// Sass Documentation Generation - Framework
// -----------------------------------------------------------------------------

var gulp 	= require('gulp');
var sassdoc = require('sassdoc');
var config  = require('../config').sassdoc;

gulp.task('sassdoc', function() {
	return gulp
		// Busca todos los ficheros '.scss' en el directorio de origen especificado en 'cssInput'
		.src(config.src)
		// Generamos la documentación incluida en los ficheros .scss
		.pipe(sassdoc(config.options))
		// liberamos la carga en memoria (este proceso puede ser pesado)
		.resume();
});