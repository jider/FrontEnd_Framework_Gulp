// -----------------------------------------------------------------------------
// Font Tasks
// -----------------------------------------------------------------------------
'use strict';


var gulp    = require('gulp'),
    changed = require('gulp-changed');

var config  = require('../config').fonts;


/// -------------------------------------------------------------------------------------------------------


gulp.task('fonts', function() {
   return gulp.src(config.src)
       .pipe(changed(config.dest))  // Ignore unchanged files
       .pipe(gulp.dest(config.dest));
});