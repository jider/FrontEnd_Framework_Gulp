/**
 * Created by dani on 17/08/15.
 */
'use strict';

var _pagination = require('./components/pagination'),
    _loaderlistener = require('./components/loader-listener');


// Modules mapping
var _components = {
    "pagination": _pagination,
    "loaderlistener": _loaderlistener
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

// Components exposed
var _exportComponents = function(){
    for(var key in _components) {
        module.exports[key] = _components[key];
    }
}();

