'use strict';

var Util   = require('util');
var EventEmitter = require('events').EventEmitter;

// Constructor
function _satelite() {
    EventEmitter.call(this);
};

Util.inherits(_satelite, EventEmitter);


module.exports = new _satelite();