'use strict';

var foundation 	=  require('foundation');
var menuView  	= require('../views/defaultView');
var menuModel 	= {};
var menuTpl	  	= require('../views/pages/mainMenu');

var _currentMenu;
var _viewParams = { 
	el: '.mainNav' 
};

// Main default menu
// -----------------------------------
var _default 		= require('./menu.config');
var _menuCollection = [_default];


// Carga la vista de menú solicitada
var _initMenu = function(menuType) {
	menuModel = _menuCollection[menuType];

	// Menu view constructor
	var _cb = function() { jQuery(document).foundation(); };
	var _view = menuView.init(menuModel, menuTpl, _cb);

	_currentMenu = menuType;
    return new _view(_viewParams);
};


// Public menu object
module.exports = {
	initMenu: function(menuType) {
		if (menuType !== _currentMenu) {
			_initMenu(menuType);
		}
	}
};