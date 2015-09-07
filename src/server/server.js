'use strict';

var express = require('express'),
    path 	= require('path'),
    exphbs 	= require('express-handlebars');
/*var Twig    = require('twig');*/

var clientRouter = require('./routes/client'),
    fwRouter	 = require('./routes/framework');

var app 	     = express();


// Settings
// ------------------------------------
app.locals.port = process.env.PORT || 5000;
app.set('views', path.join('public', 'views'));


// View engine setup
// ------------------------------------

// Twig
/*app.set('twig options', {
    strict_variables: false
});*/

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


/*
// Middleware to expose the app's shared templates to the cliet-side of the app for pages which need them.
function exposeTemplates(req, res, next) {
	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
	// templates which will be shared with the client-side of the app.
	hbs.getTemplates('shared/templates/', {
		cache      : app.enabled('view cache'),
		precompiled: true
	}).then(function (templates) {
		// RegExp to remove the ".handlebars" extension from the template names.
		var extRegex = new RegExp(hbs.extname + '$');

		// Creates an array of templates which are exposed via
		// `res.locals.templates`.
		templates = Object.keys(templates).map(function (name) {
			return {
				name    : name.replace(extRegex, ''),
				template: templates[name]
			};
		});

		// Exposes the templates during view rendering.
		if (templates.length) {
			res.locals.templates = templates;
		}

		setImmediate(next);
	})
	.catch(next);
};
*/

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
	var port = server.address().port;

	console.log('App listen at http://localhost:%s', port);
});