'use strict';


var router 	= require('express').Router();


// Routing
// --------------------------------------------------
router.get('/messages', function(req, res) {
    var context = require('../mocks/client/messages');

    res.render('client/fwDoc/messages', context);
});

router.get('/loaders', function(req, res) {
   var context = require('../mocks/client/loaders');

    res.render('client/fwDoc/loaders', context);
});

router.get('/carousel', function(req, res) {
    context.docTemplate = "client/fwDoc/Documentation.twig";
    context.title = 'Carousel Module';
    context.doc = {
        "title": "Carousel Module",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?"
    };

    res.render('client/fwDoc/carousel', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
