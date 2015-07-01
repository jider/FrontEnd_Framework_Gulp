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
		dest: buildPath
	},

	markup_fw: {
		src: root + 'sites/**/*.html',
	},

	images: {
    	src: appPath + "images/**",
    	dest: buildPath + "images"
  	},
	
	browserSync: { 
		server: {
			baseDir: buildPath,
			index: "layout.html",
			routes: {
				"/bower_components": "bower_components"
			}
		}
	},

	browserSync_fw: { 
		server: {
			baseDir: root + 'sites/',
			index: "index.html",
			routes: {
				"/dist" : "src/dist"
			}
		}
	},

	sass_lib: {
		src: appPath + 'scss/**/*.scss',
		dest: buildPath +'css',
		srcMapDest: '.',
		dev: sassDev,
		pro: sassPro
	},
	sass_fw: {
		src: fwPath + 'scss/**/*.scss',
		dest: buildPath +'css',
		srcMapDest: '.',
		dev:sassDev,
		pro:sassPro
	}, 
	sassdoc: {
		src: fwPath + 'scss/**/*.scss',
		options: {
			dest: fwPath + 'sassdoc'
		}
	},
	browserify: {
	    // Se creará un bundle por cada configuración de bundle en la siguiente lista
    	bundleConfigs: [
    		// Vendors bundle
    		{
    			dest: buildPath + 'js',
		    	outputName: 'vendor.js',
		    	// Lista de modulos a requerir externamente
				require: ['modernizr', 'jquery', 'foundation', 'underscore', 'fastClick']
    		},
    		// Global Backbone bundle
    		{
		    	entries: appPath + '/js/global.js',
		    	dest: buildPath + 'js',
		    	outputName: 'global.js',
				// Extensiones de archivo adicionales para hacerlas opcionales
				extensions: ['.hbs'],
				// Lista de módulos que estan disponibles de forma externa y excluimos del bundle
				external: ['jquery', 'underscore'],
  			},
  			// Page specific bundle
  			{
			  	entries: appPath + '/js/page.js',
			  	dest: buildPath + 'js',
			  	outputName: 'page.js',
				// Lista de módulos que estan disponibles de forma externa y excluimos del bundle
				external: ['jquery', 'underscore']
  			}
  		]
	},
};