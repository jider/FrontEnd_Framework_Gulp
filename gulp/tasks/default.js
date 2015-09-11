// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp = require('gulp');


/// -------------------------------------------------------------------------------------------------------


gulp.task('default:clean', ['clean:public'], function() {
   gulp.start('sass', 'images', 'markup', 'browserSync');
});

gulp.task('default', ['sass', 'images', 'markup', 'browserSync']);