'use strict';

var Backbone = require('backbone');
var routerCtlr = require('./router.config')();
var viewsCtlr	= require('./helpers/views.helper')();

var _router = Backbone.Router.extend({
	routes: routerCtlr.routes,

	execute: function(callback, args, name) {
		// Si hemos definido una acción para la ruta solicitada la llamamos,
		// en vez de acceder al método por defecto 
		if (callback) {
			callback.apply(this, args);

		} else {
			// Muestra una vista basada en el controlador de la misma
			// Se informan los parámetros introducidos en la solicitud, al instanciar el controlador
			var _viewCtlr = routerCtlr.getViewCtlr(name);
			viewsCtlr.setView(_viewCtlr.apply(this, args));			
		}
	}
});


// Objeto público del router
module.exports = {
	initilize: function() {
		var myRouter = new _router();
		Backbone.history.start();		
	}
};