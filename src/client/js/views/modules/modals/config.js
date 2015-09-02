/**
 * Created by dani on 20/08/15.
 */

'use strict';

var _modals        = require('./modals');

module.exports = {

    tpls: {
        modals: _modals
    },

    initializer: function() {
        fwApp.modules.loadModule('modals');

        jQuery('#show-modal').click(function(){
            fwApp.modules.satelite.emit('showModal',{'classes':'small-8'});
        });
    }
};
