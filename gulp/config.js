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
	includePaths: ['node_modules/foundation-sites/scss'],
	outputStyle: 'expanded'
};
var sassPro		= {
	errLogToConsole: true,		
	includePaths: ['node_modules/foundation-sites/scss'],
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
			index: "index.html",
			routes: {
				"/node_modules": "node_modules"
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
				require: ['jquery', 'underscore']
    		},
    		// Global Backbone bundle
    		{
		    	entries: appPath + '/js/global.js',
		    	dest: buildPath + 'js',
		    	outputName: 'global.js',
				// Extensiones de archivo adicionales para hacerlas opcionales
				extensions: ['.hbs'],
				// Lista de modulos a requerir externamente
				external: ['jquery', 'underscore']
  			},
  			// Page specific bundle
  			{
			  	entries: appPath + '/js/page.js',
			  	dest: buildPath + 'js',
			  	outputName: 'page.js',
				// Lista de módulos que estan disponibles de forma externa y excluimos del bundle
				external: ['jquery', 'underscore']
  			}
  			/*
  			{
  				entries: appPath + '/js/app.js',
  				dest: buildPath + 'js',
			  	outputName: 'app.js',
			  	external: ['jquery', 'plugin']
  			}
  			*/
  		]
	},
};