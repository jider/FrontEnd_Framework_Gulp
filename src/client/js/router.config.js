'use strict';

// Require de vistas
// Home
var homeCtlr = require('./controllers/home.controller.js');
// Sites
var sitesCtlr = require('./controllers/sites.controller.js');
// Modules Viewr
var modulesCtlr = require('./controllers/modules.controller.js');
// Documentation
var docCtlr = require('./controllers/doc.controller.js');
// Framework examples
var fwCtlr = require('./controllers/fw.controller.js');


module.exports = function() {
	// Routes mapping
	var _routes = {
		'': 'home',
		'sites/:name(/:id)': 'sites',
		'modules/:module/:tpl': 'modules',
		'docs(/:id)' : 'docs',
		'fw' : 'fw'
	};

	var controllers = {
		'home': homeCtlr,
		'sites': sitesCtlr,
		'modules': modulesCtlr,
		'docs': docCtlr,
		'fw': fwCtlr
	};


	// Public config Object
	return {
		// Routes mapping
		routes: _routes,

		// Devuelve el controlador correspondiente a la acción del enrutado solicitada
		getViewCtlr: function(action) {
			console.log('Controller: ' + action);
			return controllers[action];
		}		
	};

};