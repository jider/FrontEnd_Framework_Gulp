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

    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.markup_client.src, ['markup:client']);
    gulp.watch(config.markup_fw.src, ['markup:fw']);
    gulp.watch(config.markup_server.src, ['markup:server']);
});