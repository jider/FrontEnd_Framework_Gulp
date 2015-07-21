'use strict';

// Require de vistas
// Home
var homeView = require('./views/homeView');
var homeCtx  = require('./views/homeModel');
// Sites
var sitesView = require('./views/sitesView');
// Modules Viewr
var modulesView = require('./views/modulesViewrView');
// Documentation
var docView = require('./views/documentationView');


module.exports = function() {
	// Routes mapping
	var _routes = {
		'': 'home',
		'sites': 'sites',
		'modules': 'modules',
		'docs' : 'docs'
	};

	var routesMap = {
		'home': {
	  		view: homeView,
	  		title: "Framework App",
	  		context: homeCtx,
	  		menu: 0
		},
		'sites': {
	  		view: sitesView,
		  	title: "Sites",
		  	context: {},
		  	menu: 0
		},
		'modules': {
			view: modulesView,
			title: "Modules Viewr",
			context: {},
			menu: 0
		},
		'docs': {
			view: docView,
			title: "Documentation",
			context: {},
			menu: 0
		}		
	};


	// Public config Object
	return {
		// Routes mapping
		routes: _routes,		

		// Routes getter
		getViewConfig: function(view) {
			console.log('getViewConfig ' + view);
			return routesMap[view];;
		}		
	};

};