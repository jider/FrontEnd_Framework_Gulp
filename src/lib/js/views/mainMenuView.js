var Backbone;

Backbone    = require('backbone');
Backbone.$  = require('jquery');


module.exports = function(context) {
	return Backbone.View.extend({
    	template: require('./tpls/mainMenu'),

    	initialize: function() {
			return this.render();
    	},

    	render: function() {
      		this.$el.html(this.template(context));
	    }
	});
};