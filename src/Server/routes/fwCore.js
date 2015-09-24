'use strict';


var router 	= require('express').Router();


// Routing
// --------------------------------------------------
router.get('/color', function(req, res) {
    var context = require('../mocks/client/color_palette');

    res.render('client/fwDoc/color_palettes', context);
});

router.get('/layouts', function(req, res) {
    var context = require('../mocks/client/layouts');

    res.render('client/fwDoc/layouts', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
