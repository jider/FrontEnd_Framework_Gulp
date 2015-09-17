'use strict';

var Imager   = require('imager.js'),
    _= require('lodash') ;

function init (options){

    options = _.defaults(options || {}, {
        availableWidths: {
            150: 't_d',
            500: 'd',
            640: 'z_d'
        }
    });

    new Imager(options);
}

module.exports = {
    init:init
}