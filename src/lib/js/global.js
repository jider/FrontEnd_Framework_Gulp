// Browserify entry point for the global.js bundle (yay JavaScript!)

'use strict';


var _header = require('./_main_header');
var context = {
  header: _header,
  description: 'Starter Gulp + Browserify project to demonstrate some common tasks:',
  tools: [
    'CommonJS bundling and watching',
    'Working with multiple bundles',
    'Factoring out shared dependencies',
    'Live reloading across devices',
    'JS transforms and compiling',
    'CSS preprocessing: node-sass (Lightning fast libsass!)',
    'Iconfont generation',
    'Image optimization',
    'Non common-js plugins with common-js dependencies',
    'Using modules already bundled with other modules',
  ]
};

var View = require('./view')(context);
var view = new View({
	el: '#content'
});

console.log('global.js loaded!!');