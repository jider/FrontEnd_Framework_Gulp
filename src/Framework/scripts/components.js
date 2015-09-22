/**
 * Created by dani on 14/09/15.
 */
'use strict';

var _loaderListener = require('./components/loaderListener');

// Modules mapping
var _components = {
    "loaderListener": _loaderListener
};


// --------------------------------------------------------


// Components loader
var loader = function() {
    for(var key in _components) {
        loadComponent(key);
    }
};

// Load a single component
var loadComponent = function(componentName) {
    if(componentName !== undefined &&
        _components.hasOwnProperty(componentName) &&
        _components[componentName].hasOwnProperty('init') &&
        typeof _components[componentName].init === 'function') {

        _components[componentName].init();
    }
}


// --------------------------------------------------------


// Components public methods
module.exports.loader = loader;
module.exports.loadComponent = loadComponent;

/*// Components exposed
module.exports.loaderListener = _loaderListener;*/

