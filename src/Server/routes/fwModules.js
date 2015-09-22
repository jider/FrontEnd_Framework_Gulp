'use strict';


var router 	= require('express').Router();
var context = require('../config').context.docContext;


// Routing
// --------------------------------------------------
router.get('/messages', function(req, res) {
    context.docTemplate = "client/fwDoc/Documentation.twig";
    context.title = 'Messages Module';
    context.doc = {
        "title": "Messages Module",
        "intro_title": "Use",
        "intro_text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur cupiditate debitis, dicta enim eos, et explicabo fugiat iste magni molestiae praesentium quaerat quibusdam repellendus sint sit tempora tenetur veritatis?"
    };
    context.messages = {
        "default": [
            {"class":"msg"},
            {"class":"msg -valid"},
            {"class":"msg -error"},
            {"class":"msg -warning"},
            {"class":"msg -info"}
        ],
        "small": [
            {"class":"msg -small"},
            {"class":"msg -small -valid"},
            {"class":"msg -small -error"},
            {"class":"msg -small -warning"},
            {"class":"msg -small -info"}
        ],
        "large": [
            {"class":"msg -large"},
            {"class":"msg -large -valid"},
            {"class":"msg -large -error"},
            {"class":"msg-error"},
            {"class":"msg -large -warning"},
            {"class":"msg -large -info"}
        ],
        "xlarge": [
            {"class":"msg -xlarge"},
            {"class":"msg -xlarge -valid"},
            {"class":"msg -xlarge -error"},
            {"class":"msg -xlarge -warning"},
            {"class":"msg -xlarge -info"}
        ]
    };

    res.render('client/fwDoc/messages', context);
});


// Public router
// --------------------------------------------------
module.exports = router;
