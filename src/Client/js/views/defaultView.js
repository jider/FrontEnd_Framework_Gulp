var Backbone;

Backbone    = require('backbone');
Backbone.$  = require('jquery');


module.exports = {
	init: function(model, tpl, cb, args) {
		args = args || {};

		return Backbone.View.extend({
    		template: tpl,

		    initialize: function() {
		      	return this.render();
		    },

		    render: function() {
		    	this.$el.html(this.template(model));

		    	// Si se ha informado un callback lo ejecutamos
		    	if (cb) cb.apply(this, args);
		    }
		});
	},

	defaultParams: {
		el: '#mainContent'
    }
};