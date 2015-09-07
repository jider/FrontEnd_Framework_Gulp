// -----------------------------------------------------------------------------
// Start ExpressJs server
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp');
var nodemon     = require('gulp-nodemon');
var browserSync = require('browser-sync');
var _ = require('lodash');


// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;


gulp.task('nodemon', ['watchify'], function (cb) {

    var called = false;
    var _restart = false;

    return nodemon({
        script: 'src/server/server.js',
        watch: ['src/server/']

    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!called) {
            cb();
        }
        called = true;
        _restart = true;

    }).on('restart', function() {
        if (_restart) {
            _restart = false;

            setTimeout(function() {
                browserSync.reload();
            }, BROWSER_SYNC_RELOAD_DELAY);
        }
    });
});