'use strict';

var router 	= require('express').Router();
var context = require('../config').context.clientContext;

// Routing
// --------------------------------------------------
router.get('/', function(req, res) {
    context.title = 'Client Home';

    res.render('client/index', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
