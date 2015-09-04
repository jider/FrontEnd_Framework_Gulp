// -----------------------------------------------------------------------------
// Start ExpressJs server
// -----------------------------------------------------------------------------
'use strict';

var gulp		= require('gulp');
var nodemon     = require('gulp-nodemon');


gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({ script: 'src/server/server.js'})
        .on('start', function () {
            // to avoid nodemon being started multiple times
            if (!started) {
                cb();
                started = true;
            }
        });
});