
'use strict';


var Cfg  = require('./config').server,
    Express = require('express'),
    Path 	= require('path'),
	Nunjucks = require('nunjucks');
/*
    Twig    = require('twig');
*/

var clientRouter = require('./routes/client');

var app = Express();


// Settings
// ------------------------------------
app.locals.port = process.env.PORT || 5000;
app.set('views', Path.join('public', 'views'));
app.set('view engine', 'twig');




// Deshabilitamos la cache de Twig
/*
Twig.cache(false);
*/

Nunjucks.configure(app.get('views'), {
	autoescape: true,
	express: app,
	noCache:true
});

// Static middleware
app.use(Express.static('public'));

// Routing
app.use(clientRouter);


// catch 404 and forward to error handler

app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('server/error', {
		message: err.message,
		error: err
	});
});


// Start server
var server = app.listen(app.locals.port, function() {
    // NO QUITAR!!!!
    // Este log fuerza el refresco del navegador cada vez que modificamos un fichero de core en el server
    // Conectado con la tarea de 'nodemon'
    console.log(Cfg.listenText);
});
