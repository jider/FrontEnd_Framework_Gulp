/* browserify task
   ---------------
   Bundle javascripty things with browserify!
   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify.bundleConfigs in gulp/config.js
*/

'use strict';

var gulp 			= require('gulp');
var _				= require('lodash');
var browserify 		= require('browserify');
var browserSync 	= require('browser-sync');
var watchify 		= require('watchify');
var mergeStream		= require('merge-stream');
var source 			= require('vinyl-source-stream');
var streamify 		= require('gulp-streamify')
var logger			= require('../util/logger');
var handleErrors	= require('../util/handleErrors');
var config 			= require('../config').browserify;


var browserifyTask = function(devMode) {

	var browserifyThis = function(bundleConfig) {

		if (devMode) {
			// Añadimos los argumentos de 'watchify' y la opción de debug que genera los 'sourcemaps'
			_.extend(bundleConfig, watchify.args, { debug: true });
		}

		var b = browserify(bundleConfig);

		var bundle = function() {
			// Log when bundling starts
      		logger.bundle.start(bundleConfig.outputName);

			return b
				.bundle()
				// Report compile errors
				.on('error', handleErrors)
				// Use vinyl-source-stream to make the stream gulp compatible.
				// Specify the desired output filename here.
				.pipe(source(bundleConfig.outputName))				
				// Specify the output destination
				.pipe(gulp.dest(bundleConfig.dest))
				.pipe(streamify(logger.bundle.pipeEnd()))
				// Update browsers
				.pipe(browserSync.stream());
		}

		// Sort out shared dependencies.
  		// b.require exposes modules externally
  		if (bundleConfig.require) b.require(bundleConfig.require);
  		// b.external excludes modules from the bundle, and expects
  		// they'll be available externally
  		if (bundleConfig.external) b.external(bundleConfig.external);

		if (devMode) {
			// Wrap with watchify and rebundle on changes
			b = watchify(b);
			// Rebundle and update
			b.on('update', bundle);
			
			logger.bundle.watch(bundleConfig.outputName);
		}

		return bundle();
	};

	// Start bundling with Browserify for each bundleConfig specified
	return mergeStream.apply(gulp, _.map(config.bundleConfigs, browserifyThis));

};


// Task to create JS bundles
gulp.task('browserify', ['clean:js'], function() {
	return browserifyTask();
});

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;