'use strict';

var modulesView  = require('../views/defaultView');
var modulesModel = {};
var modulesTpl	 = require('../views/modules/layout');
var modulesCfg 	 = require('../views/modules/config');


module.exports = function(module, tpl) {

    // Título
    modulesModel.title = module;

	// Añadimos las vistas parciales
	modulesModel._module = modulesCfg[module].tpls[tpl];

	// Modules view constructor
	var _view = modulesView.init(modulesModel, modulesTpl, modulesCfg[module].initializer);

	return {
		view: _view,
		params: modulesView.defaultParams,
		headerTitle: "Modules viewr - " + module,
		menu: 0
	};
};