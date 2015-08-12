'use strict';

var _messages        = require('./messages');
var _messages_small  = require('./messages-small');
var _messages_large  = require('./messages-large');
var _messages_xlarge = require('./messages-xlarge');


module.exports = {
    tpls: {
        messages: _messages,
        messages_small: _messages_small,
        messages_large: _messages_large,
        messages_xlarge: _messages_xlarge
    },

    initializer: function() {
        fwApp.modules.loadModule('messages');
    }
};