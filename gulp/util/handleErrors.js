// -----------------------------------------------------------------------------
// Error Handler
// -----------------------------------------------------------------------------

var notify = require("gulp-notify");


module.exports = function() {

	var args = Array.prototype.slice.call(arguments);

	// Enviamos el error al centro de notificaciones con gulp-notify
	notify.onError({
		title: "Compile Error",
		message: "<%= error %>"
	}).apply(this, args);

	// dejamos colgado a Gulp en esta tarea
	this.emit('end');
};