// -----------------------------------------------------------------------------
// Start ExpressJs server
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp'),
    nodemon     = require('gulp-nodemon'),
    browserSync = require('browser-sync');

var serverCfg   = require('../config').server,
    serverInit  = new RegExp(serverCfg.listenText);


gulp.task('nodemon', ['watchify'], function (cb) {

    var called = false;

    return nodemon({
        script: 'src/server/server.js',
        ext: 'js',
        watch: ['src/server/'],
        stdout: false

    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!called) {
            cb();
        }
        called = true;

    }).on('readable', function(data) {
        this.stdout.on('data', function(chunk) {
            if (serverInit.test(chunk)) {
                browserSync.reload({
                    stream: false
                });
            }
            process.stdout.write(chunk);
        });
        this.stderr.pipe(process.stderr);
    });
});