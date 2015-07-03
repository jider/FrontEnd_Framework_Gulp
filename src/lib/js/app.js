'use strict';

var modA = require('./modA.js');
var modB = require('./modB.js');

var jQuery = require('jquery');

console.log('App Loaded -->');
console.log(modA);
console.log(modB);
console.log('<-- App Loaded');

jQuery('body').append('<p>Loaded by jQuery!!!</p>');

