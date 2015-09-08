// -----------------------------------------------------------------------------
// Serve and sync browsers
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp');
var browserSync = require('browser-sync');
var config 	    = require('../config');


/// ------------------------------------------------------------------------------------------


gulp.task('browserSync', ['nodemon'], function() {
    browserSync(config.browserSync_server);

    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.markup.src, ['markup']);
    gulp.watch(config.markup_fw.src, ['markup:fw']);
});