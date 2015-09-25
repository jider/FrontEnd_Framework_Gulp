// -----------------------------------------------------------------------------
// Markup Compilation
// -----------------------------------------------------------------------------
'use strict';

var gulp 	= require('gulp'),
	replace	= require('gulp-replace');

var config 	= require('../config').markup;


/// -------------------------------------------------------------------------------------------------------


gulp.task('markup', ['markup:fw', 'markup:client']);

gulp.task('markup:client', function() {
	return gulp
		.src(config.clientSrc)
		.pipe(gulp.dest(config.clientDest));
});

gulp.task('markup:fw', function() {
	return gulp
		.src(config.fwSrc)
		.pipe(gulp.dest(config.fwDest));
});

gulp.task('markup:dist', function() {
    var superRegExp = /{{\s*super\(\)\s*}}/g,
        elifRegExp  = /{%\s*elif\s+/g;

    return gulp
        .src(config.distSrc)
        .pipe(replace(superRegExp, '{{ parent() }}', { skipBinary: true }))
        .pipe(replace(elifRegExp, '{% elseif ', { skipBinary: true }))
        .pipe(gulp.dest(config.distDest));
});