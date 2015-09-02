'use strict';

var express = require('express');
var path 	= require('path');
var exphbs 	= require('express-handlebars');

var routes 	= require('./routes/index');

var app 	= express();


// Settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname + '/views'));


// View engine setup
var hbs = exphbs.create({
	defaultLayout: 'main'
	/*
	layoutsDir: app.get('views') + '/layouts',
	partialsDir: [
		'shared/templates',
		'views/partials'
	]
	*/
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


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
app.use(routes);

// Static middleware
app.use(express.static(path.join(__dirname, "/public")));

/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: err
	});
});
*/


// Start server
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;

	console.log('App listen at http://localhost:%s', port);
});
