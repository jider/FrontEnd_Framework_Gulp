'use strict';

var _messages  = require('./modules/messages');

// Modules mapping
var _modules = {
    "messages": _messages
};


// --------------------------------------------------------


// Modules loader
var loader = function() {
    for(var key in _modules) {
        loadModule(key);
    }
};

// Load a single module
var loadModule = function(moduleName) {
    if(moduleName !== undefined &&
       _modules.hasOwnProperty(moduleName) &&
       _modules[moduleName].hasOwnProperty('init') &&
       typeof _modules[moduleName].init === 'function') {

        _modules[moduleName].init();
    }
}


// --------------------------------------------------------


// Modules public methods
module.exports.loader = loader;
module.exports.loadModule = loadModule;

// Modules exposed
module.exports.messages = _messages;
