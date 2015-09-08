// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp = require('gulp');

gulp.task('default', ['sass', 'images', 'markup', 'markup:fw', 'browserSync']);