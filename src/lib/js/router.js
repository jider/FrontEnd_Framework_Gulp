'use strict';

var Backbone = require('backbone');
var routerCfg = require('./routerConfig')();
var viewsCtlr	= require('./controllers/viewsController');

var _router = Backbone.Router.extend({
	routes: routerCfg.routes,

	execute: function(callback, args, name) {
		viewsCtlr.setView(routerCfg.getViewConfig(name));
	}
});


// Objeto público del router
module.exports = {
	initilize: function() {
		var myRouter = new _router();
		Backbone.history.start();		
	}
};