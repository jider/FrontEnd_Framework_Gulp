'use strict';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var root		= './src/';
var appPath 	= root + 'lib/';
var fwPath		= root + 'Framework/';
var buildPath 	= root + 'dist/';

var sassDev		= {
	errLogToConsole: true,
	includePaths: ['bower_components/foundation/scss'],
	outputStyle: 'expanded'
};
var sassPro		= {
	errLogToConsole: true,		
	includePaths: ['bower_components/foundation/scss'],
	outputStyle: 'compressed'
};


module.exports =  {
	markup: {
		src: appPath + '*.html',	
	},
	
	browserSync: { 
		server: {
			baseDir: appPath,
			index: "index.html",
			routes: {
        		"/bower_components": "bower_components"
    		}	
		}
	},

	sass_lib: {
		src: appPath + 'scss/**/*.scss',
		dest: appPath +'css',
		srcMapDest: '.',
		dev: sassDev,
		pro: sassPro
	},
	sass_fw: {
		src: fwPath + '**/*.scss',
		dest: buildPath +'css',
		srcMapDest: '.',
		dev:sassDev,
		pro:sassPro
	}, 
	sassdoc: {
		src: appPath + 'scss/**/*.scss',
		options: {
			dest: root + 'sassdoc'
		}
	}
};