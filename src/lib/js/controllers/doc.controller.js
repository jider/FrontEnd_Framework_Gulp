'use strict';

var docView  = require('../views/defaultView');
var docModel = {};
var docTpl	 = require('../views/tpls/documentation');


module.exports = function(id) {
	console.log('Site Ctlr -->', 'id: ' + id);

	docModel.id = id;

	// Documentation view constructor
	var _view = docView.init(docModel, docTpl);

	return {
		view: _view,
		params: docView.defaultParams,
		title: "Documentation",
		menu: 0
	}
};