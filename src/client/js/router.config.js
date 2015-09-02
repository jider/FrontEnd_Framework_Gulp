'use strict';

// Controllers mapping
var controllers = {
    'home': require('./controllers/home.controller.js'),
    'sites': require('./controllers/sites.controller.js'),
    'modules': require('./controllers/modules.controller.js'),
    'docs': require('./controllers/doc.controller.js'),
    'fw': require('./controllers/fw.controller.js'),
	'components':require('./controllers/components.controller.js'),
	'components/:component(/:tpl)': 'components'
};

// Routes mapping
var _routes = {
	'': 'home',
	'sites/:name(/:id)': 'sites',
	'modules/:module/:tpl': 'modules',
	'docs(/:id)' : 'docs',
	'fw' : 'fw',
	'components/:component(/:tpl)(/:pag)': 'components'

};


module.exports = {
	// Routes mapping
	routes: _routes,

	// Devuelve el controlador correspondiente a la acción del enrutado solicitada
	getViewCtlr: function(action) {
		console.log('Controller: ' + action);
		return controllers[action];
	}
};
