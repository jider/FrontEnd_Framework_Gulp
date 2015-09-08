// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp = require('gulp');


gulp.task('default:clean', ['clean:all'], function() {
   gulp.start('sass', 'images', 'markup', 'markup:fw', 'browserSync');
});


gulp.task('default', ['sass', 'images', 'markup', 'markup:fw', 'browserSync']);