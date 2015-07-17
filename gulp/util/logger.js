// -----------------------------------------------------------------------------
// LOGGER
// Provee de logs al estilo de gulp
// -----------------------------------------------------------------------------
'use strict';

var map 		 = require('map-stream');
var gutil 		 = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var fileSizeCalc = require('./fileSizeCalc');


// Bundle Logger (usado principalmente por la tarea browserify)
var _bundle = (function() {
	var startTime;

	var _end = function(filepath, filesize) {
		var taskTime = process.hrtime(startTime);
		var prettyTime = prettyHrtime(taskTime);
		var _filesize = fileSizeCalc(filesize);

		gutil.log('Bundled file', gutil.colors.green.bold(filepath), '[' + gutil.colors.yellow(_filesize) + '],', 'after', gutil.colors.magenta(prettyTime));
	};


	// Public object
	return {	
		start: function(filepath) {
			startTime = process.hrtime();
			gutil.log('Bundling file', gutil.colors.green.bold(filepath) + '...');
		},

		watch: function(filepath) {
			gutil.log('Watching files required by', gutil.colors.green.bold(filepath));
		},

		end: _end,

		pipeEnd: function() {
			return map(function(file, cb){
				_end(file.relative, Buffer.byteLength(String(file.contents)));
		  		cb(null,file);
			});
		}
	};
})();


/// -----------------------------------
/// Public Logger
/// -----------------------------------
module.exports = {
	bundle: _bundle,

	fileEnd: function(msg) {
		msg = msg || 'File';

		return map(function(file, cb){
			var fileSize = fileSizeCalc(Buffer.byteLength(String(file.contents)));
			gutil.log(msg, gutil.colors.green.bold(file.relative), '[' + gutil.colors.yellow(fileSize) + ']');

	  		cb(null,file);
		});
	}
};
