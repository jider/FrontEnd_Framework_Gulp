'use strict';

var sitesView 	= require('../views/defaultView');
var sitesModel	= {};
var sitesTpl	= require('../views/tpls/sites');


// Sites view constructor
var _view = sitesView.init(sitesModel, sitesTpl);


module.exports = {
	view: _view,
	params: sitesView.defaultParams,
	title: "Sites",
	menu: 0
};