/**
 * Created by dani on 17/08/15.
 */
'use strict';

var _loaders = require('./loaders');


var _init = function() {

    fwApp.components.loadComponent('loaderlistener');

    jQuery( ".trigger" ).click(function() {
        jQuery(this).load('http://otherdomain.com/somePage.html');
    });


};

module.exports = {

    "tpls": {
        loaders: _loaders,
    },

    "initializer": function(opt) {
        _init();
    }

}
