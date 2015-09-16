'use strict';

var jquery = require('jquery');

// Custom events
var Util   = require('util');
var EventEmitter = require('events').EventEmitter;

// Shared events
var Satelite = require('./satelite');

var myNS = 'MSG-';
var cssClassObj = '.msg, [class^="msg-"]';

// Lista de mensajes disponibles
var msgList = [];


// Message Class  -----------------------------------------------------------------------
function Message (el) {
    var _self = this;
    this.$el = jQuery(el);

    // Unique message ID
    this.id = myNS + Math.random().toString().slice(10);
    this.$el.attr('id', this.id);

    // jquery Events
    this.$el.click(function() {
        _self.close();
    });

    // Custom events
    this.on(myNS + 'close', function() {
        console.log('Message closed!!! - Total messages: ' + msgList.length);
    });

    this.on(myNS + 'show', function() {
        console.log('Message created!!! - Total messages: ' + msgList.length);
    });

    this.on(myNS + 'updateList', function(message) {
        msgList.splice(msgList.indexOf(message), 1);
    });

    this.on(myNS + 'msg-fixed', function() {
       setTimeout(function() {
           _self.close();
       }, 3000);
    });

    // (Ejemplo) Evento compartido al que puede llamar cualquier otro módulo
    // fwApp.modules.satelite.emit({message.id})
    Satelite.on(this.id, function() {
        console.log('My name is: ' + _self.id);
    });

    // Incluimos el mensaje en la lista de mensajes
    msgList.push(this);

    // Emitter constructor
    EventEmitter.call(this);
}
Util.inherits(Message, EventEmitter);

// Class methods  ----------
Message.prototype.close = function() {
    var _self = this;

    _self.$el.fadeOut('slow', function() {
        _self.$el.off();
        _self.$el.remove();

        // Actualizamos la lista de mensajes
        _self.emit(myNS + 'updateList');
        _self.emit(myNS + 'close');
        // (Ejemplo) Este evento se puede definir accediendo al objeto message desde el cliente utilizando 'msgList'
        // fwApp.modules.messages.list[0].on('{NS + custom}', function() { ... })
        _self.emit(myNS + 'custom');
    });
};
// Message Class - END  -----------------------------------------------------------------------


// Module Private methods  -----------------------------------------------------------------------
var _createMessage = function(classes, text, type) {
    type = type || 'msg';

    classes = classes ? type + ' ' + classes : type;
    var $msg = jquery('<p class="' + classes + '">' + text + '</p>');
    var msgObj = new Message($msg[0]);

    jquery('#mainContent').append($msg);

    // Provoca los eventos asociados al tipo de mensaje
    msgObj.emit(myNS + type);

    // Mensaje creado
    msgObj.emit(myNS + 'show');
};


// Module Public methods  -----------------------------------------------------------------------

// Initializer  ----------
var initMessages = function() {
    jquery(cssClassObj).each(function(index, el) {
        new Message(el);
    });
};

// Create a new message  ----------
var showMessage = function(classes, text) {
    _createMessage(classes, text);
};

// Create a new fixed message  ----------
var showFixedMessage = function(classes, text) {
    _createMessage(classes, text, "msg-fixed");
};


// Exported Module Object  -----------------------------------------------------------------------
module.exports = {
    NS: myNS,
    init: initMessages,
    show: showMessage,
    showFixed: showFixedMessage,
    list: msgList
};