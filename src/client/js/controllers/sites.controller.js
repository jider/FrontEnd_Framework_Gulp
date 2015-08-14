'use strict';

var sitesView 	= require('../views/defaultView');
var sitesModel	= {};
var sitesTpl	= require('../views/pages/sites');


module.exports = function(name, id) {
	console.log('Site Ctlr -->', 'name: ' + name, '| id: ' + id);

	sitesModel.name = name;
	sitesModel.id = id;

	// Sites view constructor
	var _view = sitesView.init(sitesModel, sitesTpl);

	return {
		view: _view,
		params: sitesView.defaultParams,
		headerTitle: "Sites",
		menu: 0
	};
};