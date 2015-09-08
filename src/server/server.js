'use strict';

var config  = require('./config').server,
    express = require('express'),
    path 	= require('path'),
    /*Twig    = require('twig');*/
    exphbs 	= require('express-handlebars');

var clientRouter = require('./routes/client'),
    fwRouter	 = require('./routes/framework');

var app = express();


// Settings
// ------------------------------------
app.locals.port = process.env.PORT || 5000;
app.set('views', path.join('public', 'views'));
/*app.set('view engine', 'twig');*/

// Handlebars
var hbs = exphbs.create({
    layoutsDir: path.join(app.get('views'), 'fw', 'frames'),
	partialsDir: [
        path.join(app.get('views'), 'fw', 'templates')
	],
    defaultLayout: 'index',
	extname: '.hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// Routing
app.use(clientRouter);
app.use(fwRouter);


// Static middleware
app.use(express.static('public'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('fw/pages/error', {
		message: err.message,
		error: err
	});
});


// Start server
var server = app.listen(app.locals.port, function() {
    // NO QUITAR!!!!
    // Este log fuerza el refresco del navegador cada vez que modificamos un fichero de core en el server
    // Conectado con la tarea de 'nodemon'
    console.log(config.listenText);
});