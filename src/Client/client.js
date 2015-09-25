'use strict';

// Client modules
// --------------------------------------------------
var code_highlight = require('./scripts/modules/code_highlight');



// Initialization on DOM Ready
// --------------------------------------------------
(function() {
    var mainContent = jQuery('#mainContent'),
        morphMenu = jQuery('.mainmenu'),
        trigger = morphMenu.children('.mainmenu-trigger'),
        isOpen = false;

    // Show/Hide main menu
    var toggleSearch = function(e) {
        setTimeout(function() {
            mainContent.toggleClass('st--hidden');
        }, isOpen ? 0 : 500);

        morphMenu.toggleClass('open');
        isOpen = !isOpen;
    };

    // Events
    // --------------------------------------------------
    // Show/Hide main menu on trigger 'click'
    trigger.on('click', toggleSearch);

    // keyboard navigation events
    // 'Esc' key closes menu
    jQuery(document).on('keydown', function(e) {
        var keyCode = e.keyCode || e.which;
        if( keyCode === 27 && isOpen ) {
            toggleSearch(e);
        }
    });


    // Initialize code highlighting module
    code_highlight.init();


    console.log('client.js Loaded!!');
})();

