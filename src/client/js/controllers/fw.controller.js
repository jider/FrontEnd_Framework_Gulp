'use strict';

var fwView 	= require('../views/defaultView');
var fwModel = {};
var fwTpl	= require('../../../Framework/views/color_palettes');


module.exports = function() {
	// Framework view constructor
	var _view = fwView.init(fwModel, fwTpl);

	return {
		view: _view,
		params: fwView.defaultParams,
		title: "Framework Examples",
		menu: 0
	};
};