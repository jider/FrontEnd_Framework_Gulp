'use strict';

var modulesView  = require('../views/defaultView');
var modulesModel = {};
var modulesTpl	 = require('../views/tpls/modules/layout');
var partials 	 = require('../views/tpls/modules/partials');


module.exports = function(moduleName) {

	// Añadimos las vistas parciales
	modulesModel._module = partials[moduleName];

	// Modules view constructor
	var _view = modulesView.init(modulesModel, modulesTpl, function() {
		jQuery('.msg, [class^="msg-"]').each(function(index, el) {
			fwApp.modules.message(el);
		});
	});

	return {
		view: _view,
		params: modulesView.defaultParams,
		title: "Modules Viewr",
		menu: 0
	};
};