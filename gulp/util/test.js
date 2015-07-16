var map = require('map-stream');
var gutil = require('gulp-util');
var fileSize		= require('./fileSizeCalc');

module.exports = function () {
	return map(function(file, cb){
		gutil.log(gutil.colors.green(file.path), '[' + fileSize(file.stat.size) + ']');
		
	  	cb(null,file);
  	});
};