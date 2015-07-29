'use strict';

// Recuperamos o creamos un objeto de espacio de nombres
var _fwApp = window.fwApp || {};

// Necesitamos que jQuery funcione como una varible global y como una variable instanciable desde require
window.jQuery  = require('jquery');


// Especificamos los módulos que necesitamos que tengan acceso global
// Ej. _fwApp.Module_A = require('module_A');


// Reemplazamos o creamos el espacio de nombres global
window.fwApp = _fwApp;

console.log('commons.js Loaded!!');	