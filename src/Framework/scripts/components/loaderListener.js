/**
 * Created by dani on 14/09/15.
 */
'use strict';

var _ = require('lodash');

// Custom events
var Util   = require('util');
var EventEmitter = require('events').EventEmitter;

// Loader Listener Class  -----------------------------------------------------------------------
function LoaderListener (options) {

    // Emitter constructor
    EventEmitter.call(this);

    var _self = this;

    options = _.defaults(options || {}, {
        selectorContainer: '#status-loader div',
        classes: 'loader loader-1',
        content: 'loading',
        eventStart: null,
        eventFinish: null,
        selectorContext: document
    });

    function showLoader() {
        if (options.content) {
            jQuery(options.selectorContainer).after('<span class="loader-content">' + options.content + '</span>');
        }

        jQuery(options.selectorContainer).addClass(options.classes.replace('.', ''));

        _self.emit('loaderStart');
    }

    function hideLoader() {
        if (options.content) {
            jQuery(options.selectorContainer).parent().find('.loader-content').remove();
        }
        jQuery(options.selectorContainer).removeClass();

        _self.emit('loaderFinish');
    }

    if (options.eventStart === null || options.eventFinish === null) {

        jQuery(document).ajaxStart(function () {
            showLoader();
        });

        jQuery(document).ajaxComplete(function () {
            hideLoader();
        });
    }
    else{
        // Custom events
        jQuery(options.selectorContext).on(options.eventStart, function() {
            showLoader();
        });

        jQuery(options.selectorContext).on(options.eventFinish, function() {
            hideLoader();
        });
    }

}

Util.inherits(LoaderListener, EventEmitter);

// Ajax Listener Class - END  -----------------------------------------------------------------------

// Initializer  ----------
var initLoaderListener = function(options) {
    new LoaderListener(options);
};

// Exported Module Object  -----------------------------------------------------------------------
module.exports = {
    init: initLoaderListener,
};