var _, foundation, Backbone;

_           = require('underscore');
foundation  = require('foundation');
Backbone    = require('backbone');
Backbone.$  = require('jquery');


module.exports = function(context) {
  return Backbone.View.extend({
    template: require('./template'),

    initialize: function() {
      return this.render();
    },

    render: function() {
      this.$el.html(this.template(context));
      jQuery(document).foundation();
    }
})};