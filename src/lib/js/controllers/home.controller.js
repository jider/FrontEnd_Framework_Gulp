'use strict';

var homeView 	= require('../views/defaultView');
var homeModel 	= require('../models/home.model');
var homeTpl		= require('../views/tpls/home');


// Home view constructor
var _view = homeView.init(homeModel, homeTpl);


module.exports = {
	view: _view,
	params: homeView.defaultParams,
	title: "Framework App",
	menu: 0
};