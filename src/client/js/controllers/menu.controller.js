'use strict';

var jquery      = require('jquery');
var foundation  = require('foundation');
var offcanvas   = require('foundation.offcanvas');
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
	var _view = menuView.init(menuModel, menuTpl, function() {
        jquery(document).foundation();
    });

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