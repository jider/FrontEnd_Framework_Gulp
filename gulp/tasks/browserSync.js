// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp'),
    browserSync = require('browser-sync');

var config 	    = require('../config');


/// ------------------------------------------------------------------------------------------


gulp.task('browserSync', ['nodemon'], function() {
    browserSync(config.browserSync_server);

    gulp.watch(config.sass.src, ['sass'], browserSync.reload);
    gulp.watch(config.markup.clientSrc, ['markup:client']);
    gulp.watch(config.markup.fwSrc, ['markup:fw']);
});