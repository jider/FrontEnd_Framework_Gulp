/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gutil        = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var startTime;

module.exports = {
  start: function(filepath) {
    startTime = process.hrtime();
    gutil.log('Bundling', gutil.colors.green.bold(filepath) + '...');
  },

  watch: function(bundleName) {
    gutil.log('Watching files required by', gutil.colors.green.bold(bundleName));
  },

  end: function(filepath, fileSize) {
    var taskTime = process.hrtime(startTime);
    var prettyTime = prettyHrtime(taskTime);
    gutil.log('Bundled', gutil.colors.green.bold(filepath), '[' + gutil.colors.yellow(fileSize) + ']', 'after', gutil.colors.magenta(prettyTime));
  }
};