'use strict';

// Requerimos las librerías que necesitamos que tengan acceso global
var _jquery = require('jquery');


// Requerimos los módulos que necesitamos que tengan acceso global
// Ej. var required_module_A = require('module_A');
var _modulesGlobal =  require('./modules');


/**
 * Main App protected object
 * Singleton
 *
 * Include current jQuery version
 */
(function() {

    // Necesitamos que jQuery funcione como una varible global y como una variable instanciable desde require
    if (typeof window.jQuery === 'undefined') {
        window.jQuery = _jquery;
    }

    // App constructor
    var _App = function() {
        // current jQuery alias
        this.jQuery = _jquery;

        // Especificamos los módulos que necesitamos que tengan acceso global
        // Ej. this.Module_A = required_module_A;
        this.modules = _modulesGlobal;
    };

    // Creamos el objeto de aplicación
    window.fwApp = window.fwApp || new _App();

    console.log('main.js Loaded!!');

})();