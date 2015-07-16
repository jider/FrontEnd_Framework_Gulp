// Recuperamos o creamos un objeto de espacio de nombres
var App = window.App || {};


// Especificamos los módulos que necesitamos que tengan acceso global
// Ej. App.Module_A = require('module_A');


// Necesitamos que jQuery funcione como una varible global y como una varuiable instanciable desde require
window.jQuery  = require('jquery');


// Reemplazamos o creamos el espacio de nombres global
window.App = App;