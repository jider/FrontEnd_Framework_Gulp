'use strict';

var gulp = require('gulp');


/// -------------------------------------------------------------------------------------------------------


gulp.task('public', ['clean'], function() {
    gulp.start('sass', 'images', 'markup', 'browserify');
});