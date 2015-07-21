var foundation, Backbone;

foundation  = require('foundation');
Backbone    = require('backbone');
Backbone.$  = require('jquery');


module.exports = function(context) {
  return Backbone.View.extend({
    template: require('./tpls/sites'),

    initialize: function() {
      return this.render();
    },

    render: function() {
      this.$el.html(this.template(context));
      jQuery(document).foundation();
    }
})};