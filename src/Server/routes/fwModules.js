'use strict';


var router 	= require('express').Router();


// Routing
// --------------------------------------------------
router.get('/messages', function(req, res) {
    var context = require('../mocks/client/messages');

    res.render('client/fwDoc/messages', context);
});

router.get('/loaders', function(req, res) {
    context.docTemplate = "client/fwDoc/Documentation.twig";
    context.title = 'Loaders Module';
    context.doc = {
        "title": "Loaders Module",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?"
    };
    context.loaders = [
        {"classes": "-red", "number": 1},
        {"classes": "", "number": 2},
        {"classes": "", "number": 3},
        {"classes": "-red", "number": 4},
        {"classes": "", "number": 5},
        {"classes": "", "number": 6},
        {"classes": "-red", "number": 7},
        {"classes": "", "number": 8},

    ];

    res.render('client/fwDoc/loaders', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
