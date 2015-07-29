'use strict';

var foundation =  require('foundation');
var menuView  = require('../views/defaultView');
var menuModel = {};
var menuTpl	  = require('../views/tpls/mainMenu');

var _currentMenu;
var _viewParams = { 
	el: '.mainNav' 
};


// Main default menu
// -----------------------------------
var _default = {
	// Sections
	sections: [
		// Default
		{
			items: [
				{
					name: "Home",
					link: "#"
				}
			]
		}, // Default
		// Framework Examples
		{
			title: "Framework",
			items: [
				{
					name: "Color palettes",
					link: "#fw"
				}
			]
		}, // Framework Examples
		// Sites
		{
			title: "Sites",
			items: [
				{
					name: "Site_Name_1",
					link: "#sites/cuatro/25",
				},
				{
					name: "Site_Name_2",
					link: "#sites/t5"
				},
				{
					name: "Site_Name_3",
					link: "#sites/divinity/999"
				}
			]
		}, // Sites
		// Modules Viewr
		{
			title:"Modules Viewr",
			items: [
				// Module_Name_1
				{
					name: "Module_Name_1",
					subsection: {
						title: "Module_Name_1",
						items: [
							{
								name: "Module_Name_1_1",
								link: "#modules"
							},
							{
								name: "Module_Name_1_2",
								link: "#modules"
							},
							{
								name: "Module_Name_1_3",
								link: "#modules"
							}
						]
					}
				}, // Module_Name_1
				// Module_Name_2
				{
					name: "Module_Name_2",
					subsection: {
						title: "Module_Name_2",
						items: [
							{
								name: "Module_Name_2_1",
								link: "#modules"
							},
							{
								name: "Module_Name_2_2",
								link: "#modules"
							},
							{
								name: "Module_Name_2_3",
								link: "#modules"
							}
						]
					}
				}, // Module_Name_2
				// Module_Name_3
				{
					name: "Module_Name_3",
					subsection: {
						title: "Module_Name_3",
						items: [
							{
								name: "Module_Name_3_1",
								link: "#modules"
							},
							{
								name: "Module_Name_3_2",
								link: "#modules"
							},
							{
								name: "Module_Name_3_3",
								link: "#modules"
							}
						]
					}
				} // Module_Name_3
			]
		}, // Modules Viewr
		// Documentation
		{
			title: "Documentation",
			items: [
				{
					name: "Sass Doc",
					link: "#docs/58"
				},
				{
					name: "JS Doc",
					link: "#docs"
				}
			]
		} // Documentation
	] // Sections
};

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