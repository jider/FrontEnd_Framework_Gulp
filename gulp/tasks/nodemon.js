// -----------------------------------------------------------------------------
// Start ExpressJs server
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp'),
    nodemon     = require('gulp-nodemon'),
    browserSync = require('browser-sync');


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;


gulp.task('nodemon', ['watchify'], function (cb) {

    var called = false;

    return nodemon({
        script: 'src/server/server.js',
        watch: ['src/server/']

    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!called) {
            cb();
        }
        called = true;

    }).on('restart', function() {
        // to avoid nodemon being restarted multiple times
        setTimeout(function() {
            browserSync.reload();
        }, BROWSER_SYNC_RELOAD_DELAY);
    });
});