'use strict';

// Require de vistas
// Home
var homeCtlr = require('./home.controller');
// Sites
var sitesCtlr = require('./sites.controller');
// Modules Viewr
var modulesCtlr = require('./modules.controller');
// Documentation
var docCtlr = require('./doc.controller');


module.exports = function() {
	// Routes mapping
	var _routes = {
		'': 'home',
		'sites': 'sites',
		'modules': 'modules',
		'docs' : 'docs'
	};

	var controllers = {
		'home': homeCtlr,
		'sites': sitesCtlr,
		'modules': modulesCtlr,
		'docs': docCtlr
	};


	// Public config Object
	return {
		// Routes mapping
		routes: _routes,		

		// Routes getter
		getViewConfig: function(action) {
			console.log('getViewConfig ' + action);
			return controllers[action];
		}		
	};

};