'use strict';

var express = require('express');
var router 	= express.Router();


router.get('/', function(req, res) {
    res.render('home');
});

router.get('/site/:site', function(req, res) {
    res.render('test', {'data': req.params.site});
});


module.exports = router;
