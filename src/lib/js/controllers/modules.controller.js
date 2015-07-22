'use strict';

var modulesView  = require('../views/defaultView');
var modulesModel = {};
var modulesTpl	 = require('../views/tpls/modules');


// Modules view constructor
var _view = modulesView.init(modulesModel, modulesTpl);


module.exports = {
	view: _view,
	params: modulesView.defaultParams,
	title: "Modules Viewr",
	menu: 0
};