'use strict';

var Backbone = require('backbone');
var routerCtlr = require('./controllers/router.controller')();
var viewsCtlr	= require('./helpers/views.helper')();

var _router = Backbone.Router.extend({
	routes: routerCtlr.routes,

	execute: function(callback, args, name) {
		// Si hemos definido una acción para la ruta solicitada la llamamos,
		// en vez de acceder al método por defecto 
		if (callback) callback.apply(this, args);

		// Muestra una vista basado en la configuración dce la misma
		viewsCtlr.setView(routerCtlr.getViewConfig(name));
	}
});


// Objeto público del router
module.exports = {
	initilize: function() {
		var myRouter = new _router();
		Backbone.history.start();		
	}
};