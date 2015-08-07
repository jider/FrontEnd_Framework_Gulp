'use strict';

var menuCfg = require('../controllers/menu.controller');


module.exports = function() {
	
	var _setMenu = function(menu) {
    	menuCfg.initMenu(menu);
	};

	return {
		setMenu: _setMenu,	

		setView: function(viewCfg) {
	  		// Cremos el menú de la vista
	  		_setMenu(viewCfg.menu || 0);

		    // Informamos el título de la vista
		    jQuery(".mainTitle").html(viewCfg.headerTitle || '');
		    
		    // Creamos una nueva instancia de la vista y la mostramos
		    return new viewCfg.view(viewCfg.params);
  		}
	};

};
