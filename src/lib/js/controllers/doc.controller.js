'use strict';

var docView  = require('../views/defaultView');
var docModel = {};
var docTpl	 = require('../views/tpls/documentation');


// Documentation view constructor
var _view = docView.init(docModel, docTpl);


module.exports = {
	view: _view,
	params: docView.defaultParams,
	title: "Documentation",
	menu: 0
};