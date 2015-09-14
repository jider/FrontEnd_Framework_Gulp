/**
 * Created by dani on 14/09/15.
 */
'use strict';

var _ = require('lodash');

// Custom events
var Util   = require('util');
var EventEmitter = require('events').EventEmitter;

// Shared events
var Satelite = require('./satelite');


// Modal Class  -----------------------------------------------------------------------
function Modal () {

    var _self = this;
    // (Ejemplo) Evento compartido al que puede llamar cualquier otro módulo
    // fwApp.modules.satelite.emit('showModal')
    Satelite.on('showModal', function(options) {
        _self.show(options);
    });

    Satelite.on('closeModal', function() {
        _self.close();
    });
    // Emitter constructor
    EventEmitter.call(this);
}

Util.inherits(Modal, EventEmitter);

// Class methods  ----------

Modal.prototype.show = function (options) {

    options = _.defaults(options || {}, {
        classes: '-medium',
        content: '<h2>Modal</h2>',
        selectorContent: null
    });


    var _self = this,
        $body = jQuery('body'),
        prependContent,
        contentType;

    if (jQuery('#modal-overlay').length <= 0) {

        options.selectorContent ? contentType = jQuery(options.selectorContent).html() : contentType = options.content;

        prependContent ='<div id="modal-overlay"></div><div id="modal-container" class="'+ options.classes +'"><div id="modal-close-button"></div>'+ contentType +'</div>';

        $body.prepend(prependContent);

        jQuery('#modal-overlay, #modal-close-button').click(function () {
            _self.close();
        });
    }

    //console.log('showModal');
};

Modal.prototype.close = function () {
    var _self = this;

    jQuery('#modal-overlay, #modal-container').remove();

    //console.log('closeModal');
};
// Modal Class - END  -----------------------------------------------------------------------


// Module Public methods  -----------------------------------------------------------------------

// Initializer  ----------
var initModal = new Modal();


// Exported Module Object  -----------------------------------------------------------------------
module.exports = {
    init: initModal
};