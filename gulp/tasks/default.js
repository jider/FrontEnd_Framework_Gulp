// -----------------------------------------------------------------------------
// Default Task
// -----------------------------------------------------------------------------
'use strict';

var gulp = require('gulp');


/// -------------------------------------------------------------------------------------------------------


gulp.task('default:clean', ['clean:public'], function() {
   gulp.start('sass', 'fonts', 'images', 'markup', 'browserSync');
});

gulp.task('default', ['sass', 'fonts', 'images', 'markup', 'browserSync']);