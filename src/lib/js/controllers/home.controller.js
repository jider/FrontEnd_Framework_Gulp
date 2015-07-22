'use strict';

var homeView 	= require('../views/defaultView');
var homeModel 	= require('../models/home.model');
var homeTpl		= require('../views/tpls/home');

// Partials
var _header = require('../views/tpls/_main_header');


module.exports = function() {
	// Añadimos las vistas parciales
	homeModel._header = _header;

	// Home view constructor
	var _view = homeView.init(homeModel, homeTpl);

	return {
		view: _view,
		params: homeView.defaultParams,
		title: "Framework App",
		menu: 0
	};
};