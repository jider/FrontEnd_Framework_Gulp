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
    data.messages = {
        'default': [
            {'class':'msg', 'text': 'Simple message'},
            {'class':'msg -valid', 'text': 'OK message'},
            {'class':'msg -error', 'text': 'Error message'},
            {'class':'msg -warning', 'text': 'Warning message'},
            {'class':'msg -info', 'text': 'Info message'},
        ],
        'small': [
            {'class':'msg -small', 'text': 'Simple message'},
            {'class':'msg -small -valid', 'text': 'OK message'},
            {'class':'msg -small -error', 'text': 'Error message'},
            {'class':'msg -small -warning', 'text': 'Warning message'},
            {'class':'msg -small -info', 'text': 'Info message'},
        ],
        'large': [
            {'class':'msg -large', 'text': 'Simple message'},
            {'class':'msg -large -valid', 'text': 'OK message'},
            {'class':'msg -large -error', 'text': 'Error message'},
            {'class':'msg -large -warning', 'text': 'Warning message'},
            {'class':'msg -large -info', 'text': 'Info message'},
        ],
        'xlarge': [
            {'class':'msg -xlarge', 'text': 'Simple message'},
            {'class':'msg -xlarge -valid', 'text': 'OK message'},
            {'class':'msg -xlarge -error', 'text': 'Error message'},
            {'class':'msg -xlarge -warning', 'text': 'Warning message'},
            {'class':'msg -xlarge -info', 'text': 'Info message'},
        ]
    };

    res.render('fw/pages/messages', data);
});

router.get('/layouts', function(req, res) {
    data.title = 'Web Layouts';

    res.render('fw/pages/layouts', data);
});


module.exports = router;
