'use strict';

var gulp = require('gulp');

gulp.task('dev', ['sass', 'images', 'markup', 'markup:fw', 'browserify']);