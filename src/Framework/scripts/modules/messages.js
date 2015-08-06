'use strict';


var messages = function(el) {

	var $el = jQuery(el);

	var _close = function() {
		$el.fadeOut('slow', function() {
			$el.off('click');
			$el.remove();
		});
	};


	// ------------------------------------

	$el.click(_close);

};


module.exports = messages;