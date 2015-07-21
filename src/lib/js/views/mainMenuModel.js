'use strict';

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
		// Sites
		{
			title: "Sites",
			items: [
				{
					name: "Site_Name_1",
					link: "#sites",
				},
				{
					name: "Site_Name_2",
					link: "#sites"
				},
				{
					name: "Site_Name_3",
					link: "#sites"
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
					link: "#docs"
				},
				{
					name: "JS Doc",
					link: "#docs"
				}
			]
		} // Documentation
	] // Sections
};

/*
var _telecinco = {
	secciones:[
	{
		label:"telecinco",
		items:[
			{
				name:"Home-telecinco",
				url:"#home",
			},


			{
				name:"Documentacion",
				url:"#docs",
			}
		]
	},
	{
		label:"modulos_telecinco",
		items:[
			{
				name:"modulo_1",
				url:"#menu/0"
			}
		]
	}]
};
*/

//var _menus = [_global, _telecinco];
var _menus = [_default];


// Public menu object
module.exports = {

	getMenu: function(site) {
		return _menus[site];
	}
	
};