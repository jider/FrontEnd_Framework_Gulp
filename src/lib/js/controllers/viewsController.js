'use strict';

var menuCfg = require('../views/mainMenuModel');


var _setMenu = function(menu) {
    var viewMenu = require('../views/mainMenuView')(menu);

    return new viewMenu({
      el: '.mainNav'
    });
}


module.exports =  {
	setMenu: _setMenu,

  	setView: function(config) {
  		// Cremos el menú de la vista
	    _setMenu(menuCfg.getMenu(config.menu));

	    // Informamos el título de la vista
	    jQuery(".mainTitle").html(config.title);
	    
	    // Mostramos la vista
	    var view = config.view(config.context);
	    return new view({
	    	el: '#mainContent'
	    });
  	}
};
