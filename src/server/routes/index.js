'use strict';

var express = require('express');
var router 	= express.Router();


router.get('/', function(req, res) {
    res.render('client/index', {layout: false} );
});


module.exports = router;
