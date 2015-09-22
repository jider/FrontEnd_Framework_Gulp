'use strict';

var config  = require('./config').server,
    Express = require('express'),
    Path 	= require('path'),
    Nunjucks = require('nunjucks'),
    _ = require('lodash');

var clientRouter = require('./routes/client');
var fwCoreRouter = require('./routes/fwCore');
var fwModulesRouter = require('./routes/fwModules');

var App = Express();


// Settings
// ------------------------------------
App.locals.port = process.env.PORT || 5000;
App.set('views', Path.join('public', 'views'));

Nunjucks.configure(App.get('views'), {
    autoescape: true,
    noCache: true,
    express: App
});

App.set('view engine', 'twig');


// Routing
// ------------------------------------
// Static middleware
App.use(Express.static('public'));
_.map(config.staticMiddles, function(url) {
    App.use(url, Express.static('public'));
});


// Client routing
App.use(clientRouter);
// Framework Core Documentation routing
App.use(config.staticMiddles.docBaseUrl, fwCoreRouter);
// Framework Modules Documentation routing
App.use(config.staticMiddles.modulesBaseUrl, fwModulesRouter);


// catch 404 and forward to error handler
App.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
App.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('client/error', {
        masterTemplate: 'fw/frames/base.twig',
        message: err.message,
        error: err
    });
});


// Start server
// ------------------------------------
var server = App.listen(App.locals.port, function() {
    // NO QUITAR!!!!
    // Este log fuerza el refresco del navegador cada vez que modificamos un fichero de core en el server
    // Conectado con la tarea de 'nodemon'
    console.log(config.listenText);
});