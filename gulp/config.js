// -----------------------------------------------------------------------------
// Configuración de las tareas automatizadas de GULP
// -----------------------------------------------------------------------------
'use strict';

var root	= 'src/',
    appPath = root + 'client/',
    fwPath	= root + 'Framework/';

var publicPath	 = 'public/',
    publicView	 = publicPath + 'views/',
    publicClient = publicView + 'client/',
    publicFW	 = publicView + 'fw/';

var distPath	    = 'dist/';

var sassDev	= {
	errLogToConsole: true,
	includePaths: ['node_modules/foundation-sites/scss'],
	outputStyle: 'expanded'
};
var sassPro		= {
	errLogToConsole: true,
	includePaths: ['node_modules/foundation-sites/scss'],
	outputStyle: 'compressed'
};

// Configuracion del servidor ExpressJs
var serverCfg = require('../src/server/config').server;


/// -------------------------------------------------------------------------------------------------------


module.exports =  {
    'server': serverCfg,

    'production': {
		'jsSrc': publicPath + 'js/*.js',
		'cssSrc': publicPath + 'css/*.css',
		'jsDest': distPath + 'js/',
	    'cssDest': distPath + 'css/'
  	},

	// Configuración para la creación del servidor y sincronización de la aplicación de desarrollo del framwork en diferentes dispositivos
	"browserSync": {
		"server": {
			"baseDir": publicPath,
			"index": "index.html"
			/*"routes": {
		 		"/fw": "src/Framework/build"
			}*/
		}
	},

    "browserSync_server": {
        proxy: "http://localhost:5000",
        files: ["public/**/*.*"]
    },


	"clean": {
        'all': [publicPath, distPath],
        'public': [publicPath],
        "js": [publicPath + 'js/**/*.js'],
        'dist': [distPath]
	},

	"markup": {
		"src": [appPath + '**/*.html', appPath + '**/*.twig'],
		"dest": publicClient
	},

	"markup_fw": {
		"src": [fwPath + '**/*.html', fwPath + '**/*.twig'],
        "dest": publicFW
	},

	"images": {
		"src": appPath + "images/**",
    	"dest": publicPath + "images"
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

	sass: {
		'src': [appPath + 'scss/**/*.scss', fwPath + 'scss/**/*.scss'],
		'dest': publicPath + 'css',
		'srcMapDest': '.',
		'dev': sassDev,
		'pro': sassPro
	},

    sassdoc: {
		src: fwPath + 'scss/**/*.scss',
		options: {
			dest: fwPath + 'sassdoc'
		}
	},

    "browserify": {
	    // Se creará un bundle por cada configuración de bundle en la siguiente lista
    	"bundleConfigs": [
    		// Vendors bundle
    		{
    			"dest": publicPath + 'js',
		    	"outputName": 'commons.js',
		    	// Lista de modulos a requerir
				"require": ['jquery', 'modernizr', 'foundation']
    		},
            // APP Main bundle
            {
                "entries": fwPath + '/scripts/main.js',
                "dest": publicPath + 'js',
                "outputName": 'main.js',
                // Lista de modulos a requerir externamente
                "external": ['jquery']
            },
            // Initialization bundle
            {
                "entries": fwPath + '/scripts/inits.js',
                "dest": publicPath + 'js',
                "outputName": 'inits.js'
            }
  		]
	}
};