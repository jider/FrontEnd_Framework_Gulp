// -----------------------------------------------------------------------------
// Configuration de las tareas automatizadas de GULP
// -----------------------------------------------------------------------------
'use strict';

var root			= './src/';
var appPath 		= root + 'lib/';
var appBuildPath	= appPath + 'build/';
var fwPath			= root + 'Framework/';

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
	production: {
		jsSrc: appBuildPath + 'js/*.js',
		cssSrc: appBuildPath + 'css/*.css',
		jsDest: appBuildPath + 'js/',
	    cssDest: appBuildPath + 'css/'
  	},

	// Configuración para la creación del servidor y sincronización de la aplicación de desarrollo del framwork en diferentes dispositivos
	browserSync: { 
		server: {
			baseDir: appBuildPath,
			index: "index.html"
			// routes: {
			// 	"/node_modules": "node_modules"
			// }
		}
	},

	clean_js: {
		src: [appBuildPath + 'js/**/*.js']
	},

	markup: {
		src: appPath + '*.html',
		dest: appBuildPath
	},

	markup_fw: {
		src: root + 'sites/**/*.html',
	},

	images: {
		src: appPath + "images/**",
    	dest: appBuildPath + "images"
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
		dest: appBuildPath +'css',
		srcMapDest: '.',
		dev: sassDev,
		pro: sassPro
	},
	sass_fw: {
		src: fwPath + 'scss/**/*.scss',
		dest: appBuildPath +'css',
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
    			entries: appPath + '/js/commons.js',
    			dest: appBuildPath + 'js',
		    	outputName: 'commons.js',
		    	// Extensiones de archivo adicionales para hacerlas opcionales
				extensions: ['.hbs'],
		    	// Lista de modulos a requerir externamente
				require: ['jquery', 'foundation']
    		},
    		// APP Backbone bundle
    		{
		    	entries: appPath + '/js/app.js',
		    	dest: appBuildPath + 'js',
		    	outputName: 'app.js',
				// Extensiones de archivo adicionales para hacerlas opcionales
				extensions: ['.hbs'],
				// Lista de modulos a requerir externamente
				external: ['jquery', 'foundation']
  			}
  		]
	},
};