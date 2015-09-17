'use strict';


/**
 * ---------------------------------------------------------------
 * Modules initialization
 * ---------------------------------------------------------------
 */

fwApp.jQuery(function() {
    fwApp.modules.loader();
    fwApp.components.loader();
});


/**
 * ---------------------------------------------------------------
 * On Document Ready Init Stuff
 * ---------------------------------------------------------------
 */

fwApp.jQuery(function($){
    // ...
});


/**
 * ---------------------------------------------------------------
 * Straight Init Stuff
 * ---------------------------------------------------------------
 */

console.log('inits.js Loaded!!');

//provisional for use without require in a module.
var _imagemanipulator = require('./modules/imagermanipulator').init();