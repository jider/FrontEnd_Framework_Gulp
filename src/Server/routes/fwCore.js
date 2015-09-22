'use strict';


var router 	= require('express').Router();
var context = require('../config').context.docContext;


// Routing
// --------------------------------------------------
router.get('/color', function(req, res) {
    context.docTemplate = "client/fwDoc/Documentation.twig";
    context.title = 'Color palettes';
    context.doc = {
        "title": "Color palettes",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?"
    };

    res.render('client/fwDoc/color_palettes', context);
});

router.get('/layouts', function(req, res) {
    context.docTemplate = "client/fwDoc/Documentation.twig";
    context.title = 'Page Layouts';
    context.doc = {
        "title": "Page Layouts",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?"
    };

    res.render('client/fwDoc/layouts', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
