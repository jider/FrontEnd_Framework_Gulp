'use strict';

var jquery = require('jquery');

var url = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/highlight.min.js';


// Class constructor  -----------------------------------------------------------------------
function Code_highlight() {
    var _showText = 'show code',
        _hideText = 'hide code';


    // jquery Events
    // ------------------------------
    jquery('.code-trigger').on('click', function() {
        var _$self = jquery(this),
            _$title = _$self.children('.title'),
            _$parent = _$self.parent('.code');

        _$parent.hasClass('active') ? _$title.html(_showText) : _$title.html(_hideText);
        _$parent.toggleClass('active');
    });
}

// Class methods  --------------------
Code_highlight.prototype.init = function() {
    jquery.getScript(url, function() {
        jquery('.code-content').each(function(i, block) {
            var _codestr = jquery(block).html();

            hljs.fixMarkup(_codestr);
            hljs.highlightBlock(block);
        });
    });
};
// Class constructor - END  -----------------------------------------------------------------------



// Exported Module Object  -----------------------------------------------------------------------
module.exports = new Code_highlight();