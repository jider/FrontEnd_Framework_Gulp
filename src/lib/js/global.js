// Browserify entry point for the global.js bundle (yay JavaScript!)

'use strict';

var View = require('./view');
var view = new View({
	el: '#content'
});

console.log('global.js loaded!!');