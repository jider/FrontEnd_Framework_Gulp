'use strict';

// Main menu
// --------------------------------------------------
var menu = [
    {
        'title': 'sites',
        'items': [
            {'href': '/', 'ico': 'ico-tl5', 'title': 'Telecinco'},
            {'href': '/', 'ico': 'ico-cuatro', 'title': 'Cuatro'},
            {'href': '/', 'ico': 'ico-div', 'title': 'Divinity'},

        ]
    },
    {
        'title': 'modules/components',
        'items': [
            {'href': '/module/messages', 'ico': 'ico-div', 'title': 'Messages'},
            {'href': '/module/loaders', 'ico': 'ico-div', 'title': 'Loaders'},
        ]
    },
    {
        'title': 'Documentation',
        'items': [
            {'href': '/doc/color', 'ico': 'ico-tl5', 'title': 'Colors'},
            {'href': '/doc/layouts', 'ico': 'ico-cuatro', 'title': 'Layouts'},
        ]
    }
];


module.exports.server = {
    "listenText": "--- Server Started ---",

    "staticMiddles": {
        "docBaseUrl": "/doc",
        "modulesBaseUrl": "/module"
    }
};

module.exports.context = {
    "clientContext": {
        "context" : {
            "metas": [
                {
                    "name": "description",
                    "content": "Front-end Framework Client APP - Home page"
                },
                {
                    "name": "keywords",
                    "content": "Front-end Framework Client APP"
                }
            ],
            "css": [
                "css/vendor/font-awesome.min.css",
                "http://fonts.googleapis.com/css?family=Raleway:100,700,800",
                "css/client.css"
            ],
            "js": [
                "js/commons.js",
                "js/main.js"
            ],
            "initjs": [
                "js/inits.js",
                "js/client.js"
            ],
            "menu": menu
        }
    },

    "docContext": {
        "metas": [
            {
                "name": "description",
                "content": "Front-end Framework Documentation Page"
            },
            {
                "name": "keywords",
                "content": "Front-end Framework Documentation"
            }
        ],
        "css": [
            "css/vendor/font-awesome.min.css",
            "http://fonts.googleapis.com/css?family=Raleway:100,700,800",
            "https://fonts.googleapis.com/css?family=Roboto:400,100,300,500,700",
            "css/client.css"
        ],
        "js": [
            "js/commons.js",
            "js/main.js"
        ],
        "initjs": [
            "js/inits.js",
            "js/client.js"
        ],
        "menu": menu,
        "docTemplate": "client/fwDoc/documentation.twig"
    }
};
