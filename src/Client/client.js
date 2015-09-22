'use strict';


(function() {
    var mainContent = jQuery('#mainContent'),
        morphMenu = jQuery('.morphmenu'),
        trigger = morphMenu.children('.morphmenu-trigger'),
        isOpen = false;

    // Show/Hide main menu
    var toggleSearch = function(e) {
        mainContent.toggleClass('st--hidden');
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
    } );

    console.log('App.js Loaded!!');
})();

