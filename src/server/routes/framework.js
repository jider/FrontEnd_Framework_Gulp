'use strict';

var express = require('express');
var router 	= express.Router();

var data = {
    'description': [
        'this page description'
    ],
    'data': {
        'css': [
            'css/app.css',
            'css/style.css',
            'css/fw_style.css'
        ],
        'js': [
            'js/commons.js',
            'js/main.js'
        ],
        'initjs': [
            'js/inits.js'
        ]
    }
};

router.get('/color', function(req, res) {
    data.title = 'Color palettes';

    res.render('fw/pages/color_palettes', data);
});

router.get('/messages', function(req, res) {
    data.title = 'Messages Module';

    res.render('fw/pages/messages', data);
});

router.get('/layouts', function(req, res) {
    data.title = 'Web Layouts';

    res.render('fw/pages/layouts', data);
});


module.exports = router;
