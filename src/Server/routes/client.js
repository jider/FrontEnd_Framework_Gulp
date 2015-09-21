'use strict';

var express = require('express'),
    router 	= express.Router();

var data = {
    'description': [
        'this page description'
    ],
    'data': {
        'css': [
            'css/vendor/font-awesome.min.css',
            'http://fonts.googleapis.com/css?family=Raleway:100,700,800',
            'css/style.css',
            'css/fw_style.css',
            'css/client.css'
        ],
        'js': [
            'js/commons.js',
            'js/main.js'
        ],
        'initjs': [
            'js/inits.js',
            'js/client.js'
        ]
    },
    'menu':[
        {
        'title':'sites',
        'items':[

                {'href':'/','ico':'ico-tl5','title':'Telecinco'},
                {'href':'#','ico':'ico-cuatro','title':'Cuatro'},
                {'href':'#','ico':'ico-div','title':'Divinity'},

            ]
        },
        {
            'title':'modules/components',
            'items':[

                {'href':'/','ico':'ico-tl5','title':'Telecinco'},
                {'href':'#','ico':'ico-cuatro','title':'Cuatro'},
                {'href':'#','ico':'ico-div','title':'Divinity'},

            ]
        },
        {
            'title':'Documentation',
            'items':[

                {'href':'/color','ico':'ico-tl5','title':'Colors'},
                {'href':'/layouts','ico':'ico-cuatro','title':'Layouts'},
                {'href':'/messages','ico':'ico-div','title':'Messages'},

            ]
        }
    ]
};


// Routing
// --------------------------------------------------
router.get('/', function(req, res) {
    data.title = 'Client Home';

    res.render('client/index', data);
});


router.get('/color', function(req, res) {
    data.title = 'Color palettes';

    res.render('client/fwDoc/color_palettes', data);
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

    res.render('client/fwDoc/messages', data);
});

router.get('/layouts', function(req, res) {
    data.title = 'Page Layouts';

    res.render('client/fwDoc/layouts', data);
});

router.get('/lists', function(req, res) {
    data.title = 'Lists';

    res.render('client/fwDoc/lists', data);
});

router.get('/patterns', function(req, res) {
    data.title = 'Patterns';

    res.render('client/fwDoc/patterns', data);
});

router.get('/imager', function(req, res) {

    data.title = 'Imager';

    data.width = 'prueba';
    res.render('client/fwDoc/imager', data);
});

router.get('/loaders', function(req, res) {
    data.title = 'Loaders';

    data.loaders =[

        {'number':1},
        {'classes':'-red','number':2},
        {'classes':'-red','number':3},
        {'number':4},
        {'number':5},
        {'number':6},
        {'classes':'-red','number':7},
        {'classes':'-red','number':8},

    ];

    res.render('client/fwDoc/loaders', data);
});


// Public router
// --------------------------------------------------
module.exports = router;
