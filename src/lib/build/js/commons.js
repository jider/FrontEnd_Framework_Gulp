require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Recuperamos o creamos un objeto de espacio de nombres
var App = window.App || {};


// Especificamos los módulos que necesitamos que tengan acceso global
// Ej. App.Module_A = require('module_A');


// Necesitamos que jQuery funcione como una varible global y como una varuiable instanciable desde require
window.jQuery  = require('jquery');


// Reemplazamos o creamos el espacio de nombres global
window.App = App;
},{"jquery":"jquery"}],"foundation":[function(require,module,exports){
/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function ($, window, document, undefined) {
  'use strict';

  var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = $('head');

    while (i--) {
      if (head.has('.' + class_array[i]).length === 0) {
        head.append('<meta class="' + class_array[i] + '" />');
      }
    }
  };

  header_helpers([
    'foundation-mq-small',
    'foundation-mq-small-only',
    'foundation-mq-medium',
    'foundation-mq-medium-only',
    'foundation-mq-large',
    'foundation-mq-large-only',
    'foundation-mq-xlarge',
    'foundation-mq-xlarge-only',
    'foundation-mq-xxlarge',
    'foundation-data-attribute-namespace']);

  // Enable FastClick if present

  $(function () {
    if (typeof FastClick !== 'undefined') {
      // Don't attach to body if undefined
      if (typeof document.body !== 'undefined') {
        FastClick.attach(document.body);
      }
    }
  });

  // private Fast Selector wrapper,
  // returns jQuery object. Only use where
  // getElementById is not available.
  var S = function (selector, context) {
    if (typeof selector === 'string') {
      if (context) {
        var cont;
        if (context.jquery) {
          cont = context[0];
          if (!cont) {
            return context;
          }
        } else {
          cont = context;
        }
        return $(cont.querySelectorAll(selector));
      }

      return $(document.querySelectorAll(selector));
    }

    return $(selector, context);
  };

  // Namespace functions.

  var attr_name = function (init) {
    var arr = [];
    if (!init) {
      arr.push('data');
    }
    if (this.namespace.length > 0) {
      arr.push(this.namespace);
    }
    arr.push(this.name);

    return arr.join('-');
  };

  var add_namespace = function (str) {
    var parts = str.split('-'),
        i = parts.length,
        arr = [];

    while (i--) {
      if (i !== 0) {
        arr.push(parts[i]);
      } else {
        if (this.namespace.length > 0) {
          arr.push(this.namespace, parts[i]);
        } else {
          arr.push(parts[i]);
        }
      }
    }

    return arr.reverse().join('-');
  };

  // Event binding and data-options updating.

  var bindings = function (method, options) {
    var self = this,
        bind = function(){
          var $this = S(this),
              should_bind_events = !$this.data(self.attr_name(true) + '-init');
          $this.data(self.attr_name(true) + '-init', $.extend({}, self.settings, (options || method), self.data_options($this)));

          if (should_bind_events) {
            self.events(this);
          }
        };

    if (S(this.scope).is('[' + this.attr_name() +']')) {
      bind.call(this.scope);
    } else {
      S('[' + this.attr_name() +']', this.scope).each(bind);
    }
    // # Patch to fix #5043 to move this *after* the if/else clause in order for Backbone and similar frameworks to have improved control over event binding and data-options updating.
    if (typeof method === 'string') {
      return this[method].call(this, options);
    }

  };

  var single_image_loaded = function (image, callback) {
    function loaded () {
      callback(image[0]);
    }

    function bindLoad () {
      this.one('load', loaded);

      if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
        var src = this.attr( 'src' ),
            param = src.match( /\?/ ) ? '&' : '?';

        param += 'random=' + (new Date()).getTime();
        this.attr('src', src + param);
      }
    }

    if (!image.attr('src')) {
      loaded();
      return;
    }

    if (image[0].complete || image[0].readyState === 4) {
      loaded();
    } else {
      bindLoad.call(image);
    }
  };

  /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

  window.matchMedia || (window.matchMedia = function() {
      "use strict";

      // For browsers that support matchMedium api such as IE 9 and webkit
      var styleMedia = (window.styleMedia || window.media);

      // For those that don't support matchMedium
      if (!styleMedia) {
          var style       = document.createElement('style'),
              script      = document.getElementsByTagName('script')[0],
              info        = null;

          style.type  = 'text/css';
          style.id    = 'matchmediajs-test';

          script.parentNode.insertBefore(style, script);

          // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
          info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

          styleMedia = {
              matchMedium: function(media) {
                  var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                  // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                  if (style.styleSheet) {
                      style.styleSheet.cssText = text;
                  } else {
                      style.textContent = text;
                  }

                  // Test if media query is true or false
                  return info.width === '1px';
              }
          };
      }

      return function(media) {
          return {
              matches: styleMedia.matchMedium(media || 'all'),
              media: media || 'all'
          };
      };
  }());

  /*
   * jquery.requestAnimationFrame
   * https://github.com/gnarf37/jquery-requestAnimationFrame
   * Requires jQuery 1.8+
   *
   * Copyright (c) 2012 Corey Frang
   * Licensed under the MIT license.
   */

  (function(jQuery) {


  // requestAnimationFrame polyfill adapted from Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  var animating,
      lastTime = 0,
      vendors = ['webkit', 'moz'],
      requestAnimationFrame = window.requestAnimationFrame,
      cancelAnimationFrame = window.cancelAnimationFrame,
      jqueryFxAvailable = 'undefined' !== typeof jQuery.fx;

  for (; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
    requestAnimationFrame = window[ vendors[lastTime] + 'RequestAnimationFrame' ];
    cancelAnimationFrame = cancelAnimationFrame ||
      window[ vendors[lastTime] + 'CancelAnimationFrame' ] ||
      window[ vendors[lastTime] + 'CancelRequestAnimationFrame' ];
  }

  function raf() {
    if (animating) {
      requestAnimationFrame(raf);

      if (jqueryFxAvailable) {
        jQuery.fx.tick();
      }
    }
  }

  if (requestAnimationFrame) {
    // use rAF
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    if (jqueryFxAvailable) {
      jQuery.fx.timer = function (timer) {
        if (timer() && jQuery.timers.push(timer) && !animating) {
          animating = true;
          raf();
        }
      };

      jQuery.fx.stop = function () {
        animating = false;
      };
    }
  } else {
    // polyfill
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
        id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };

  }

  }( $ ));

  function removeQuotes (string) {
    if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, '');
    }

    return string;
  }

  window.Foundation = {
    name : 'Foundation',

    version : '5.5.2',

    media_queries : {
      'small'       : S('.foundation-mq-small').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'small-only'  : S('.foundation-mq-small-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium'      : S('.foundation-mq-medium').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'medium-only' : S('.foundation-mq-medium-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large'       : S('.foundation-mq-large').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'large-only'  : S('.foundation-mq-large-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge'      : S('.foundation-mq-xlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xlarge-only' : S('.foundation-mq-xlarge-only').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
      'xxlarge'     : S('.foundation-mq-xxlarge').css('font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
    },

    stylesheet : $('<style></style>').appendTo('head')[0].sheet,

    global : {
      namespace : undefined
    },

    init : function (scope, libraries, method, options, response) {
      var args = [scope, method, options, response],
          responses = [];

      // check RTL
      this.rtl = /rtl/i.test(S('html').attr('dir'));

      // set foundation global scope
      this.scope = scope || this.scope;

      this.set_namespace();

      if (libraries && typeof libraries === 'string' && !/reflow/i.test(libraries)) {
        if (this.libs.hasOwnProperty(libraries)) {
          responses.push(this.init_lib(libraries, args));
        }
      } else {
        for (var lib in this.libs) {
          responses.push(this.init_lib(lib, libraries));
        }
      }

      S(window).load(function () {
        S(window)
          .trigger('resize.fndtn.clearing')
          .trigger('resize.fndtn.dropdown')
          .trigger('resize.fndtn.equalizer')
          .trigger('resize.fndtn.interchange')
          .trigger('resize.fndtn.joyride')
          .trigger('resize.fndtn.magellan')
          .trigger('resize.fndtn.topbar')
          .trigger('resize.fndtn.slider');
      });

      return scope;
    },

    init_lib : function (lib, args) {
      if (this.libs.hasOwnProperty(lib)) {
        this.patch(this.libs[lib]);

        if (args && args.hasOwnProperty(lib)) {
            if (typeof this.libs[lib].settings !== 'undefined') {
              $.extend(true, this.libs[lib].settings, args[lib]);
            } else if (typeof this.libs[lib].defaults !== 'undefined') {
              $.extend(true, this.libs[lib].defaults, args[lib]);
            }
          return this.libs[lib].init.apply(this.libs[lib], [this.scope, args[lib]]);
        }

        args = args instanceof Array ? args : new Array(args);
        return this.libs[lib].init.apply(this.libs[lib], args);
      }

      return function () {};
    },

    patch : function (lib) {
      lib.scope = this.scope;
      lib.namespace = this.global.namespace;
      lib.rtl = this.rtl;
      lib['data_options'] = this.utils.data_options;
      lib['attr_name'] = attr_name;
      lib['add_namespace'] = add_namespace;
      lib['bindings'] = bindings;
      lib['S'] = this.utils.S;
    },

    inherit : function (scope, methods) {
      var methods_arr = methods.split(' '),
          i = methods_arr.length;

      while (i--) {
        if (this.utils.hasOwnProperty(methods_arr[i])) {
          scope[methods_arr[i]] = this.utils[methods_arr[i]];
        }
      }
    },

    set_namespace : function () {

      // Description:
      //    Don't bother reading the namespace out of the meta tag
      //    if the namespace has been set globally in javascript
      //
      // Example:
      //    Foundation.global.namespace = 'my-namespace';
      // or make it an empty string:
      //    Foundation.global.namespace = '';
      //
      //

      // If the namespace has not been set (is undefined), try to read it out of the meta element.
      // Otherwise use the globally defined namespace, even if it's empty ('')
      var namespace = ( this.global.namespace === undefined ) ? $('.foundation-data-attribute-namespace').css('font-family') : this.global.namespace;

      // Finally, if the namsepace is either undefined or false, set it to an empty string.
      // Otherwise use the namespace value.
      this.global.namespace = ( namespace === undefined || /false/i.test(namespace) ) ? '' : namespace;
    },

    libs : {},

    // methods that can be inherited in libraries
    utils : {

      // Description:
      //    Fast Selector wrapper returns jQuery object. Only use where getElementById
      //    is not available.
      //
      // Arguments:
      //    Selector (String): CSS selector describing the element(s) to be
      //    returned as a jQuery object.
      //
      //    Scope (String): CSS selector describing the area to be searched. Default
      //    is document.
      //
      // Returns:
      //    Element (jQuery Object): jQuery object containing elements matching the
      //    selector within the scope.
      S : S,

      // Description:
      //    Executes a function a max of once every n milliseconds
      //
      // Arguments:
      //    Func (Function): Function to be throttled.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      // Returns:
      //    Lazy_function (Function): Function with throttling applied.
      throttle : function (func, delay) {
        var timer = null;

        return function () {
          var context = this, args = arguments;

          if (timer == null) {
            timer = setTimeout(function () {
              func.apply(context, args);
              timer = null;
            }, delay);
          }
        };
      },

      // Description:
      //    Executes a function when it stops being invoked for n seconds
      //    Modified version of _.debounce() http://underscorejs.org
      //
      // Arguments:
      //    Func (Function): Function to be debounced.
      //
      //    Delay (Integer): Function execution threshold in milliseconds.
      //
      //    Immediate (Bool): Whether the function should be called at the beginning
      //    of the delay instead of the end. Default is false.
      //
      // Returns:
      //    Lazy_function (Function): Function with debouncing applied.
      debounce : function (func, delay, immediate) {
        var timeout, result;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, delay);
          if (callNow) {
            result = func.apply(context, args);
          }
          return result;
        };
      },

      // Description:
      //    Parses data-options attribute
      //
      // Arguments:
      //    El (jQuery Object): Element to be parsed.
      //
      // Returns:
      //    Options (Javascript Object): Contents of the element's data-options
      //    attribute.
      data_options : function (el, data_attr_name) {
        data_attr_name = data_attr_name || 'options';
        var opts = {}, ii, p, opts_arr,
            data_options = function (el) {
              var namespace = Foundation.global.namespace;

              if (namespace.length > 0) {
                return el.data(namespace + '-' + data_attr_name);
              }

              return el.data(data_attr_name);
            };

        var cached_options = data_options(el);

        if (typeof cached_options === 'object') {
          return cached_options;
        }

        opts_arr = (cached_options || ':').split(';');
        ii = opts_arr.length;

        function isNumber (o) {
          return !isNaN (o - 0) && o !== null && o !== '' && o !== false && o !== true;
        }

        function trim (str) {
          if (typeof str === 'string') {
            return $.trim(str);
          }
          return str;
        }

        while (ii--) {
          p = opts_arr[ii].split(':');
          p = [p[0], p.slice(1).join(':')];

          if (/true/i.test(p[1])) {
            p[1] = true;
          }
          if (/false/i.test(p[1])) {
            p[1] = false;
          }
          if (isNumber(p[1])) {
            if (p[1].indexOf('.') === -1) {
              p[1] = parseInt(p[1], 10);
            } else {
              p[1] = parseFloat(p[1]);
            }
          }

          if (p.length === 2 && p[0].length > 0) {
            opts[trim(p[0])] = trim(p[1]);
          }
        }

        return opts;
      },

      // Description:
      //    Adds JS-recognizable media queries
      //
      // Arguments:
      //    Media (String): Key string for the media query to be stored as in
      //    Foundation.media_queries
      //
      //    Class (String): Class name for the generated <meta> tag
      register_media : function (media, media_class) {
        if (Foundation.media_queries[media] === undefined) {
          $('head').append('<meta class="' + media_class + '"/>');
          Foundation.media_queries[media] = removeQuotes($('.' + media_class).css('font-family'));
        }
      },

      // Description:
      //    Add custom CSS within a JS-defined media query
      //
      // Arguments:
      //    Rule (String): CSS rule to be appended to the document.
      //
      //    Media (String): Optional media query string for the CSS rule to be
      //    nested under.
      add_custom_rule : function (rule, media) {
        if (media === undefined && Foundation.stylesheet) {
          Foundation.stylesheet.insertRule(rule, Foundation.stylesheet.cssRules.length);
        } else {
          var query = Foundation.media_queries[media];

          if (query !== undefined) {
            Foundation.stylesheet.insertRule('@media ' +
              Foundation.media_queries[media] + '{ ' + rule + ' }', Foundation.stylesheet.cssRules.length);
          }
        }
      },

      // Description:
      //    Performs a callback function when an image is fully loaded
      //
      // Arguments:
      //    Image (jQuery Object): Image(s) to check if loaded.
      //
      //    Callback (Function): Function to execute when image is fully loaded.
      image_loaded : function (images, callback) {
        var self = this,
            unloaded = images.length;

        function pictures_has_height(images) {
          var pictures_number = images.length;

          for (var i = pictures_number - 1; i >= 0; i--) {
            if(images.attr('height') === undefined) {
              return false;
            };
          };

          return true;
        }

        if (unloaded === 0 || pictures_has_height(images)) {
          callback(images);
        }

        images.each(function () {
          single_image_loaded(self.S(this), function () {
            unloaded -= 1;
            if (unloaded === 0) {
              callback(images);
            }
          });
        });
      },

      // Description:
      //    Returns a random, alphanumeric string
      //
      // Arguments:
      //    Length (Integer): Length of string to be generated. Defaults to random
      //    integer.
      //
      // Returns:
      //    Rand (String): Pseudo-random, alphanumeric string.
      random_str : function () {
        if (!this.fidx) {
          this.fidx = 0;
        }
        this.prefix = this.prefix || [(this.name || 'F'), (+new Date).toString(36)].join('-');

        return this.prefix + (this.fidx++).toString(36);
      },

      // Description:
      //    Helper for window.matchMedia
      //
      // Arguments:
      //    mq (String): Media query
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not
      match : function (mq) {
        return window.matchMedia(mq).matches;
      },

      // Description:
      //    Helpers for checking Foundation default media queries with JS
      //
      // Returns:
      //    (Boolean): Whether the media query passes or not

      is_small_up : function () {
        return this.match(Foundation.media_queries.small);
      },

      is_medium_up : function () {
        return this.match(Foundation.media_queries.medium);
      },

      is_large_up : function () {
        return this.match(Foundation.media_queries.large);
      },

      is_xlarge_up : function () {
        return this.match(Foundation.media_queries.xlarge);
      },

      is_xxlarge_up : function () {
        return this.match(Foundation.media_queries.xxlarge);
      },

      is_small_only : function () {
        return !this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_medium_only : function () {
        return this.is_medium_up() && !this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_large_only : function () {
        return this.is_medium_up() && this.is_large_up() && !this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && !this.is_xxlarge_up();
      },

      is_xxlarge_only : function () {
        return this.is_medium_up() && this.is_large_up() && this.is_xlarge_up() && this.is_xxlarge_up();
      }
    }
  };

  $.fn.foundation = function () {
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function () {
      Foundation.init.apply(Foundation, [this].concat(args));
      return this;
    });
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.abide = {
    name : 'abide',

    version : '5.5.2',

    settings : {
      live_validate : true,
      validate_on_blur : true,
      // validate_on: 'tab', // tab (when user tabs between fields), change (input changes), manual (call custom events) 
      focus_on_invalid : true,
      error_labels : true, // labels with a for="inputId" will recieve an `error` class
      error_class : 'error',
      timeout : 1000,
      patterns : {
        alpha : /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer : /^[-+]?\d+$/,
        number : /^[-+]?\d*(?:[\.\,]\d+)?$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,

        // http://blogs.lse.ac.uk/lti/2008/04/23/a-regular-expression-to-match-any-url/
        url: /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
        // abc.de
        domain : /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,

        datetime : /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
        // YYYY-MM-DD
        date : /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
        // HH:MM:SS
        time : /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
        dateISO : /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
        // MM/DD/YYYY
        month_day_year : /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
        // DD/MM/YYYY
        day_month_year : /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,

        // #FFF or #FFFFFF
        color : /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validators : {
        equalTo : function (el, required, parent) {
          var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
              to    = el.value,
              valid = (from === to);

          return valid;
        }
      }
    },

    timer : null,

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          form = self.S(scope).attr('novalidate', 'novalidate'),
          settings = form.data(this.attr_name(true) + '-init') || {};

      this.invalid_attr = this.add_namespace('data-invalid');

      function validate(originalSelf, e) {
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
          self.validate([originalSelf], e);
        }.bind(originalSelf), settings.timeout);
      }


      form
        .off('.abide')
        .on('submit.fndtn.abide', function (e) {
          var is_ajax = /ajax/i.test(self.S(this).attr(self.attr_name()));
          return self.validate(self.S(this).find('input, textarea, select').not(":hidden, [data-abide-ignore]").get(), e, is_ajax);
        })
        .on('validate.fndtn.abide', function (e) {
          if (settings.validate_on === 'manual') {
            self.validate([e.target], e);
          }
        })
        .on('reset', function (e) {
          return self.reset($(this), e);          
        })
        .find('input, textarea, select').not(":hidden, [data-abide-ignore]")
          .off('.abide')
          .on('blur.fndtn.abide change.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.validate_on_blur && settings.validate_on_blur === true) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('keydown.fndtn.abide', function (e) {
            // old settings fallback
            // will be deprecated with F6 release
            if (settings.live_validate && settings.live_validate === true && e.which != 9) {
              validate(this, e);
            }
            // new settings combining validate options into one setting
            if (settings.validate_on === 'tab' && e.which === 9) {
              validate(this, e);
            }
            else if (settings.validate_on === 'change') {
              validate(this, e);
            }
          })
          .on('focus', function (e) {
            if (navigator.userAgent.match(/iPad|iPhone|Android|BlackBerry|Windows Phone|webOS/i)) {
              $('html, body').animate({
                  scrollTop: $(e.target).offset().top
              }, 100);
            } 
          });
    },

    reset : function (form, e) {
      var self = this;
      form.removeAttr(self.invalid_attr);

      $('[' + self.invalid_attr + ']', form).removeAttr(self.invalid_attr);
      $('.' + self.settings.error_class, form).not('small').removeClass(self.settings.error_class);
      $(':input', form).not(':button, :submit, :reset, :hidden, [data-abide-ignore]').val('').removeAttr(self.invalid_attr);
    },

    validate : function (els, e, is_ajax) {
      var validations = this.parse_patterns(els),
          validation_count = validations.length,
          form = this.S(els[0]).closest('form'),
          submit_event = /submit/.test(e.type);

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < validation_count; i++) {
        if (!validations[i] && (submit_event || is_ajax)) {
          if (this.settings.focus_on_invalid) {
            els[i].focus();
          }
          form.trigger('invalid.fndtn.abide');
          this.S(els[i]).closest('form').attr(this.invalid_attr, '');
          return false;
        }
      }

      if (submit_event || is_ajax) {
        form.trigger('valid.fndtn.abide');
      }

      form.removeAttr(this.invalid_attr);

      if (is_ajax) {
        return false;
      }

      return true;
    },

    parse_patterns : function (els) {
      var i = els.length,
          el_patterns = [];

      while (i--) {
        el_patterns.push(this.pattern(els[i]));
      }

      return this.check_validation_and_apply_styles(el_patterns);
    },

    pattern : function (el) {
      var type = el.getAttribute('type'),
          required = typeof el.getAttribute('required') === 'string';

      var pattern = el.getAttribute('pattern') || '';

      if (this.settings.patterns.hasOwnProperty(pattern) && pattern.length > 0) {
        return [el, this.settings.patterns[pattern], required];
      } else if (pattern.length > 0) {
        return [el, new RegExp(pattern), required];
      }

      if (this.settings.patterns.hasOwnProperty(type)) {
        return [el, this.settings.patterns[type], required];
      }

      pattern = /.*/;

      return [el, pattern, required];
    },

    // TODO: Break this up into smaller methods, getting hard to read.
    check_validation_and_apply_styles : function (el_patterns) {
      var i = el_patterns.length,
          validations = [],
          form = this.S(el_patterns[0][0]).closest('[data-' + this.attr_name(true) + ']'),
          settings = form.data(this.attr_name(true) + '-init') || {};
      while (i--) {
        var el = el_patterns[i][0],
            required = el_patterns[i][2],
            value = el.value.trim(),
            direct_parent = this.S(el).parent(),
            validator = el.getAttribute(this.add_namespace('data-abide-validator')),
            is_radio = el.type === 'radio',
            is_checkbox = el.type === 'checkbox',
            label = this.S('label[for="' + el.getAttribute('id') + '"]'),
            valid_length = (required) ? (el.value.length > 0) : true,
            el_validations = [];

        var parent, valid;

        // support old way to do equalTo validations
        if (el.getAttribute(this.add_namespace('data-equalto'))) { validator = 'equalTo' }

        if (!direct_parent.is('label')) {
          parent = direct_parent;
        } else {
          parent = direct_parent.parent();
        }

        if (is_radio && required) {
          el_validations.push(this.valid_radio(el, required));
        } else if (is_checkbox && required) {
          el_validations.push(this.valid_checkbox(el, required));

        } else if (validator) {
          // Validate using each of the specified (space-delimited) validators.
          var validators = validator.split(' ');
          var last_valid = true, all_valid = true;
          for (var iv = 0; iv < validators.length; iv++) {
              valid = this.settings.validators[validators[iv]].apply(this, [el, required, parent])
              el_validations.push(valid);
              all_valid = valid && last_valid;
              last_valid = valid;
          }
          if (all_valid) {
              this.S(el).removeAttr(this.invalid_attr);
              parent.removeClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.removeClass(this.settings.error_class).removeAttr('role');
              }
              $(el).triggerHandler('valid');
          } else {
              this.S(el).attr(this.invalid_attr, '');
              parent.addClass('error');
              if (label.length > 0 && this.settings.error_labels) {
                label.addClass(this.settings.error_class).attr('role', 'alert');
              }
              $(el).triggerHandler('invalid');
          }
        } else {

          if (el_patterns[i][1].test(value) && valid_length ||
            !required && el.value.length < 1 || $(el).attr('disabled')) {
            el_validations.push(true);
          } else {
            el_validations.push(false);
          }

          el_validations = [el_validations.every(function (valid) {return valid;})];
          if (el_validations[0]) {
            this.S(el).removeAttr(this.invalid_attr);
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
            parent.removeClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.removeClass(this.settings.error_class).removeAttr('role');
            }
            $(el).triggerHandler('valid');
          } else {
            this.S(el).attr(this.invalid_attr, '');
            el.setAttribute('aria-invalid', 'true');

            // Try to find the error associated with the input
            var errorElem = parent.find('small.' + this.settings.error_class, 'span.' + this.settings.error_class);
            var errorID = errorElem.length > 0 ? errorElem[0].id : '';
            if (errorID.length > 0) {
              el.setAttribute('aria-describedby', errorID);
            }

            // el.setAttribute('aria-describedby', $(el).find('.error')[0].id);
            parent.addClass(this.settings.error_class);
            if (label.length > 0 && this.settings.error_labels) {
              label.addClass(this.settings.error_class).attr('role', 'alert');
            }
            $(el).triggerHandler('invalid');
          }
        }
        validations = validations.concat(el_validations);
      }
      return validations;
    },

    valid_checkbox : function (el, required) {
      var el = this.S(el),
          valid = (el.is(':checked') || !required || el.get(0).getAttribute('disabled'));

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
        $(el).triggerHandler('valid');
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
        $(el).triggerHandler('invalid');
      }

      return valid;
    },

    valid_radio : function (el, required) {
      var name = el.getAttribute('name'),
          group = this.S(el).closest('[data-' + this.attr_name(true) + ']').find("[name='" + name + "']"),
          count = group.length,
          valid = false,
          disabled = false;

      // Has to count up to make sure the focus gets applied to the top error
        for (var i=0; i < count; i++) {
            if( group[i].getAttribute('disabled') ){
                disabled=true;
                valid=true;
            } else {
                if (group[i].checked){
                    valid = true;
                } else {
                    if( disabled ){
                        valid = false;
                    }
                }
            }
        }

      // Has to count up to make sure the focus gets applied to the top error
      for (var i = 0; i < count; i++) {
        if (valid) {
          this.S(group[i]).removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
          $(group[i]).triggerHandler('valid');
        } else {
          this.S(group[i]).attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
          $(group[i]).triggerHandler('invalid');
        }
      }

      return valid;
    },

    valid_equal : function (el, required, parent) {
      var from  = document.getElementById(el.getAttribute(this.add_namespace('data-equalto'))).value,
          to    = el.value,
          valid = (from === to);

      if (valid) {
        this.S(el).removeAttr(this.invalid_attr);
        parent.removeClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.removeClass(this.settings.error_class);
        }
      } else {
        this.S(el).attr(this.invalid_attr, '');
        parent.addClass(this.settings.error_class);
        if (label.length > 0 && settings.error_labels) {
          label.addClass(this.settings.error_class);
        }
      }

      return valid;
    },

    valid_oneof : function (el, required, parent, doNotValidateOthers) {
      var el = this.S(el),
        others = this.S('[' + this.add_namespace('data-oneof') + ']'),
        valid = others.filter(':checked').length > 0;

      if (valid) {
        el.removeAttr(this.invalid_attr).parent().removeClass(this.settings.error_class);
      } else {
        el.attr(this.invalid_attr, '').parent().addClass(this.settings.error_class);
      }

      if (!doNotValidateOthers) {
        var _this = this;
        others.each(function () {
          _this.valid_oneof.call(_this, this, null, null, true);
        });
      }

      return valid;
    },

    reflow : function(scope, options) {
      var self = this,
          form = self.S('[' + this.attr_name() + ']').attr('novalidate', 'novalidate');
          self.S(form).each(function (idx, el) {
            self.events(el);
          });
    }
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.accordion = {
    name : 'accordion',

    version : '5.5.2',

    settings : {
      content_class : 'content',
      active_class : 'active',
      multi_expand : false,
      toggleable : true,
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function (instance) {
      var self = this;
      var S = this.S;
      self.create(this.S(instance));

      S(this.scope)
      .off('.fndtn.accordion')
      .on('click.fndtn.accordion', '[' + this.attr_name() + '] > dd > a, [' + this.attr_name() + '] > li > a', function (e) {
        var accordion = S(this).closest('[' + self.attr_name() + ']'),
            groupSelector = self.attr_name() + '=' + accordion.attr(self.attr_name()),
            settings = accordion.data(self.attr_name(true) + '-init') || self.settings,
            target = S('#' + this.href.split('#')[1]),
            aunts = $('> dd, > li', accordion),
            siblings = aunts.children('.' + settings.content_class),
            active_content = siblings.filter('.' + settings.active_class);

        e.preventDefault();

        if (accordion.attr(self.attr_name())) {
          siblings = siblings.add('[' + groupSelector + '] dd > ' + '.' + settings.content_class + ', [' + groupSelector + '] li > ' + '.' + settings.content_class);
          aunts = aunts.add('[' + groupSelector + '] dd, [' + groupSelector + '] li');
        }

        if (settings.toggleable && target.is(active_content)) {
          target.parent('dd, li').toggleClass(settings.active_class, false);
          target.toggleClass(settings.active_class, false);
          S(this).attr('aria-expanded', function(i, attr){
              return attr === 'true' ? 'false' : 'true';
          });
          settings.callback(target);
          target.triggerHandler('toggled', [accordion]);
          accordion.triggerHandler('toggled', [target]);
          return;
        }

        if (!settings.multi_expand) {
          siblings.removeClass(settings.active_class);
          aunts.removeClass(settings.active_class);
          aunts.children('a').attr('aria-expanded','false');
        }

        target.addClass(settings.active_class).parent().addClass(settings.active_class);
        settings.callback(target);
        target.triggerHandler('toggled', [accordion]);
        accordion.triggerHandler('toggled', [target]);
        S(this).attr('aria-expanded','true');
      });
    },

    create: function($instance) {
      var self = this,
          accordion = $instance,
          aunts = $('> .accordion-navigation', accordion),
          settings = accordion.data(self.attr_name(true) + '-init') || self.settings;

      aunts.children('a').attr('aria-expanded','false');
      aunts.has('.' + settings.content_class + '.' + settings.active_class).children('a').attr('aria-expanded','true');

      if (settings.multi_expand) {
        $instance.attr('aria-multiselectable','true');
      }
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.alert = {
    name : 'alert',

    version : '5.5.2',

    settings : {
      callback : function () {}
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = this.S;

      $(this.scope).off('.alert').on('click.fndtn.alert', '[' + this.attr_name() + '] .close', function (e) {
        var alertBox = S(this).closest('[' + self.attr_name() + ']'),
            settings = alertBox.data(self.attr_name(true) + '-init') || self.settings;

        e.preventDefault();
        if (Modernizr.csstransitions) {
          alertBox.addClass('alert-close');
          alertBox.on('transitionend webkitTransitionEnd oTransitionEnd', function (e) {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        } else {
          alertBox.fadeOut(300, function () {
            S(this).trigger('close.fndtn.alert').remove();
            settings.callback();
          });
        }
      });
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.clearing = {
    name : 'clearing',

    version : '5.5.2',

    settings : {
      templates : {
        viewing : '<a href="#" class="clearing-close">&times;</a>' +
          '<div class="visible-img" style="display: none"><div class="clearing-touch-label"></div><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' +
          '<p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a>' +
          '<a href="#" class="clearing-main-next"><span></span></a></div>' +
          '<img class="clearing-preload-next" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />' +
          '<img class="clearing-preload-prev" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />'
      },

      // comma delimited list of selectors that, on click, will close clearing,
      // add 'div.clearing-blackout, div.visible-img' to close on background click
      close_selectors : '.clearing-close, div.clearing-blackout',

      // Default to the entire li element.
      open_selectors : '',

      // Image will be skipped in carousel.
      skip_selector : '',

      touch_label : '',

      // event initializers and locks
      init : false,
      locked : false
    },

    init : function (scope, method, options) {
      var self = this;
      Foundation.inherit(this, 'throttle image_loaded');

      this.bindings(method, options);

      if (self.S(this.scope).is('[' + this.attr_name() + ']')) {
        this.assemble(self.S('li', this.scope));
      } else {
        self.S('[' + this.attr_name() + ']', this.scope).each(function () {
          self.assemble(self.S('li', this));
        });
      }
    },

    events : function (scope) {
      var self = this,
          S = self.S,
          $scroll_container = $('.scroll-container');

      if ($scroll_container.length > 0) {
        this.scope = $scroll_container;
      }

      S(this.scope)
        .off('.clearing')
        .on('click.fndtn.clearing', 'ul[' + this.attr_name() + '] li ' + this.settings.open_selectors,
          function (e, current, target) {
            var current = current || S(this),
                target = target || current,
                next = current.next('li'),
                settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init'),
                image = S(e.target);

            e.preventDefault();

            if (!settings) {
              self.init();
              settings = current.closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
            }

            // if clearing is open and the current image is
            // clicked, go to the next image in sequence
            if (target.hasClass('visible') &&
              current[0] === target[0] &&
              next.length > 0 && self.is_open(current)) {
              target = next;
              image = S('img', target);
            }

            // set current and target to the clicked li if not otherwise defined.
            self.open(image, current, target);
            self.update_paddles(target);
          })

        .on('click.fndtn.clearing', '.clearing-main-next',
          function (e) { self.nav(e, 'next') })
        .on('click.fndtn.clearing', '.clearing-main-prev',
          function (e) { self.nav(e, 'prev') })
        .on('click.fndtn.clearing', this.settings.close_selectors,
          function (e) { Foundation.libs.clearing.close(e, this) });

      $(document).on('keydown.fndtn.clearing',
          function (e) { self.keydown(e) });

      S(window).off('.clearing').on('resize.fndtn.clearing',
        function () { self.resize() });

      this.swipe_events(scope);
    },

    swipe_events : function (scope) {
      var self = this,
      S = self.S;

      S(this.scope)
        .on('touchstart.fndtn.clearing', '.visible-img', function (e) {
          if (!e.touches) { e = e.originalEvent; }
          var data = {
                start_page_x : e.touches[0].pageX,
                start_page_y : e.touches[0].pageY,
                start_time : (new Date()).getTime(),
                delta_x : 0,
                is_scrolling : undefined
              };

          S(this).data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.clearing', '.visible-img', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          // Ignore pinch/zoom events
          if (e.touches.length > 1 || e.scale && e.scale !== 1) {
            return;
          }

          var data = S(this).data('swipe-transition');

          if (typeof data === 'undefined') {
            data = {};
          }

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if (Foundation.rtl) {
            data.delta_x = -data.delta_x;
          }

          if (typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? 'next' : 'prev';
            data.active = true;
            self.nav(e, direction);
          }
        })
        .on('touchend.fndtn.clearing', '.visible-img', function (e) {
          S(this).data('swipe-transition', {});
          e.stopPropagation();
        });
    },

    assemble : function ($li) {
      var $el = $li.parent();

      if ($el.parent().hasClass('carousel')) {
        return;
      }

      $el.after('<div id="foundationClearingHolder"></div>');

      var grid = $el.detach(),
          grid_outerHTML = '';

      if (grid[0] == null) {
        return;
      } else {
        grid_outerHTML = grid[0].outerHTML;
      }

      var holder = this.S('#foundationClearingHolder'),
          settings = $el.data(this.attr_name(true) + '-init'),
          data = {
            grid : '<div class="carousel">' + grid_outerHTML + '</div>',
            viewing : settings.templates.viewing
          },
          wrapper = '<div class="clearing-assembled"><div>' + data.viewing +
            data.grid + '</div></div>',
          touch_label = this.settings.touch_label;

      if (Modernizr.touch) {
        wrapper = $(wrapper).find('.clearing-touch-label').html(touch_label).end();
      }

      holder.after(wrapper).remove();
    },

    open : function ($image, current, target) {
      var self = this,
          body = $(document.body),
          root = target.closest('.clearing-assembled'),
          container = self.S('div', root).first(),
          visible_image = self.S('.visible-img', container),
          image = self.S('img', visible_image).not($image),
          label = self.S('.clearing-touch-label', container),
          error = false,
          loaded = {};

      // Event to disable scrolling on touch devices when Clearing is activated
      $('body').on('touchmove', function (e) {
        e.preventDefault();
      });

      image.error(function () {
        error = true;
      });

      function startLoad() {
        setTimeout(function () {
          this.image_loaded(image, function () {
            if (image.outerWidth() === 1 && !error) {
              startLoad.call(this);
            } else {
              cb.call(this, image);
            }
          }.bind(this));
        }.bind(this), 100);
      }

      function cb (image) {
        var $image = $(image);
        $image.css('visibility', 'visible');
        $image.trigger('imageVisible');
        // toggle the gallery
        body.css('overflow', 'hidden');
        root.addClass('clearing-blackout');
        container.addClass('clearing-container');
        visible_image.show();
        this.fix_height(target)
          .caption(self.S('.clearing-caption', visible_image), self.S('img', target))
          .center_and_label(image, label)
          .shift(current, target, function () {
            target.closest('li').siblings().removeClass('visible');
            target.closest('li').addClass('visible');
          });
        visible_image.trigger('opened.fndtn.clearing')
      }

      if (!this.locked()) {
        visible_image.trigger('open.fndtn.clearing');
        // set the image to the selected thumbnail
        loaded = this.load($image);
        if (loaded.interchange) {
          image
            .attr('data-interchange', loaded.interchange)
            .foundation('interchange', 'reflow');
        } else {
          image
            .attr('src', loaded.src)
            .attr('data-interchange', '');
        }
        image.css('visibility', 'hidden');

        startLoad.call(this);
      }
    },

    close : function (e, el) {
      e.preventDefault();

      var root = (function (target) {
            if (/blackout/.test(target.selector)) {
              return target;
            } else {
              return target.closest('.clearing-blackout');
            }
          }($(el))),
          body = $(document.body), container, visible_image;

      if (el === e.target && root) {
        body.css('overflow', '');
        container = $('div', root).first();
        visible_image = $('.visible-img', container);
        visible_image.trigger('close.fndtn.clearing');
        this.settings.prev_index = 0;
        $('ul[' + this.attr_name() + ']', root)
          .attr('style', '').closest('.clearing-blackout')
          .removeClass('clearing-blackout');
        container.removeClass('clearing-container');
        visible_image.hide();
        visible_image.trigger('closed.fndtn.clearing');
      }

      // Event to re-enable scrolling on touch devices
      $('body').off('touchmove');

      return false;
    },

    is_open : function (current) {
      return current.parent().prop('style').length > 0;
    },

    keydown : function (e) {
      var clearing = $('.clearing-blackout ul[' + this.attr_name() + ']'),
          NEXT_KEY = this.rtl ? 37 : 39,
          PREV_KEY = this.rtl ? 39 : 37,
          ESC_KEY = 27;

      if (e.which === NEXT_KEY) {
        this.go(clearing, 'next');
      }
      if (e.which === PREV_KEY) {
        this.go(clearing, 'prev');
      }
      if (e.which === ESC_KEY) {
        this.S('a.clearing-close').trigger('click.fndtn.clearing');
      }
    },

    nav : function (e, direction) {
      var clearing = $('ul[' + this.attr_name() + ']', '.clearing-blackout');

      e.preventDefault();
      this.go(clearing, direction);
    },

    resize : function () {
      var image = $('img', '.clearing-blackout .visible-img'),
          label = $('.clearing-touch-label', '.clearing-blackout');

      if (image.length) {
        this.center_and_label(image, label);
        image.trigger('resized.fndtn.clearing')
      }
    },

    // visual adjustments
    fix_height : function (target) {
      var lis = target.parent().children(),
          self = this;

      lis.each(function () {
        var li = self.S(this),
            image = li.find('img');

        if (li.height() > image.outerHeight()) {
          li.addClass('fix-height');
        }
      })
      .closest('ul')
      .width(lis.length * 100 + '%');

      return this;
    },

    update_paddles : function (target) {
      target = target.closest('li');
      var visible_image = target
        .closest('.carousel')
        .siblings('.visible-img');

      if (target.next().length > 0) {
        this.S('.clearing-main-next', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-next', visible_image).addClass('disabled');
      }

      if (target.prev().length > 0) {
        this.S('.clearing-main-prev', visible_image).removeClass('disabled');
      } else {
        this.S('.clearing-main-prev', visible_image).addClass('disabled');
      }
    },

    center_and_label : function (target, label) {
      if (!this.rtl && label.length > 0) {
        label.css({
          marginLeft : -(label.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)-label.outerHeight()-10
        });
      } else {
        label.css({
          marginRight : -(label.outerWidth() / 2),
          marginTop : -(target.outerHeight() / 2)-label.outerHeight()-10,
          left: 'auto',
          right: '50%'
        });
      }
      return this;
    },

    // image loading and preloading

    load : function ($image) {
      var href,
          interchange,
          closest_a;

      if ($image[0].nodeName === 'A') {
        href = $image.attr('href');
        interchange = $image.data('clearing-interchange');
      } else {
        closest_a = $image.closest('a');
        href = closest_a.attr('href');
        interchange = closest_a.data('clearing-interchange');
      }

      this.preload($image);

      return {
        'src': href ? href : $image.attr('src'),
        'interchange': href ? interchange : $image.data('clearing-interchange')
      }
    },

    preload : function ($image) {
      this
        .img($image.closest('li').next(), 'next')
        .img($image.closest('li').prev(), 'prev');
    },

    img : function (img, sibling_type) {
      if (img.length) {
        var preload_img = $('.clearing-preload-' + sibling_type),
            new_a = this.S('a', img),
            src,
            interchange,
            image;

        if (new_a.length) {
          src = new_a.attr('href');
          interchange = new_a.data('clearing-interchange');
        } else {
          image = this.S('img', img);
          src = image.attr('src');
          interchange = image.data('clearing-interchange');
        }

        if (interchange) {
          preload_img.attr('data-interchange', interchange);
        } else {
          preload_img.attr('src', src);
          preload_img.attr('data-interchange', '');
        }
      }
      return this;
    },

    // image caption

    caption : function (container, $image) {
      var caption = $image.attr('data-caption');

      if (caption) {
        container
          .html(caption)
          .show();
      } else {
        container
          .text('')
          .hide();
      }
      return this;
    },

    // directional methods

    go : function ($ul, direction) {
      var current = this.S('.visible', $ul),
          target = current[direction]();

      // Check for skip selector.
      if (this.settings.skip_selector && target.find(this.settings.skip_selector).length != 0) {
        target = target[direction]();
      }

      if (target.length) {
        this.S('img', target)
          .trigger('click.fndtn.clearing', [current, target])
          .trigger('change.fndtn.clearing');
      }
    },

    shift : function (current, target, callback) {
      var clearing = target.parent(),
          old_index = this.settings.prev_index || target.index(),
          direction = this.direction(clearing, current, target),
          dir = this.rtl ? 'right' : 'left',
          left = parseInt(clearing.css('left'), 10),
          width = target.outerWidth(),
          skip_shift;

      var dir_obj = {};

      // we use jQuery animate instead of CSS transitions because we
      // need a callback to unlock the next animation
      // needs support for RTL **
      if (target.index() !== old_index && !/skip/.test(direction)) {
        if (/left/.test(direction)) {
          this.lock();
          dir_obj[dir] = left + width;
          clearing.animate(dir_obj, 300, this.unlock());
        } else if (/right/.test(direction)) {
          this.lock();
          dir_obj[dir] = left - width;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      } else if (/skip/.test(direction)) {
        // the target image is not adjacent to the current image, so
        // do we scroll right or not
        skip_shift = target.index() - this.settings.up_count;
        this.lock();

        if (skip_shift > 0) {
          dir_obj[dir] = -(skip_shift * width);
          clearing.animate(dir_obj, 300, this.unlock());
        } else {
          dir_obj[dir] = 0;
          clearing.animate(dir_obj, 300, this.unlock());
        }
      }

      callback();
    },

    direction : function ($el, current, target) {
      var lis = this.S('li', $el),
          li_width = lis.outerWidth() + (lis.outerWidth() / 4),
          up_count = Math.floor(this.S('.clearing-container').outerWidth() / li_width) - 1,
          target_index = lis.index(target),
          response;

      this.settings.up_count = up_count;

      if (this.adjacent(this.settings.prev_index, target_index)) {
        if ((target_index > up_count) && target_index > this.settings.prev_index) {
          response = 'right';
        } else if ((target_index > up_count - 1) && target_index <= this.settings.prev_index) {
          response = 'left';
        } else {
          response = false;
        }
      } else {
        response = 'skip';
      }

      this.settings.prev_index = target_index;

      return response;
    },

    adjacent : function (current_index, target_index) {
      for (var i = target_index + 1; i >= target_index - 1; i--) {
        if (i === current_index) {
          return true;
        }
      }
      return false;
    },

    // lock management

    lock : function () {
      this.settings.locked = true;
    },

    unlock : function () {
      this.settings.locked = false;
    },

    locked : function () {
      return this.settings.locked;
    },

    off : function () {
      this.S(this.scope).off('.fndtn.clearing');
      this.S(window).off('.fndtn.clearing');
    },

    reflow : function () {
      this.init();
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.dropdown = {
    name : 'dropdown',

    version : '5.5.2',

    settings : {
      active_class : 'open',
      disabled_class : 'disabled',
      mega_class : 'mega',
      align : 'bottom',
      is_hover : false,
      hover_timeout : 150,
      opened : function () {},
      closed : function () {}
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');

      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.dropdown')
        .on('click.fndtn.dropdown', '[' + this.attr_name() + ']', function (e) {
          var settings = S(this).data(self.attr_name(true) + '-init') || self.settings;
          if (!settings.is_hover || Modernizr.touch) {
            e.preventDefault();
            if (S(this).parent('[data-reveal-id]').length) {
              e.stopPropagation();
            }
            self.toggle($(this));
          }
        })
        .on('mouseenter.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
          var $this = S(this),
              dropdown,
              target;

          clearTimeout(self.timeout);

          if ($this.data(self.data_attr())) {
            dropdown = S('#' + $this.data(self.data_attr()));
            target = $this;
          } else {
            dropdown = $this;
            target = S('[' + self.attr_name() + '="' + dropdown.attr('id') + '"]');
          }

          var settings = target.data(self.attr_name(true) + '-init') || self.settings;

          if (S(e.currentTarget).data(self.data_attr()) && settings.is_hover) {
            self.closeall.call(self);
          }

          if (settings.is_hover) {
            self.open.apply(self, [dropdown, target]);
          }
        })
        .on('mouseleave.fndtn.dropdown', '[' + this.attr_name() + '], [' + this.attr_name() + '-content]', function (e) {
          var $this = S(this);
          var settings;

          if ($this.data(self.data_attr())) {
              settings = $this.data(self.data_attr(true) + '-init') || self.settings;
          } else {
              var target   = S('[' + self.attr_name() + '="' + S(this).attr('id') + '"]'),
                  settings = target.data(self.attr_name(true) + '-init') || self.settings;
          }

          self.timeout = setTimeout(function () {
            if ($this.data(self.data_attr())) {
              if (settings.is_hover) {
                self.close.call(self, S('#' + $this.data(self.data_attr())));
              }
            } else {
              if (settings.is_hover) {
                self.close.call(self, $this);
              }
            }
          }.bind(this), settings.hover_timeout);
        })
        .on('click.fndtn.dropdown', function (e) {
          var parent = S(e.target).closest('[' + self.attr_name() + '-content]');
          var links  = parent.find('a');

          if (links.length > 0 && parent.attr('aria-autoclose') !== 'false') {
              self.close.call(self, S('[' + self.attr_name() + '-content]'));
          }

          if (e.target !== document && !$.contains(document.documentElement, e.target)) {
            return;
          }

          if (S(e.target).closest('[' + self.attr_name() + ']').length > 0) {
            return;
          }

          if (!(S(e.target).data('revealId')) &&
            (parent.length > 0 && (S(e.target).is('[' + self.attr_name() + '-content]') ||
              $.contains(parent.first()[0], e.target)))) {
            e.stopPropagation();
            return;
          }

          self.close.call(self, S('[' + self.attr_name() + '-content]'));
        })
        .on('opened.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
          self.settings.opened.call(this);
        })
        .on('closed.fndtn.dropdown', '[' + self.attr_name() + '-content]', function () {
          self.settings.closed.call(this);
        });

      S(window)
        .off('.dropdown')
        .on('resize.fndtn.dropdown', self.throttle(function () {
          self.resize.call(self);
        }, 50));

      this.resize();
    },

    close : function (dropdown) {
      var self = this;
      dropdown.each(function (idx) {
        var original_target = $('[' + self.attr_name() + '=' + dropdown[idx].id + ']') || $('aria-controls=' + dropdown[idx].id + ']');
        original_target.attr('aria-expanded', 'false');
        if (self.S(this).hasClass(self.settings.active_class)) {
          self.S(this)
            .css(Foundation.rtl ? 'right' : 'left', '-99999px')
            .attr('aria-hidden', 'true')
            .removeClass(self.settings.active_class)
            .prev('[' + self.attr_name() + ']')
            .removeClass(self.settings.active_class)
            .removeData('target');

          self.S(this).trigger('closed.fndtn.dropdown', [dropdown]);
        }
      });
      dropdown.removeClass('f-open-' + this.attr_name(true));
    },

    closeall : function () {
      var self = this;
      $.each(self.S('.f-open-' + this.attr_name(true)), function () {
        self.close.call(self, self.S(this));
      });
    },

    open : function (dropdown, target) {
      this
        .css(dropdown
        .addClass(this.settings.active_class), target);
      dropdown.prev('[' + this.attr_name() + ']').addClass(this.settings.active_class);
      dropdown.data('target', target.get(0)).trigger('opened.fndtn.dropdown', [dropdown, target]);
      dropdown.attr('aria-hidden', 'false');
      target.attr('aria-expanded', 'true');
      dropdown.focus();
      dropdown.addClass('f-open-' + this.attr_name(true));
    },

    data_attr : function () {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + this.name;
      }

      return this.name;
    },

    toggle : function (target) {
      if (target.hasClass(this.settings.disabled_class)) {
        return;
      }
      var dropdown = this.S('#' + target.data(this.data_attr()));
      if (dropdown.length === 0) {
        // No dropdown found, not continuing
        return;
      }

      this.close.call(this, this.S('[' + this.attr_name() + '-content]').not(dropdown));

      if (dropdown.hasClass(this.settings.active_class)) {
        this.close.call(this, dropdown);
        if (dropdown.data('target') !== target.get(0)) {
          this.open.call(this, dropdown, target);
        }
      } else {
        this.open.call(this, dropdown, target);
      }
    },

    resize : function () {
      var dropdown = this.S('[' + this.attr_name() + '-content].open');
      var target = $(dropdown.data("target"));

      if (dropdown.length && target.length) {
        this.css(dropdown, target);
      }
    },

    css : function (dropdown, target) {
      var left_offset = Math.max((target.width() - dropdown.width()) / 2, 8),
          settings = target.data(this.attr_name(true) + '-init') || this.settings,
          parentOverflow = dropdown.parent().css('overflow-y') || dropdown.parent().css('overflow');

      this.clear_idx();



      if (this.small()) {
        var p = this.dirs.bottom.call(dropdown, target, settings);

        dropdown.attr('style', '').removeClass('drop-left drop-right drop-top').css({
          position : 'absolute',
          width : '95%',
          'max-width' : 'none',
          top : p.top
        });

        dropdown.css(Foundation.rtl ? 'right' : 'left', left_offset);
      }
      // detect if dropdown is in an overflow container
      else if (parentOverflow !== 'visible') {
        var offset = target[0].offsetTop + target[0].offsetHeight;

        dropdown.attr('style', '').css({
          position : 'absolute',
          top : offset
        });

        dropdown.css(Foundation.rtl ? 'right' : 'left', left_offset);
      }
      else {

        this.style(dropdown, target, settings);
      }

      return dropdown;
    },

    style : function (dropdown, target, settings) {
      var css = $.extend({position : 'absolute'},
        this.dirs[settings.align].call(dropdown, target, settings));

      dropdown.attr('style', '').css(css);
    },

    // return CSS property object
    // `this` is the dropdown
    dirs : {
      // Calculate target offset
      _base : function (t) {
        var o_p = this.offsetParent(),
            o = o_p.offset(),
            p = t.offset();

        p.top -= o.top;
        p.left -= o.left;

        //set some flags on the p object to pass along
        p.missRight = false;
        p.missTop = false;
        p.missLeft = false;
        p.leftRightFlag = false;

        //lets see if the panel will be off the screen
        //get the actual width of the page and store it
        var actualBodyWidth;
        if (document.getElementsByClassName('row')[0]) {
          actualBodyWidth = document.getElementsByClassName('row')[0].clientWidth;
        } else {
          actualBodyWidth = window.innerWidth;
        }

        var actualMarginWidth = (window.innerWidth - actualBodyWidth) / 2;
        var actualBoundary = actualBodyWidth;

        if (!this.hasClass('mega')) {
          //miss top
          if (t.offset().top <= this.outerHeight()) {
            p.missTop = true;
            actualBoundary = window.innerWidth - actualMarginWidth;
            p.leftRightFlag = true;
          }

          //miss right
          if (t.offset().left + this.outerWidth() > t.offset().left + actualMarginWidth && t.offset().left - actualMarginWidth > this.outerWidth()) {
            p.missRight = true;
            p.missLeft = false;
          }

          //miss left
          if (t.offset().left - this.outerWidth() <= 0) {
            p.missLeft = true;
            p.missRight = false;
          }
        }

        return p;
      },

      top : function (t, s) {
        var self = Foundation.libs.dropdown,
            p = self.dirs._base.call(this, t);

        this.addClass('drop-top');

        if (p.missTop == true) {
          p.top = p.top + t.outerHeight() + this.outerHeight();
          this.removeClass('drop-top');
        }

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth() + t.outerWidth();
        }

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        if (Foundation.rtl) {
          return {left : p.left - this.outerWidth() + t.outerWidth(),
            top : p.top - this.outerHeight()};
        }

        return {left : p.left, top : p.top - this.outerHeight()};
      },

      bottom : function (t, s) {
        var self = Foundation.libs.dropdown,
            p = self.dirs._base.call(this, t);

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth() + t.outerWidth();
        }

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        if (self.rtl) {
          return {left : p.left - this.outerWidth() + t.outerWidth(), top : p.top + t.outerHeight()};
        }

        return {left : p.left, top : p.top + t.outerHeight()};
      },

      left : function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);

        this.addClass('drop-left');

        if (p.missLeft == true) {
          p.left =  p.left + this.outerWidth();
          p.top = p.top + t.outerHeight();
          this.removeClass('drop-left');
        }

        return {left : p.left - this.outerWidth(), top : p.top};
      },

      right : function (t, s) {
        var p = Foundation.libs.dropdown.dirs._base.call(this, t);

        this.addClass('drop-right');

        if (p.missRight == true) {
          p.left = p.left - this.outerWidth();
          p.top = p.top + t.outerHeight();
          this.removeClass('drop-right');
        } else {
          p.triggeredRight = true;
        }

        var self = Foundation.libs.dropdown;

        if (t.outerWidth() < this.outerWidth() || self.small() || this.hasClass(s.mega_menu)) {
          self.adjust_pip(this, t, s, p);
        }

        return {left : p.left + t.outerWidth(), top : p.top};
      }
    },

    // Insert rule to style psuedo elements
    adjust_pip : function (dropdown, target, settings, position) {
      var sheet = Foundation.stylesheet,
          pip_offset_base = 8;

      if (dropdown.hasClass(settings.mega_class)) {
        pip_offset_base = position.left + (target.outerWidth() / 2) - 8;
      } else if (this.small()) {
        pip_offset_base += position.left - 8;
      }

      this.rule_idx = sheet.cssRules.length;

      //default
      var sel_before = '.f-dropdown.open:before',
          sel_after  = '.f-dropdown.open:after',
          css_before = 'left: ' + pip_offset_base + 'px;',
          css_after  = 'left: ' + (pip_offset_base - 1) + 'px;';

      if (position.missRight == true) {
        pip_offset_base = dropdown.outerWidth() - 23;
        sel_before = '.f-dropdown.open:before',
        sel_after  = '.f-dropdown.open:after',
        css_before = 'left: ' + pip_offset_base + 'px;',
        css_after  = 'left: ' + (pip_offset_base - 1) + 'px;';
      }

      //just a case where right is fired, but its not missing right
      if (position.triggeredRight == true) {
        sel_before = '.f-dropdown.open:before',
        sel_after  = '.f-dropdown.open:after',
        css_before = 'left:-12px;',
        css_after  = 'left:-14px;';
      }

      if (sheet.insertRule) {
        sheet.insertRule([sel_before, '{', css_before, '}'].join(' '), this.rule_idx);
        sheet.insertRule([sel_after, '{', css_after, '}'].join(' '), this.rule_idx + 1);
      } else {
        sheet.addRule(sel_before, css_before, this.rule_idx);
        sheet.addRule(sel_after, css_after, this.rule_idx + 1);
      }
    },

    // Remove old dropdown rule index
    clear_idx : function () {
      var sheet = Foundation.stylesheet;

      if (typeof this.rule_idx !== 'undefined') {
        sheet.deleteRule(this.rule_idx);
        sheet.deleteRule(this.rule_idx);
        delete this.rule_idx;
      }
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    off : function () {
      this.S(this.scope).off('.fndtn.dropdown');
      this.S('html, body').off('.fndtn.dropdown');
      this.S(window).off('.fndtn.dropdown');
      this.S('[data-dropdown-content]').off('.fndtn.dropdown');
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.equalizer = {
    name : 'equalizer',

    version : '5.5.2',

    settings : {
      use_tallest : true,
      before_height_change : $.noop,
      after_height_change : $.noop,
      equalize_on_stack : false,
      act_on_hidden_el: false
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'image_loaded');
      this.bindings(method, options);
      this.reflow();
    },

    events : function () {
      this.S(window).off('.equalizer').on('resize.fndtn.equalizer', function (e) {
        this.reflow();
      }.bind(this));
    },

    equalize : function (equalizer) {
      var isStacked = false,
          group = equalizer.data('equalizer'),
          settings = equalizer.data(this.attr_name(true)+'-init') || this.settings,
          vals,
          firstTopOffset;

      if (settings.act_on_hidden_el) {
        vals = group ? equalizer.find('['+this.attr_name()+'-watch="'+group+'"]') : equalizer.find('['+this.attr_name()+'-watch]');
      }
      else {
        vals = group ? equalizer.find('['+this.attr_name()+'-watch="'+group+'"]:visible') : equalizer.find('['+this.attr_name()+'-watch]:visible');
      }
      
      if (vals.length === 0) {
        return;
      }

      settings.before_height_change();
      equalizer.trigger('before-height-change.fndth.equalizer');
      vals.height('inherit');

      if (settings.equalize_on_stack === false) {
        firstTopOffset = vals.first().offset().top;
        vals.each(function () {
          if ($(this).offset().top !== firstTopOffset) {
            isStacked = true;
            return false;
          }
        });
        if (isStacked) {
          return;
        }
      }

      var heights = vals.map(function () { return $(this).outerHeight(false) }).get();

      if (settings.use_tallest) {
        var max = Math.max.apply(null, heights);
        vals.css('height', max);
      } else {
        var min = Math.min.apply(null, heights);
        vals.css('height', min);
      }

      settings.after_height_change();
      equalizer.trigger('after-height-change.fndtn.equalizer');
    },

    reflow : function () {
      var self = this;

      this.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var $eq_target = $(this),
            media_query = $eq_target.data('equalizer-mq'),
            ignore_media_query = true;

        if (media_query) {
          media_query = 'is_' + media_query.replace(/-/g, '_');
          if (Foundation.utils.hasOwnProperty(media_query)) {
            ignore_media_query = false;
          }
        }

        self.image_loaded(self.S('img', this), function () {
          if (ignore_media_query || Foundation.utils[media_query]()) {
            self.equalize($eq_target)
          } else {
            var vals = $eq_target.find('[' + self.attr_name() + '-watch]:visible');
            vals.css('height', 'auto');
          }
        });
      });
    }
  };
})(jQuery, window, window.document);

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.interchange = {
    name : 'interchange',

    version : '5.5.2',

    cache : {},

    images_loaded : false,
    nodes_loaded : false,

    settings : {
      load_attr : 'interchange',

      named_queries : {
        'default'     : 'only screen',
        'small'       : Foundation.media_queries['small'],
        'small-only'  : Foundation.media_queries['small-only'],
        'medium'      : Foundation.media_queries['medium'],
        'medium-only' : Foundation.media_queries['medium-only'],
        'large'       : Foundation.media_queries['large'],
        'large-only'  : Foundation.media_queries['large-only'],
        'xlarge'      : Foundation.media_queries['xlarge'],
        'xlarge-only' : Foundation.media_queries['xlarge-only'],
        'xxlarge'     : Foundation.media_queries['xxlarge'],
        'landscape'   : 'only screen and (orientation: landscape)',
        'portrait'    : 'only screen and (orientation: portrait)',
        'retina'      : 'only screen and (-webkit-min-device-pixel-ratio: 2),' +
          'only screen and (min--moz-device-pixel-ratio: 2),' +
          'only screen and (-o-min-device-pixel-ratio: 2/1),' +
          'only screen and (min-device-pixel-ratio: 2),' +
          'only screen and (min-resolution: 192dpi),' +
          'only screen and (min-resolution: 2dppx)'
      },

      directives : {
        replace : function (el, path, trigger) {
          // The trigger argument, if called within the directive, fires
          // an event named after the directive on the element, passing
          // any parameters along to the event that you pass to trigger.
          //
          // ex. trigger(), trigger([a, b, c]), or trigger(a, b, c)
          //
          // This allows you to bind a callback like so:
          // $('#interchangeContainer').on('replace', function (e, a, b, c) {
          //   console.log($(this).html(), a, b, c);
          // });

          if (el !== null && /IMG/.test(el[0].nodeName)) {
            var orig_path = el[0].src;

            if (new RegExp(path, 'i').test(orig_path)) {
              return;
            }

            el.attr("src", path);

            return trigger(el[0].src);
          }
          var last_path = el.data(this.data_attr + '-last-path'),
              self = this;

          if (last_path == path) {
            return;
          }

          if (/\.(gif|jpg|jpeg|tiff|png)([?#].*)?/i.test(path)) {
            $(el).css('background-image', 'url(' + path + ')');
            el.data('interchange-last-path', path);
            return trigger(path);
          }

          return $.get(path, function (response) {
            el.html(response);
            el.data(self.data_attr + '-last-path', path);
            trigger();
          });

        }
      }
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');

      this.data_attr = this.set_data_attr();
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
      this.reflow();
    },

    get_media_hash : function () {
        var mediaHash = '';
        for (var queryName in this.settings.named_queries ) {
            mediaHash += matchMedia(this.settings.named_queries[queryName]).matches.toString();
        }
        return mediaHash;
    },

    events : function () {
      var self = this, prevMediaHash;

      $(window)
        .off('.interchange')
        .on('resize.fndtn.interchange', self.throttle(function () {
            var currMediaHash = self.get_media_hash();
            if (currMediaHash !== prevMediaHash) {
                self.resize();
            }
            prevMediaHash = currMediaHash;
        }, 50));

      return this;
    },

    resize : function () {
      var cache = this.cache;

      if (!this.images_loaded || !this.nodes_loaded) {
        setTimeout($.proxy(this.resize, this), 50);
        return;
      }

      for (var uuid in cache) {
        if (cache.hasOwnProperty(uuid)) {
          var passed = this.results(uuid, cache[uuid]);
          if (passed) {
            this.settings.directives[passed
              .scenario[1]].call(this, passed.el, passed.scenario[0], (function (passed) {
                if (arguments[0] instanceof Array) {
                  var args = arguments[0];
                } else {
                  var args = Array.prototype.slice.call(arguments, 0);
                }

                return function() {
                  passed.el.trigger(passed.scenario[1], args);
                }
              }(passed)));
          }
        }
      }

    },

    results : function (uuid, scenarios) {
      var count = scenarios.length;

      if (count > 0) {
        var el = this.S('[' + this.add_namespace('data-uuid') + '="' + uuid + '"]');

        while (count--) {
          var mq, rule = scenarios[count][2];
          if (this.settings.named_queries.hasOwnProperty(rule)) {
            mq = matchMedia(this.settings.named_queries[rule]);
          } else {
            mq = matchMedia(rule);
          }
          if (mq.matches) {
            return {el : el, scenario : scenarios[count]};
          }
        }
      }

      return false;
    },

    load : function (type, force_update) {
      if (typeof this['cached_' + type] === 'undefined' || force_update) {
        this['update_' + type]();
      }

      return this['cached_' + type];
    },

    update_images : function () {
      var images = this.S('img[' + this.data_attr + ']'),
          count = images.length,
          i = count,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cache = {};
      this.cached_images = [];
      this.images_loaded = (count === 0);

      while (i--) {
        loaded_count++;
        if (images[i]) {
          var str = images[i].getAttribute(data_attr) || '';

          if (str.length > 0) {
            this.cached_images.push(images[i]);
          }
        }

        if (loaded_count === count) {
          this.images_loaded = true;
          this.enhance('images');
        }
      }

      return this;
    },

    update_nodes : function () {
      var nodes = this.S('[' + this.data_attr + ']').not('img'),
          count = nodes.length,
          i = count,
          loaded_count = 0,
          data_attr = this.data_attr;

      this.cached_nodes = [];
      this.nodes_loaded = (count === 0);

      while (i--) {
        loaded_count++;
        var str = nodes[i].getAttribute(data_attr) || '';

        if (str.length > 0) {
          this.cached_nodes.push(nodes[i]);
        }

        if (loaded_count === count) {
          this.nodes_loaded = true;
          this.enhance('nodes');
        }
      }

      return this;
    },

    enhance : function (type) {
      var i = this['cached_' + type].length;

      while (i--) {
        this.object($(this['cached_' + type][i]));
      }

      return $(window).trigger('resize.fndtn.interchange');
    },

    convert_directive : function (directive) {

      var trimmed = this.trim(directive);

      if (trimmed.length > 0) {
        return trimmed;
      }

      return 'replace';
    },

    parse_scenario : function (scenario) {
      // This logic had to be made more complex since some users were using commas in the url path
      // So we cannot simply just split on a comma

      var directive_match = scenario[0].match(/(.+),\s*(\w+)\s*$/),
      // getting the mq has gotten a bit complicated since we started accounting for several use cases
      // of URLs. For now we'll continue to match these scenarios, but we may consider having these scenarios
      // as nested objects or arrays in F6.
      // regex: match everything before close parenthesis for mq
      media_query         = scenario[1].match(/(.*)\)/);

      if (directive_match) {
        var path  = directive_match[1],
        directive = directive_match[2];

      } else {
        var cached_split = scenario[0].split(/,\s*$/),
        path             = cached_split[0],
        directive        = '';
      }

      return [this.trim(path), this.convert_directive(directive), this.trim(media_query[1])];
    },

    object : function (el) {
      var raw_arr = this.parse_data_attr(el),
          scenarios = [],
          i = raw_arr.length;

      if (i > 0) {
        while (i--) {
          // split array between comma delimited content and mq
          // regex: comma, optional space, open parenthesis
          var scenario = raw_arr[i].split(/,\s?\(/);

          if (scenario.length > 1) {
            var params = this.parse_scenario(scenario);
            scenarios.push(params);
          }
        }
      }

      return this.store(el, scenarios);
    },

    store : function (el, scenarios) {
      var uuid = this.random_str(),
          current_uuid = el.data(this.add_namespace('uuid', true));

      if (this.cache[current_uuid]) {
        return this.cache[current_uuid];
      }

      el.attr(this.add_namespace('data-uuid'), uuid);
      return this.cache[uuid] = scenarios;
    },

    trim : function (str) {

      if (typeof str === 'string') {
        return $.trim(str);
      }

      return str;
    },

    set_data_attr : function (init) {
      if (init) {
        if (this.namespace.length > 0) {
          return this.namespace + '-' + this.settings.load_attr;
        }

        return this.settings.load_attr;
      }

      if (this.namespace.length > 0) {
        return 'data-' + this.namespace + '-' + this.settings.load_attr;
      }

      return 'data-' + this.settings.load_attr;
    },

    parse_data_attr : function (el) {
      var raw = el.attr(this.attr_name()).split(/\[(.*?)\]/),
          i = raw.length,
          output = [];

      while (i--) {
        if (raw[i].replace(/[\W\d]+/, '').length > 4) {
          output.push(raw[i]);
        }
      }

      return output;
    },

    reflow : function () {
      this.load('images', true);
      this.load('nodes', true);
    }

  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  var Modernizr = Modernizr || false;

  Foundation.libs.joyride = {
    name : 'joyride',

    version : '5.5.2',

    defaults : {
      expose                   : false,     // turn on or off the expose feature
      modal                    : true,      // Whether to cover page with modal during the tour
      keyboard                 : true,      // enable left, right and esc keystrokes
      tip_location             : 'bottom',  // 'top' or 'bottom' in relation to parent
      nub_position             : 'auto',    // override on a per tooltip bases
      scroll_speed             : 1500,      // Page scrolling speed in milliseconds, 0 = no scroll animation
      scroll_animation         : 'linear',  // supports 'swing' and 'linear', extend with jQuery UI.
      timer                    : 0,         // 0 = no timer , all other numbers = timer in milliseconds
      start_timer_on_click     : true,      // true or false - true requires clicking the first button start the timer
      start_offset             : 0,         // the index of the tooltip you want to start on (index of the li)
      next_button              : true,      // true or false to control whether a next button is used
      prev_button              : true,      // true or false to control whether a prev button is used
      tip_animation            : 'fade',    // 'pop' or 'fade' in each tip
      pause_after              : [],        // array of indexes where to pause the tour after
      exposed                  : [],        // array of expose elements
      tip_animation_fade_speed : 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      cookie_monster           : false,     // true or false to control whether cookies are used
      cookie_name              : 'joyride', // Name the cookie you'll use
      cookie_domain            : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
      cookie_expires           : 365,       // set when you would like the cookie to expire.
      tip_container            : 'body',    // Where will the tip be attached
      abort_on_close           : true,      // When true, the close event will not fire any callback
      tip_location_patterns    : {
        top : ['bottom'],
        bottom : [], // bottom should not need to be repositioned
        left : ['right', 'top', 'bottom'],
        right : ['left', 'top', 'bottom']
      },
      post_ride_callback     : function () {},    // A method to call once the tour closes (canceled or complete)
      post_step_callback     : function () {},    // A method to call after each step
      pre_step_callback      : function () {},    // A method to call before each step
      pre_ride_callback      : function () {},    // A method to call before the tour starts (passed index, tip, and cloned exposed element)
      post_expose_callback   : function () {},    // A method to call after an element has been exposed
      template : { // HTML segments for tip layout
        link          : '<a href="#close" class="joyride-close-tip">&times;</a>',
        timer         : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
        tip           : '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
        wrapper       : '<div class="joyride-content-wrapper"></div>',
        button        : '<a href="#" class="small button joyride-next-tip"></a>',
        prev_button   : '<a href="#" class="small button joyride-prev-tip"></a>',
        modal         : '<div class="joyride-modal-bg"></div>',
        expose        : '<div class="joyride-expose-wrapper"></div>',
        expose_cover  : '<div class="joyride-expose-cover"></div>'
      },
      expose_add_class : '' // One or more space-separated class names to be added to exposed element
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle random_str');

      this.settings = this.settings || $.extend({}, this.defaults, (options || method));

      this.bindings(method, options)
    },

    go_next : function () {
      if (this.settings.$li.next().length < 1) {
        this.end();
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show();
        this.startTimer();
      } else {
        this.hide();
        this.show();
      }
    },

    go_prev : function () {
      if (this.settings.$li.prev().length < 1) {
        // Do nothing if there are no prev element
      } else if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
        this.hide();
        this.show(null, true);
        this.startTimer();
      } else {
        this.hide();
        this.show(null, true);
      }
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.joyride')
        .on('click.fndtn.joyride', '.joyride-next-tip, .joyride-modal-bg', function (e) {
          e.preventDefault();
          this.go_next()
        }.bind(this))
        .on('click.fndtn.joyride', '.joyride-prev-tip', function (e) {
          e.preventDefault();
          this.go_prev();
        }.bind(this))

        .on('click.fndtn.joyride', '.joyride-close-tip', function (e) {
          e.preventDefault();
          this.end(this.settings.abort_on_close);
        }.bind(this))

        .on('keyup.fndtn.joyride', function (e) {
          // Don't do anything if keystrokes are disabled
          // or if the joyride is not being shown
          if (!this.settings.keyboard || !this.settings.riding) {
            return;
          }

          switch (e.which) {
            case 39: // right arrow
              e.preventDefault();
              this.go_next();
              break;
            case 37: // left arrow
              e.preventDefault();
              this.go_prev();
              break;
            case 27: // escape
              e.preventDefault();
              this.end(this.settings.abort_on_close);
          }
        }.bind(this));

      $(window)
        .off('.joyride')
        .on('resize.fndtn.joyride', self.throttle(function () {
          if ($('[' + self.attr_name() + ']').length > 0 && self.settings.$next_tip && self.settings.riding) {
            if (self.settings.exposed.length > 0) {
              var $els = $(self.settings.exposed);

              $els.each(function () {
                var $this = $(this);
                self.un_expose($this);
                self.expose($this);
              });
            }

            if (self.is_phone()) {
              self.pos_phone();
            } else {
              self.pos_default(false);
            }
          }
        }, 100));
    },

    start : function () {
      var self = this,
          $this = $('[' + this.attr_name() + ']', this.scope),
          integer_settings = ['timer', 'scrollSpeed', 'startOffset', 'tipAnimationFadeSpeed', 'cookieExpires'],
          int_settings_count = integer_settings.length;

      if (!$this.length > 0) {
        return;
      }

      if (!this.settings.init) {
        this.events();
      }

      this.settings = $this.data(this.attr_name(true) + '-init');

      // non configureable settings
      this.settings.$content_el = $this;
      this.settings.$body = $(this.settings.tip_container);
      this.settings.body_offset = $(this.settings.tip_container).position();
      this.settings.$tip_content = this.settings.$content_el.find('> li');
      this.settings.paused = false;
      this.settings.attempts = 0;
      this.settings.riding = true;

      // can we create cookies?
      if (typeof $.cookie !== 'function') {
        this.settings.cookie_monster = false;
      }

      // generate the tips and insert into dom.
      if (!this.settings.cookie_monster || this.settings.cookie_monster && !$.cookie(this.settings.cookie_name)) {
        this.settings.$tip_content.each(function (index) {
          var $this = $(this);
          this.settings = $.extend({}, self.defaults, self.data_options($this));

          // Make sure that settings parsed from data_options are integers where necessary
          var i = int_settings_count;
          while (i--) {
            self.settings[integer_settings[i]] = parseInt(self.settings[integer_settings[i]], 10);
          }
          self.create({$li : $this, index : index});
        });

        // show first tip
        if (!this.settings.start_timer_on_click && this.settings.timer > 0) {
          this.show('init');
          this.startTimer();
        } else {
          this.show('init');
        }

      }
    },

    resume : function () {
      this.set_li();
      this.show();
    },

    tip_template : function (opts) {
      var $blank, content;

      opts.tip_class = opts.tip_class || '';

      $blank = $(this.settings.template.tip).addClass(opts.tip_class);
      content = $.trim($(opts.li).html()) +
        this.prev_button_text(opts.prev_button_text, opts.index) +
        this.button_text(opts.button_text) +
        this.settings.template.link +
        this.timer_instance(opts.index);

      $blank.append($(this.settings.template.wrapper));
      $blank.first().attr(this.add_namespace('data-index'), opts.index);
      $('.joyride-content-wrapper', $blank).append(content);

      return $blank[0];
    },

    timer_instance : function (index) {
      var txt;

      if ((index === 0 && this.settings.start_timer_on_click && this.settings.timer > 0) || this.settings.timer === 0) {
        txt = '';
      } else {
        txt = $(this.settings.template.timer)[0].outerHTML;
      }
      return txt;
    },

    button_text : function (txt) {
      if (this.settings.tip_settings.next_button) {
        txt = $.trim(txt) || 'Next';
        txt = $(this.settings.template.button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },

    prev_button_text : function (txt, idx) {
      if (this.settings.tip_settings.prev_button) {
        txt = $.trim(txt) || 'Previous';

        // Add the disabled class to the button if it's the first element
        if (idx == 0) {
          txt = $(this.settings.template.prev_button).append(txt).addClass('disabled')[0].outerHTML;
        } else {
          txt = $(this.settings.template.prev_button).append(txt)[0].outerHTML;
        }
      } else {
        txt = '';
      }
      return txt;
    },

    create : function (opts) {
      this.settings.tip_settings = $.extend({}, this.settings, this.data_options(opts.$li));
      var buttonText = opts.$li.attr(this.add_namespace('data-button')) || opts.$li.attr(this.add_namespace('data-text')),
          prevButtonText = opts.$li.attr(this.add_namespace('data-button-prev')) || opts.$li.attr(this.add_namespace('data-prev-text')),
        tipClass = opts.$li.attr('class'),
        $tip_content = $(this.tip_template({
          tip_class : tipClass,
          index : opts.index,
          button_text : buttonText,
          prev_button_text : prevButtonText,
          li : opts.$li
        }));

      $(this.settings.tip_container).append($tip_content);
    },

    show : function (init, is_prev) {
      var $timer = null;

      // are we paused?
      if (this.settings.$li === undefined || ($.inArray(this.settings.$li.index(), this.settings.pause_after) === -1)) {

        // don't go to the next li if the tour was paused
        if (this.settings.paused) {
          this.settings.paused = false;
        } else {
          this.set_li(init, is_prev);
        }

        this.settings.attempts = 0;

        if (this.settings.$li.length && this.settings.$target.length > 0) {
          if (init) { //run when we first start
            this.settings.pre_ride_callback(this.settings.$li.index(), this.settings.$next_tip);
            if (this.settings.modal) {
              this.show_modal();
            }
          }

          this.settings.pre_step_callback(this.settings.$li.index(), this.settings.$next_tip);

          if (this.settings.modal && this.settings.expose) {
            this.expose();
          }

          this.settings.tip_settings = $.extend({}, this.settings, this.data_options(this.settings.$li));

          this.settings.timer = parseInt(this.settings.timer, 10);

          this.settings.tip_settings.tip_location_pattern = this.settings.tip_location_patterns[this.settings.tip_settings.tip_location];

          // scroll and hide bg if not modal
          if (!/body/i.test(this.settings.$target.selector)) {
            var joyridemodalbg = $('.joyride-modal-bg');
            if (/pop/i.test(this.settings.tipAnimation)) {
                joyridemodalbg.hide();
            } else {
                joyridemodalbg.fadeOut(this.settings.tipAnimationFadeSpeed);
            }
            this.scroll_to();
          }

          if (this.is_phone()) {
            this.pos_phone(true);
          } else {
            this.pos_default(true);
          }

          $timer = this.settings.$next_tip.find('.joyride-timer-indicator');

          if (/pop/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip.show();

              setTimeout(function () {
                $timer.animate({
                  width : $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);

            } else {
              this.settings.$next_tip.show();

            }

          } else if (/fade/i.test(this.settings.tip_animation)) {

            $timer.width(0);

            if (this.settings.timer > 0) {

              this.settings.$next_tip
                .fadeIn(this.settings.tip_animation_fade_speed)
                .show();

              setTimeout(function () {
                $timer.animate({
                  width : $timer.parent().width()
                }, this.settings.timer, 'linear');
              }.bind(this), this.settings.tip_animation_fade_speed);

            } else {
              this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed);
            }
          }

          this.settings.$current_tip = this.settings.$next_tip;

        // skip non-existant targets
        } else if (this.settings.$li && this.settings.$target.length < 1) {

          this.show(init, is_prev);

        } else {

          this.end();

        }
      } else {

        this.settings.paused = true;

      }

    },

    is_phone : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    hide : function () {
      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      if (!this.settings.modal) {
        $('.joyride-modal-bg').hide();
      }

      // Prevent scroll bouncing...wait to remove from layout
      this.settings.$current_tip.css('visibility', 'hidden');
      setTimeout($.proxy(function () {
        this.hide();
        this.css('visibility', 'visible');
      }, this.settings.$current_tip), 0);
      this.settings.post_step_callback(this.settings.$li.index(),
        this.settings.$current_tip);
    },

    set_li : function (init, is_prev) {
      if (init) {
        this.settings.$li = this.settings.$tip_content.eq(this.settings.start_offset);
        this.set_next_tip();
        this.settings.$current_tip = this.settings.$next_tip;
      } else {
        if (is_prev) {
          this.settings.$li = this.settings.$li.prev();
        } else {
          this.settings.$li = this.settings.$li.next();
        }
        this.set_next_tip();
      }

      this.set_target();
    },

    set_next_tip : function () {
      this.settings.$next_tip = $('.joyride-tip-guide').eq(this.settings.$li.index());
      this.settings.$next_tip.data('closed', '');
    },

    set_target : function () {
      var cl = this.settings.$li.attr(this.add_namespace('data-class')),
          id = this.settings.$li.attr(this.add_namespace('data-id')),
          $sel = function () {
            if (id) {
              return $(document.getElementById(id));
            } else if (cl) {
              return $('.' + cl).first();
            } else {
              return $('body');
            }
          };

      this.settings.$target = $sel();
    },

    scroll_to : function () {
      var window_half, tipOffset;

      window_half = $(window).height() / 2;
      tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight());

      if (tipOffset != 0) {
        $('html, body').stop().animate({
          scrollTop : tipOffset
        }, this.settings.scroll_speed, 'swing');
      }
    },

    paused : function () {
      return ($.inArray((this.settings.$li.index() + 1), this.settings.pause_after) === -1);
    },

    restart : function () {
      this.hide();
      this.settings.$li = undefined;
      this.show('init');
    },

    pos_default : function (init) {
      var $nub = this.settings.$next_tip.find('.joyride-nub'),
          nub_width = Math.ceil($nub.outerWidth() / 2),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      // tip must not be "display: none" to calculate position
      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {
          var topAdjustment = this.settings.tip_settings.tipAdjustmentY ? parseInt(this.settings.tip_settings.tipAdjustmentY) : 0,
              leftAdjustment = this.settings.tip_settings.tipAdjustmentX ? parseInt(this.settings.tip_settings.tipAdjustmentX) : 0;

          if (this.bottom()) {
            if (this.rtl) {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment),
                left : this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth() + leftAdjustment});
            } else {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top + nub_height + this.settings.$target.outerHeight() + topAdjustment),
                left : this.settings.$target.offset().left + leftAdjustment});
            }

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'top');

          } else if (this.top()) {
            if (this.rtl) {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment),
                left : this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth()});
            } else {
              this.settings.$next_tip.css({
                top : (this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - nub_height + topAdjustment),
                left : this.settings.$target.offset().left + leftAdjustment});
            }

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'bottom');

          } else if (this.right()) {

            this.settings.$next_tip.css({
              top : this.settings.$target.offset().top + topAdjustment,
              left : (this.settings.$target.outerWidth() + this.settings.$target.offset().left + nub_width + leftAdjustment)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'left');

          } else if (this.left()) {

            this.settings.$next_tip.css({
              top : this.settings.$target.offset().top + topAdjustment,
              left : (this.settings.$target.offset().left - this.settings.$next_tip.outerWidth() - nub_width + leftAdjustment)});

            this.nub_position($nub, this.settings.tip_settings.nub_position, 'right');

          }

          if (!this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tip_settings.tip_location_pattern.length) {

            $nub.removeClass('bottom')
              .removeClass('top')
              .removeClass('right')
              .removeClass('left');

            this.settings.tip_settings.tip_location = this.settings.tip_settings.tip_location_pattern[this.settings.attempts];

            this.settings.attempts++;

            this.pos_default();

          }

      } else if (this.settings.$li.length) {

        this.pos_modal($nub);

      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }

    },

    pos_phone : function (init) {
      var tip_height = this.settings.$next_tip.outerHeight(),
          tip_offset = this.settings.$next_tip.offset(),
          target_height = this.settings.$target.outerHeight(),
          $nub = $('.joyride-nub', this.settings.$next_tip),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          toggle = init || false;

      $nub.removeClass('bottom')
        .removeClass('top')
        .removeClass('right')
        .removeClass('left');

      if (toggle) {
        this.settings.$next_tip.css('visibility', 'hidden');
        this.settings.$next_tip.show();
      }

      if (!/body/i.test(this.settings.$target.selector)) {

        if (this.top()) {

            this.settings.$next_tip.offset({top : this.settings.$target.offset().top - tip_height - nub_height});
            $nub.addClass('bottom');

        } else {

          this.settings.$next_tip.offset({top : this.settings.$target.offset().top + target_height + nub_height});
          $nub.addClass('top');

        }

      } else if (this.settings.$li.length) {
        this.pos_modal($nub);
      }

      if (toggle) {
        this.settings.$next_tip.hide();
        this.settings.$next_tip.css('visibility', 'visible');
      }
    },

    pos_modal : function ($nub) {
      this.center();
      $nub.hide();

      this.show_modal();
    },

    show_modal : function () {
      if (!this.settings.$next_tip.data('closed')) {
        var joyridemodalbg =  $('.joyride-modal-bg');
        if (joyridemodalbg.length < 1) {
          var joyridemodalbg = $(this.settings.template.modal);
          joyridemodalbg.appendTo('body');
        }

        if (/pop/i.test(this.settings.tip_animation)) {
            joyridemodalbg.show();
        } else {
            joyridemodalbg.fadeIn(this.settings.tip_animation_fade_speed);
        }
      }
    },

    expose : function () {
      var expose,
          exposeCover,
          el,
          origCSS,
          origClasses,
          randId = 'expose-' + this.random_str(6);

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }

      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      expose = $(this.settings.template.expose);
      this.settings.$body.append(expose);
      expose.css({
        top : el.offset().top,
        left : el.offset().left,
        width : el.outerWidth(true),
        height : el.outerHeight(true)
      });

      exposeCover = $(this.settings.template.expose_cover);

      origCSS = {
        zIndex : el.css('z-index'),
        position : el.css('position')
      };

      origClasses = el.attr('class') == null ? '' : el.attr('class');

      el.css('z-index', parseInt(expose.css('z-index')) + 1);

      if (origCSS.position == 'static') {
        el.css('position', 'relative');
      }

      el.data('expose-css', origCSS);
      el.data('orig-class', origClasses);
      el.attr('class', origClasses + ' ' + this.settings.expose_add_class);

      exposeCover.css({
        top : el.offset().top,
        left : el.offset().left,
        width : el.outerWidth(true),
        height : el.outerHeight(true)
      });

      if (this.settings.modal) {
        this.show_modal();
      }

      this.settings.$body.append(exposeCover);
      expose.addClass(randId);
      exposeCover.addClass(randId);
      el.data('expose', randId);
      this.settings.post_expose_callback(this.settings.$li.index(), this.settings.$next_tip, el);
      this.add_exposed(el);
    },

    un_expose : function () {
      var exposeId,
          el,
          expose,
          origCSS,
          origClasses,
          clearAll = false;

      if (arguments.length > 0 && arguments[0] instanceof $) {
        el = arguments[0];
      } else if (this.settings.$target && !/body/i.test(this.settings.$target.selector)) {
        el = this.settings.$target;
      } else {
        return false;
      }

      if (el.length < 1) {
        if (window.console) {
          console.error('element not valid', el);
        }
        return false;
      }

      exposeId = el.data('expose');
      expose = $('.' + exposeId);

      if (arguments.length > 1) {
        clearAll = arguments[1];
      }

      if (clearAll === true) {
        $('.joyride-expose-wrapper,.joyride-expose-cover').remove();
      } else {
        expose.remove();
      }

      origCSS = el.data('expose-css');

      if (origCSS.zIndex == 'auto') {
        el.css('z-index', '');
      } else {
        el.css('z-index', origCSS.zIndex);
      }

      if (origCSS.position != el.css('position')) {
        if (origCSS.position == 'static') {// this is default, no need to set it.
          el.css('position', '');
        } else {
          el.css('position', origCSS.position);
        }
      }

      origClasses = el.data('orig-class');
      el.attr('class', origClasses);
      el.removeData('orig-classes');

      el.removeData('expose');
      el.removeData('expose-z-index');
      this.remove_exposed(el);
    },

    add_exposed : function (el) {
      this.settings.exposed = this.settings.exposed || [];
      if (el instanceof $ || typeof el === 'object') {
        this.settings.exposed.push(el[0]);
      } else if (typeof el == 'string') {
        this.settings.exposed.push(el);
      }
    },

    remove_exposed : function (el) {
      var search, i;
      if (el instanceof $) {
        search = el[0]
      } else if (typeof el == 'string') {
        search = el;
      }

      this.settings.exposed = this.settings.exposed || [];
      i = this.settings.exposed.length;

      while (i--) {
        if (this.settings.exposed[i] == search) {
          this.settings.exposed.splice(i, 1);
          return;
        }
      }
    },

    center : function () {
      var $w = $(window);

      this.settings.$next_tip.css({
        top : ((($w.height() - this.settings.$next_tip.outerHeight()) / 2) + $w.scrollTop()),
        left : ((($w.width() - this.settings.$next_tip.outerWidth()) / 2) + $w.scrollLeft())
      });

      return true;
    },

    bottom : function () {
      return /bottom/i.test(this.settings.tip_settings.tip_location);
    },

    top : function () {
      return /top/i.test(this.settings.tip_settings.tip_location);
    },

    right : function () {
      return /right/i.test(this.settings.tip_settings.tip_location);
    },

    left : function () {
      return /left/i.test(this.settings.tip_settings.tip_location);
    },

    corners : function (el) {
      var w = $(window),
          window_half = w.height() / 2,
          //using this to calculate since scroll may not have finished yet.
          tipOffset = Math.ceil(this.settings.$target.offset().top - window_half + this.settings.$next_tip.outerHeight()),
          right = w.width() + w.scrollLeft(),
          offsetBottom =  w.height() + tipOffset,
          bottom = w.height() + w.scrollTop(),
          top = w.scrollTop();

      if (tipOffset < top) {
        if (tipOffset < 0) {
          top = 0;
        } else {
          top = tipOffset;
        }
      }

      if (offsetBottom > bottom) {
        bottom = offsetBottom;
      }

      return [
        el.offset().top < top,
        right < el.offset().left + el.outerWidth(),
        bottom < el.offset().top + el.outerHeight(),
        w.scrollLeft() > el.offset().left
      ];
    },

    visible : function (hidden_corners) {
      var i = hidden_corners.length;

      while (i--) {
        if (hidden_corners[i]) {
          return false;
        }
      }

      return true;
    },

    nub_position : function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },

    startTimer : function () {
      if (this.settings.$li.length) {
        this.settings.automate = setTimeout(function () {
          this.hide();
          this.show();
          this.startTimer();
        }.bind(this), this.settings.timer);
      } else {
        clearTimeout(this.settings.automate);
      }
    },

    end : function (abort) {
      if (this.settings.cookie_monster) {
        $.cookie(this.settings.cookie_name, 'ridden', {expires : this.settings.cookie_expires, domain : this.settings.cookie_domain});
      }

      if (this.settings.timer > 0) {
        clearTimeout(this.settings.automate);
      }

      if (this.settings.modal && this.settings.expose) {
        this.un_expose();
      }

      // Unplug keystrokes listener
      $(this.scope).off('keyup.joyride')

      this.settings.$next_tip.data('closed', true);
      this.settings.riding = false;

      $('.joyride-modal-bg').hide();
      this.settings.$current_tip.hide();

      if (typeof abort === 'undefined' || abort === false) {
        this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip);
        this.settings.post_ride_callback(this.settings.$li.index(), this.settings.$current_tip);
      }

      $('.joyride-tip-guide').remove();
    },

    off : function () {
      $(this.scope).off('.joyride');
      $(window).off('.joyride');
      $('.joyride-close-tip, .joyride-next-tip, .joyride-modal-bg').off('.joyride');
      $('.joyride-tip-guide, .joyride-modal-bg').remove();
      clearTimeout(this.settings.automate);
      this.settings = {};
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs['magellan-expedition'] = {
    name : 'magellan-expedition',

    version : '5.5.2',

    settings : {
      active_class : 'active',
      threshold : 0, // pixels from the top of the expedition for it to become fixes
      destination_threshold : 20, // pixels from the top of destination for it to be considered active
      throttle_delay : 30, // calculation throttling to increase framerate
      fixed_top : 0, // top distance in pixels assigend to the fixed element on scroll
      offset_by_height : true,  // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
      duration : 700, // animation duration time
      easing : 'swing' // animation easing
    },

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = self.S,
          settings = self.settings;

      // initialize expedition offset
      self.set_expedition_position();

      S(self.scope)
        .off('.magellan')
        .on('click.fndtn.magellan', '[' + self.add_namespace('data-magellan-arrival') + '] a[href*=#]', function (e) {
          var sameHost = ((this.hostname === location.hostname) || !this.hostname),
              samePath = self.filterPathname(location.pathname) === self.filterPathname(this.pathname),
              testHash = this.hash.replace(/(:|\.|\/)/g, '\\$1'),
              anchor = this;

          if (sameHost && samePath && testHash) {
            e.preventDefault();
            var expedition = $(this).closest('[' + self.attr_name() + ']'),
                settings = expedition.data('magellan-expedition-init'),
                hash = this.hash.split('#').join(''),
                target = $('a[name="' + hash + '"]');

            if (target.length === 0) {
              target = $('#' + hash);

            }

            // Account for expedition height if fixed position
            var scroll_top = target.offset().top - settings.destination_threshold + 1;
            if (settings.offset_by_height) {
              scroll_top = scroll_top - expedition.outerHeight();
            }
            $('html, body').stop().animate({
              'scrollTop' : scroll_top
            }, settings.duration, settings.easing, function () {
              if (history.pushState) {
                        history.pushState(null, null, anchor.pathname + '#' + hash);
              }
                    else {
                        location.hash = anchor.pathname + '#' + hash;
                    }
            });
          }
        })
        .on('scroll.fndtn.magellan', self.throttle(this.check_for_arrivals.bind(this), settings.throttle_delay));
    },

    check_for_arrivals : function () {
      var self = this;
      self.update_arrivals();
      self.update_expedition_positions();
    },

    set_expedition_position : function () {
      var self = this;
      $('[' + this.attr_name() + '=fixed]', self.scope).each(function (idx, el) {
        var expedition = $(this),
            settings = expedition.data('magellan-expedition-init'),
            styles = expedition.attr('styles'), // save styles
            top_offset, fixed_top;

        expedition.attr('style', '');
        top_offset = expedition.offset().top + settings.threshold;

        //set fixed-top by attribute
        fixed_top = parseInt(expedition.data('magellan-fixed-top'));
        if (!isNaN(fixed_top)) {
          self.settings.fixed_top = fixed_top;
        }

        expedition.data(self.data_attr('magellan-top-offset'), top_offset);
        expedition.attr('style', styles);
      });
    },

    update_expedition_positions : function () {
      var self = this,
          window_top_offset = $(window).scrollTop();

      $('[' + this.attr_name() + '=fixed]', self.scope).each(function () {
        var expedition = $(this),
            settings = expedition.data('magellan-expedition-init'),
            styles = expedition.attr('style'), // save styles
            top_offset = expedition.data('magellan-top-offset');

        //scroll to the top distance
        if (window_top_offset + self.settings.fixed_top >= top_offset) {
          // Placeholder allows height calculations to be consistent even when
          // appearing to switch between fixed/non-fixed placement
          var placeholder = expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']');
          if (placeholder.length === 0) {
            placeholder = expedition.clone();
            placeholder.removeAttr(self.attr_name());
            placeholder.attr(self.add_namespace('data-magellan-expedition-clone'), '');
            expedition.before(placeholder);
          }
          expedition.css({position :'fixed', top : settings.fixed_top}).addClass('fixed');
        } else {
          expedition.prev('[' + self.add_namespace('data-magellan-expedition-clone') + ']').remove();
          expedition.attr('style', styles).css('position', '').css('top', '').removeClass('fixed');
        }
      });
    },

    update_arrivals : function () {
      var self = this,
          window_top_offset = $(window).scrollTop();

      $('[' + this.attr_name() + ']', self.scope).each(function () {
        var expedition = $(this),
            settings = expedition.data(self.attr_name(true) + '-init'),
            offsets = self.offsets(expedition, window_top_offset),
            arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']'),
            active_item = false;
        offsets.each(function (idx, item) {
          if (item.viewport_offset >= item.top_offset) {
            var arrivals = expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']');
            arrivals.not(item.arrival).removeClass(settings.active_class);
            item.arrival.addClass(settings.active_class);
            active_item = true;
            return true;
          }
        });

        if (!active_item) {
          arrivals.removeClass(settings.active_class);
        }
      });
    },

    offsets : function (expedition, window_offset) {
      var self = this,
          settings = expedition.data(self.attr_name(true) + '-init'),
          viewport_offset = window_offset;

      return expedition.find('[' + self.add_namespace('data-magellan-arrival') + ']').map(function (idx, el) {
        var name = $(this).data(self.data_attr('magellan-arrival')),
            dest = $('[' + self.add_namespace('data-magellan-destination') + '=' + name + ']');
        if (dest.length > 0) {
          var top_offset = dest.offset().top - settings.destination_threshold;
          if (settings.offset_by_height) {
            top_offset = top_offset - expedition.outerHeight();
          }
          top_offset = Math.floor(top_offset);
          return {
            destination : dest,
            arrival : $(this),
            top_offset : top_offset,
            viewport_offset : viewport_offset
          }
        }
      }).sort(function (a, b) {
        if (a.top_offset < b.top_offset) {
          return -1;
        }
        if (a.top_offset > b.top_offset) {
          return 1;
        }
        return 0;
      });
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    off : function () {
      this.S(this.scope).off('.magellan');
      this.S(window).off('.magellan');
    },

    filterPathname : function (pathname) {
      pathname = pathname || '';
      return pathname
          .replace(/^\//,'')
          .replace(/(?:index|default).[a-zA-Z]{3,4}$/,'')
          .replace(/\/$/,'');
    },

    reflow : function () {
      var self = this;
      // remove placeholder expeditions used for height calculation purposes
      $('[' + self.add_namespace('data-magellan-expedition-clone') + ']', self.scope).remove();
    }
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.offcanvas = {
    name : 'offcanvas',

    version : '5.5.2',

    settings : {
      open_method : 'move',
      close_on_click : false
    },

    init : function (scope, method, options) {
      this.bindings(method, options);
    },

    events : function () {
      var self = this,
          S = self.S,
          move_class = '',
          right_postfix = '',
          left_postfix = '';

      if (this.settings.open_method === 'move') {
        move_class = 'move-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap_single') {
        move_class = 'offcanvas-overlap-';
        right_postfix = 'right';
        left_postfix = 'left';
      } else if (this.settings.open_method === 'overlap') {
        move_class = 'offcanvas-overlap';
      }

      S(this.scope).off('.offcanvas')
        .on('click.fndtn.offcanvas', '.left-off-canvas-toggle', function (e) {
          self.click_toggle_class(e, move_class + right_postfix);
          if (self.settings.open_method !== 'overlap') {
            S('.left-submenu').removeClass(move_class + right_postfix);
          }
          $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.left-off-canvas-menu a', function (e) {
          var settings = self.get_settings(e);
          var parent = S(this).parent();

          if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
            self.hide.call(self, move_class + right_postfix, self.get_wrapper(e));
            parent.parent().removeClass(move_class + right_postfix);
          } else if (S(this).parent().hasClass('has-submenu')) {
            e.preventDefault();
            S(this).siblings('.left-submenu').toggleClass(move_class + right_postfix);
          } else if (parent.hasClass('back')) {
            e.preventDefault();
            parent.parent().removeClass(move_class + right_postfix);
          }
          $('.left-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-toggle', function (e) {
          self.click_toggle_class(e, move_class + left_postfix);
          if (self.settings.open_method !== 'overlap') {
            S('.right-submenu').removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.right-off-canvas-menu a', function (e) {
          var settings = self.get_settings(e);
          var parent = S(this).parent();

          if (settings.close_on_click && !parent.hasClass('has-submenu') && !parent.hasClass('back')) {
            self.hide.call(self, move_class + left_postfix, self.get_wrapper(e));
            parent.parent().removeClass(move_class + left_postfix);
          } else if (S(this).parent().hasClass('has-submenu')) {
            e.preventDefault();
            S(this).siblings('.right-submenu').toggleClass(move_class + left_postfix);
          } else if (parent.hasClass('back')) {
            e.preventDefault();
            parent.parent().removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          self.click_remove_class(e, move_class + left_postfix);
          S('.right-submenu').removeClass(move_class + left_postfix);
          if (right_postfix) {
            self.click_remove_class(e, move_class + right_postfix);
            S('.left-submenu').removeClass(move_class + left_postfix);
          }
          $('.right-off-canvas-toggle').attr('aria-expanded', 'true');
        })
        .on('click.fndtn.offcanvas', '.exit-off-canvas', function (e) {
          self.click_remove_class(e, move_class + left_postfix);
          $('.left-off-canvas-toggle').attr('aria-expanded', 'false');
          if (right_postfix) {
            self.click_remove_class(e, move_class + right_postfix);
            $('.right-off-canvas-toggle').attr('aria-expanded', 'false');
          }
        });
    },

    toggle : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      if ($off_canvas.is('.' + class_name)) {
        this.hide(class_name, $off_canvas);
      } else {
        this.show(class_name, $off_canvas);
      }
    },

    show : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('open.fndtn.offcanvas');
      $off_canvas.addClass(class_name);
    },

    hide : function (class_name, $off_canvas) {
      $off_canvas = $off_canvas || this.get_wrapper();
      $off_canvas.trigger('close.fndtn.offcanvas');
      $off_canvas.removeClass(class_name);
    },

    click_toggle_class : function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.toggle(class_name, $off_canvas);
    },

    click_remove_class : function (e, class_name) {
      e.preventDefault();
      var $off_canvas = this.get_wrapper(e);
      this.hide(class_name, $off_canvas);
    },

    get_settings : function (e) {
      var offcanvas  = this.S(e.target).closest('[' + this.attr_name() + ']');
      return offcanvas.data(this.attr_name(true) + '-init') || this.settings;
    },

    get_wrapper : function (e) {
      var $off_canvas = this.S(e ? e.target : this.scope).closest('.off-canvas-wrap');

      if ($off_canvas.length === 0) {
        $off_canvas = this.S('.off-canvas-wrap');
      }
      return $off_canvas;
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  var noop = function () {};

  var Orbit = function (el, settings) {
    // Don't reinitialize plugin
    if (el.hasClass(settings.slides_container_class)) {
      return this;
    }

    var self = this,
        container,
        slides_container = el,
        number_container,
        bullets_container,
        timer_container,
        idx = 0,
        animate,
        timer,
        locked = false,
        adjust_height_after = false;

    self.slides = function () {
      return slides_container.children(settings.slide_selector);
    };

    self.slides().first().addClass(settings.active_slide_class);

    self.update_slide_number = function (index) {
      if (settings.slide_number) {
        number_container.find('span:first').text(parseInt(index) + 1);
        number_container.find('span:last').text(self.slides().length);
      }
      if (settings.bullets) {
        bullets_container.children().removeClass(settings.bullets_active_class);
        $(bullets_container.children().get(index)).addClass(settings.bullets_active_class);
      }
    };

    self.update_active_link = function (index) {
      var link = $('[data-orbit-link="' + self.slides().eq(index).attr('data-orbit-slide') + '"]');
      link.siblings().removeClass(settings.bullets_active_class);
      link.addClass(settings.bullets_active_class);
    };

    self.build_markup = function () {
      slides_container.wrap('<div class="' + settings.container_class + '"></div>');
      container = slides_container.parent();
      slides_container.addClass(settings.slides_container_class);

      if (settings.stack_on_small) {
        container.addClass(settings.stack_on_small_class);
      }

      if (settings.navigation_arrows) {
        container.append($('<a href="#"><span></span></a>').addClass(settings.prev_class));
        container.append($('<a href="#"><span></span></a>').addClass(settings.next_class));
      }

      if (settings.timer) {
        timer_container = $('<div>').addClass(settings.timer_container_class);
        timer_container.append('<span>');
        timer_container.append($('<div>').addClass(settings.timer_progress_class));
        timer_container.addClass(settings.timer_paused_class);
        container.append(timer_container);
      }

      if (settings.slide_number) {
        number_container = $('<div>').addClass(settings.slide_number_class);
        number_container.append('<span></span> ' + settings.slide_number_text + ' <span></span>');
        container.append(number_container);
      }

      if (settings.bullets) {
        bullets_container = $('<ol>').addClass(settings.bullets_container_class);
        container.append(bullets_container);
        bullets_container.wrap('<div class="orbit-bullets-container"></div>');
        self.slides().each(function (idx, el) {
          var bullet = $('<li>').attr('data-orbit-slide', idx).on('click', self.link_bullet);;
          bullets_container.append(bullet);
        });
      }

    };

    self._goto = function (next_idx, start_timer) {
      // if (locked) {return false;}
      if (next_idx === idx) {return false;}
      if (typeof timer === 'object') {timer.restart();}
      var slides = self.slides();

      var dir = 'next';
      locked = true;
      if (next_idx < idx) {dir = 'prev';}
      if (next_idx >= slides.length) {
        if (!settings.circular) {
          return false;
        }
        next_idx = 0;
      } else if (next_idx < 0) {
        if (!settings.circular) {
          return false;
        }
        next_idx = slides.length - 1;
      }

      var current = $(slides.get(idx));
      var next = $(slides.get(next_idx));

      current.css('zIndex', 2);
      current.removeClass(settings.active_slide_class);
      next.css('zIndex', 4).addClass(settings.active_slide_class);

      slides_container.trigger('before-slide-change.fndtn.orbit');
      settings.before_slide_change();
      self.update_active_link(next_idx);

      var callback = function () {
        var unlock = function () {
          idx = next_idx;
          locked = false;
          if (start_timer === true) {timer = self.create_timer(); timer.start();}
          self.update_slide_number(idx);
          slides_container.trigger('after-slide-change.fndtn.orbit', [{slide_number : idx, total_slides : slides.length}]);
          settings.after_slide_change(idx, slides.length);
        };
        if (slides_container.outerHeight() != next.outerHeight() && settings.variable_height) {
          slides_container.animate({'height': next.outerHeight()}, 250, 'linear', unlock);
        } else {
          unlock();
        }
      };

      if (slides.length === 1) {callback(); return false;}

      var start_animation = function () {
        if (dir === 'next') {animate.next(current, next, callback);}
        if (dir === 'prev') {animate.prev(current, next, callback);}
      };

      if (next.outerHeight() > slides_container.outerHeight() && settings.variable_height) {
        slides_container.animate({'height': next.outerHeight()}, 250, 'linear', start_animation);
      } else {
        start_animation();
      }
    };

    self.next = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx + 1);
    };

    self.prev = function (e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      self._goto(idx - 1);
    };

    self.link_custom = function (e) {
      e.preventDefault();
      var link = $(this).attr('data-orbit-link');
      if ((typeof link === 'string') && (link = $.trim(link)) != '') {
        var slide = container.find('[data-orbit-slide=' + link + ']');
        if (slide.index() != -1) {self._goto(slide.index());}
      }
    };

    self.link_bullet = function (e) {
      var index = $(this).attr('data-orbit-slide');
      if ((typeof index === 'string') && (index = $.trim(index)) != '') {
        if (isNaN(parseInt(index))) {
          var slide = container.find('[data-orbit-slide=' + index + ']');
          if (slide.index() != -1) {self._goto(slide.index() + 1);}
        } else {
          self._goto(parseInt(index));
        }
      }

    }

    self.timer_callback = function () {
      self._goto(idx + 1, true);
    }

    self.compute_dimensions = function () {
      var current = $(self.slides().get(idx));
      var h = current.outerHeight();
      if (!settings.variable_height) {
        self.slides().each(function(){
          if ($(this).outerHeight() > h) { h = $(this).outerHeight(); }
        });
      }
      slides_container.height(h);
    };

    self.create_timer = function () {
      var t = new Timer(
        container.find('.' + settings.timer_container_class),
        settings,
        self.timer_callback
      );
      return t;
    };

    self.stop_timer = function () {
      if (typeof timer === 'object') {
        timer.stop();
      }
    };

    self.toggle_timer = function () {
      var t = container.find('.' + settings.timer_container_class);
      if (t.hasClass(settings.timer_paused_class)) {
        if (typeof timer === 'undefined') {timer = self.create_timer();}
        timer.start();
      } else {
        if (typeof timer === 'object') {timer.stop();}
      }
    };

    self.init = function () {
      self.build_markup();
      if (settings.timer) {
        timer = self.create_timer();
        Foundation.utils.image_loaded(this.slides().children('img'), timer.start);
      }
      animate = new FadeAnimation(settings, slides_container);
      if (settings.animation === 'slide') {
        animate = new SlideAnimation(settings, slides_container);
      }

      container.on('click', '.' + settings.next_class, self.next);
      container.on('click', '.' + settings.prev_class, self.prev);

      if (settings.next_on_click) {
        container.on('click', '.' + settings.slides_container_class + ' [data-orbit-slide]', self.link_bullet);
      }

      container.on('click', self.toggle_timer);
      if (settings.swipe) {
        container.on('touchstart.fndtn.orbit', function (e) {
          if (!e.touches) {e = e.originalEvent;}
          var data = {
            start_page_x : e.touches[0].pageX,
            start_page_y : e.touches[0].pageY,
            start_time : (new Date()).getTime(),
            delta_x : 0,
            is_scrolling : undefined
          };
          container.data('swipe-transition', data);
          e.stopPropagation();
        })
        .on('touchmove.fndtn.orbit', function (e) {
          if (!e.touches) {
            e = e.originalEvent;
          }
          // Ignore pinch/zoom events
          if (e.touches.length > 1 || e.scale && e.scale !== 1) {
            return;
          }

          var data = container.data('swipe-transition');
          if (typeof data === 'undefined') {data = {};}

          data.delta_x = e.touches[0].pageX - data.start_page_x;

          if ( typeof data.is_scrolling === 'undefined') {
            data.is_scrolling = !!( data.is_scrolling || Math.abs(data.delta_x) < Math.abs(e.touches[0].pageY - data.start_page_y) );
          }

          if (!data.is_scrolling && !data.active) {
            e.preventDefault();
            var direction = (data.delta_x < 0) ? (idx + 1) : (idx - 1);
            data.active = true;
            self._goto(direction);
          }
        })
        .on('touchend.fndtn.orbit', function (e) {
          container.data('swipe-transition', {});
          e.stopPropagation();
        })
      }
      container.on('mouseenter.fndtn.orbit', function (e) {
        if (settings.timer && settings.pause_on_hover) {
          self.stop_timer();
        }
      })
      .on('mouseleave.fndtn.orbit', function (e) {
        if (settings.timer && settings.resume_on_mouseout) {
          timer.start();
        }
      });

      $(document).on('click', '[data-orbit-link]', self.link_custom);
      $(window).on('load resize', self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), self.compute_dimensions);
      Foundation.utils.image_loaded(this.slides().children('img'), function () {
        container.prev('.' + settings.preloader_class).css('display', 'none');
        self.update_slide_number(0);
        self.update_active_link(0);
        slides_container.trigger('ready.fndtn.orbit');
      });
    };

    self.init();
  };

  var Timer = function (el, settings, callback) {
    var self = this,
        duration = settings.timer_speed,
        progress = el.find('.' + settings.timer_progress_class),
        start,
        timeout,
        left = -1;

    this.update_progress = function (w) {
      var new_progress = progress.clone();
      new_progress.attr('style', '');
      new_progress.css('width', w + '%');
      progress.replaceWith(new_progress);
      progress = new_progress;
    };

    this.restart = function () {
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      left = -1;
      self.update_progress(0);
    };

    this.start = function () {
      if (!el.hasClass(settings.timer_paused_class)) {return true;}
      left = (left === -1) ? duration : left;
      el.removeClass(settings.timer_paused_class);
      start = new Date().getTime();
      progress.animate({'width' : '100%'}, left, 'linear');
      timeout = setTimeout(function () {
        self.restart();
        callback();
      }, left);
      el.trigger('timer-started.fndtn.orbit')
    };

    this.stop = function () {
      if (el.hasClass(settings.timer_paused_class)) {return true;}
      clearTimeout(timeout);
      el.addClass(settings.timer_paused_class);
      var end = new Date().getTime();
      left = left - (end - start);
      var w = 100 - ((left / duration) * 100);
      self.update_progress(w);
      el.trigger('timer-stopped.fndtn.orbit');
    };
  };

  var SlideAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';
    var animMargin = {};
    animMargin[margin] = '0%';

    this.next = function (current, next, callback) {
      current.animate({marginLeft : '-100%'}, duration);
      next.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };

    this.prev = function (current, prev, callback) {
      current.animate({marginLeft : '100%'}, duration);
      prev.css(margin, '-100%');
      prev.animate(animMargin, duration, function () {
        current.css(margin, '100%');
        callback();
      });
    };
  };

  var FadeAnimation = function (settings, container) {
    var duration = settings.animation_speed;
    var is_rtl = ($('html[dir=rtl]').length === 1);
    var margin = is_rtl ? 'marginRight' : 'marginLeft';

    this.next = function (current, next, callback) {
      next.css({'margin' : '0%', 'opacity' : '0.01'});
      next.animate({'opacity' :'1'}, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };

    this.prev = function (current, prev, callback) {
      prev.css({'margin' : '0%', 'opacity' : '0.01'});
      prev.animate({'opacity' : '1'}, duration, 'linear', function () {
        current.css('margin', '100%');
        callback();
      });
    };
  };

  Foundation.libs = Foundation.libs || {};

  Foundation.libs.orbit = {
    name : 'orbit',

    version : '5.5.2',

    settings : {
      animation : 'slide',
      timer_speed : 10000,
      pause_on_hover : true,
      resume_on_mouseout : false,
      next_on_click : true,
      animation_speed : 500,
      stack_on_small : false,
      navigation_arrows : true,
      slide_number : true,
      slide_number_text : 'of',
      container_class : 'orbit-container',
      stack_on_small_class : 'orbit-stack-on-small',
      next_class : 'orbit-next',
      prev_class : 'orbit-prev',
      timer_container_class : 'orbit-timer',
      timer_paused_class : 'paused',
      timer_progress_class : 'orbit-progress',
      slides_container_class : 'orbit-slides-container',
      preloader_class : 'preloader',
      slide_selector : '*',
      bullets_container_class : 'orbit-bullets',
      bullets_active_class : 'active',
      slide_number_class : 'orbit-slide-number',
      caption_class : 'orbit-caption',
      active_slide_class : 'active',
      orbit_transition_class : 'orbit-transitioning',
      bullets : true,
      circular : true,
      timer : true,
      variable_height : false,
      swipe : true,
      before_slide_change : noop,
      after_slide_change : noop
    },

    init : function (scope, method, options) {
      var self = this;
      this.bindings(method, options);
    },

    events : function (instance) {
      var orbit_instance = new Orbit(this.S(instance), this.S(instance).data('orbit-init'));
      this.S(instance).data(this.name + '-instance', orbit_instance);
    },

    reflow : function () {
      var self = this;

      if (self.S(self.scope).is('[data-orbit]')) {
        var $el = self.S(self.scope);
        var instance = $el.data(self.name + '-instance');
        instance.compute_dimensions();
      } else {
        self.S('[data-orbit]', self.scope).each(function (idx, el) {
          var $el = self.S(el);
          var opts = self.data_options($el);
          var instance = $el.data(self.name + '-instance');
          instance.compute_dimensions();
        });
      }
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.reveal = {
    name : 'reveal',

    version : '5.5.2',

    locked : false,

    settings : {
      animation : 'fadeAndPop',
      animation_speed : 250,
      close_on_background_click : true,
      close_on_esc : true,
      dismiss_modal_class : 'close-reveal-modal',
      multiple_opened : false,
      bg_class : 'reveal-modal-bg',
      root_element : 'body',
      open : function(){},
      opened : function(){},
      close : function(){},
      closed : function(){},
      on_ajax_error: $.noop,
      bg : $('.reveal-modal-bg'),
      css : {
        open : {
          'opacity' : 0,
          'visibility' : 'visible',
          'display' : 'block'
        },
        close : {
          'opacity' : 1,
          'visibility' : 'hidden',
          'display' : 'none'
        }
      }
    },

    init : function (scope, method, options) {
      $.extend(true, this.settings, method, options);
      this.bindings(method, options);
    },

    events : function (scope) {
      var self = this,
          S = self.S;

      S(this.scope)
        .off('.reveal')
        .on('click.fndtn.reveal', '[' + this.add_namespace('data-reveal-id') + ']:not([disabled])', function (e) {
          e.preventDefault();

          if (!self.locked) {
            var element = S(this),
                ajax = element.data(self.data_attr('reveal-ajax')),
                replaceContentSel = element.data(self.data_attr('reveal-replace-content'));

            self.locked = true;

            if (typeof ajax === 'undefined') {
              self.open.call(self, element);
            } else {
              var url = ajax === true ? element.attr('href') : ajax;
              self.open.call(self, element, {url : url}, { replaceContentSel : replaceContentSel });
            }
          }
        });

      S(document)
        .on('click.fndtn.reveal', this.close_targets(), function (e) {
          e.preventDefault();
          if (!self.locked) {
            var settings = S('[' + self.attr_name() + '].open').data(self.attr_name(true) + '-init') || self.settings,
                bg_clicked = S(e.target)[0] === S('.' + settings.bg_class)[0];

            if (bg_clicked) {
              if (settings.close_on_background_click) {
                e.stopPropagation();
              } else {
                return;
              }
            }

            self.locked = true;
            self.close.call(self, bg_clicked ? S('[' + self.attr_name() + '].open:not(.toback)') : S(this).closest('[' + self.attr_name() + ']'));
          }
        });

      if (S('[' + self.attr_name() + ']', this.scope).length > 0) {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', this.settings.open)
          .on('opened.fndtn.reveal', this.settings.opened)
          .on('opened.fndtn.reveal', this.open_video)
          .on('close.fndtn.reveal', this.settings.close)
          .on('closed.fndtn.reveal', this.settings.closed)
          .on('closed.fndtn.reveal', this.close_video);
      } else {
        S(this.scope)
          // .off('.reveal')
          .on('open.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.open)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.opened)
          .on('opened.fndtn.reveal', '[' + self.attr_name() + ']', this.open_video)
          .on('close.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.close)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.settings.closed)
          .on('closed.fndtn.reveal', '[' + self.attr_name() + ']', this.close_video);
      }

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_on : function (scope) {
      var self = this;

      // PATCH #1: fixing multiple keyup event trigger from single key press
      self.S('body').off('keyup.fndtn.reveal').on('keyup.fndtn.reveal', function ( event ) {
        var open_modal = self.S('[' + self.attr_name() + '].open'),
            settings = open_modal.data(self.attr_name(true) + '-init') || self.settings ;
        // PATCH #2: making sure that the close event can be called only while unlocked,
        //           so that multiple keyup.fndtn.reveal events don't prevent clean closing of the reveal window.
        if ( settings && event.which === 27  && settings.close_on_esc && !self.locked) { // 27 is the keycode for the Escape key
          self.close.call(self, open_modal);
        }
      });

      return true;
    },

    // PATCH #3: turning on key up capture only when a reveal window is open
    key_up_off : function (scope) {
      this.S('body').off('keyup.fndtn.reveal');
      return true;
    },

    open : function (target, ajax_settings) {
      var self = this,
          modal;

      if (target) {
        if (typeof target.selector !== 'undefined') {
          // Find the named node; only use the first one found, since the rest of the code assumes there's only one node
          modal = self.S('#' + target.data(self.data_attr('reveal-id'))).first();
        } else {
          modal = self.S(this.scope);

          ajax_settings = target;
        }
      } else {
        modal = self.S(this.scope);
      }

      var settings = modal.data(self.attr_name(true) + '-init');
      settings = settings || this.settings;


      if (modal.hasClass('open') && target.attr('data-reveal-id') == modal.attr('id')) {
        return self.close(modal);
      }

      if (!modal.hasClass('open')) {
        var open_modal = self.S('[' + self.attr_name() + '].open');

        if (typeof modal.data('css-top') === 'undefined') {
          modal.data('css-top', parseInt(modal.css('top'), 10))
            .data('offset', this.cache_offset(modal));
        }

        modal.attr('tabindex','0').attr('aria-hidden','false');

        this.key_up_on(modal);    // PATCH #3: turning on key up capture only when a reveal window is open

        // Prevent namespace event from triggering twice
        modal.on('open.fndtn.reveal', function(e) {
          if (e.namespace !== 'fndtn.reveal') return;
        });

        modal.on('open.fndtn.reveal').trigger('open.fndtn.reveal');

        if (open_modal.length < 1) {
          this.toggle_bg(modal, true);
        }

        if (typeof ajax_settings === 'string') {
          ajax_settings = {
            url : ajax_settings
          };
        }

        if (typeof ajax_settings === 'undefined' || !ajax_settings.url) {
          if (open_modal.length > 0) {
            if (settings.multiple_opened) {
              self.to_back(open_modal);
            } else {
              self.hide(open_modal, settings.css.close);
            }
          }

          this.show(modal, settings.css.open);
        } else {
          var old_success = typeof ajax_settings.success !== 'undefined' ? ajax_settings.success : null;
          $.extend(ajax_settings, {
            success : function (data, textStatus, jqXHR) {
              if ( $.isFunction(old_success) ) {
                var result = old_success(data, textStatus, jqXHR);
                if (typeof result == 'string') {
                  data = result;
                }
              }

              if (typeof options !== 'undefined' && typeof options.replaceContentSel !== 'undefined') {
                modal.find(options.replaceContentSel).html(data);
              } else {
                modal.html(data);
              }

              self.S(modal).foundation('section', 'reflow');
              self.S(modal).children().foundation();

              if (open_modal.length > 0) {
                if (settings.multiple_opened) {
                  self.to_back(open_modal);
                } else {
                  self.hide(open_modal, settings.css.close);
                }
              }
              self.show(modal, settings.css.open);
            }
          });

          // check for if user initalized with error callback
          if (settings.on_ajax_error !== $.noop) {
            $.extend(ajax_settings, {
              error : settings.on_ajax_error
            });
          }

          $.ajax(ajax_settings);
        }
      }
      self.S(window).trigger('resize');
    },

    close : function (modal) {
      var modal = modal && modal.length ? modal : this.S(this.scope),
          open_modals = this.S('[' + this.attr_name() + '].open'),
          settings = modal.data(this.attr_name(true) + '-init') || this.settings,
          self = this;

      if (open_modals.length > 0) {

        modal.removeAttr('tabindex','0').attr('aria-hidden','true');

        this.locked = true;
        this.key_up_off(modal);   // PATCH #3: turning on key up capture only when a reveal window is open

        modal.trigger('close.fndtn.reveal');

        if ((settings.multiple_opened && open_modals.length === 1) || !settings.multiple_opened || modal.length > 1) {
          self.toggle_bg(modal, false);
          self.to_front(modal);
        }

        if (settings.multiple_opened) {
          self.hide(modal, settings.css.close, settings);
          self.to_front($($.makeArray(open_modals).reverse()[1]));
        } else {
          self.hide(open_modals, settings.css.close, settings);
        }
      }
    },

    close_targets : function () {
      var base = '.' + this.settings.dismiss_modal_class;

      if (this.settings.close_on_background_click) {
        return base + ', .' + this.settings.bg_class;
      }

      return base;
    },

    toggle_bg : function (modal, state) {
      if (this.S('.' + this.settings.bg_class).length === 0) {
        this.settings.bg = $('<div />', {'class': this.settings.bg_class})
          .appendTo('body').hide();
      }

      var visible = this.settings.bg.filter(':visible').length > 0;
      if ( state != visible ) {
        if ( state == undefined ? visible : !state ) {
          this.hide(this.settings.bg);
        } else {
          this.show(this.settings.bg);
        }
      }
    },

    show : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init') || this.settings,
            root_element = settings.root_element,
            context = this;

        if (el.parent(root_element).length === 0) {
          var placeholder = el.wrap('<div style="display: none;" />').parent();

          el.on('closed.fndtn.reveal.wrapped', function () {
            el.detach().appendTo(placeholder);
            el.unwrap().unbind('closed.fndtn.reveal.wrapped');
          });

          el.detach().appendTo(root_element);
        }

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          css.top = $(window).scrollTop() - el.data('offset') + 'px';
          var end_css = {
            top: $(window).scrollTop() + el.data('css-top') + 'px',
            opacity: 1
          };

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.trigger('opened.fndtn.reveal');
              })
              .addClass('open');
          }, settings.animation_speed / 2);
        }

        if (animData.fade) {
          css.top = $(window).scrollTop() + el.data('css-top') + 'px';
          var end_css = {opacity: 1};

          return setTimeout(function () {
            return el
              .css(css)
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.trigger('opened.fndtn.reveal');
              })
              .addClass('open');
          }, settings.animation_speed / 2);
        }

        return el.css(css).show().css({opacity : 1}).addClass('open').trigger('opened.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeIn(settings.animation_speed / 2);
      }

      this.locked = false;

      return el.show();
    },

    to_back : function(el) {
      el.addClass('toback');
    },

    to_front : function(el) {
      el.removeClass('toback');
    },

    hide : function (el, css) {
      // is modal
      if (css) {
        var settings = el.data(this.attr_name(true) + '-init'),
            context = this;
        settings = settings || this.settings;

        var animData = getAnimationData(settings.animation);
        if (!animData.animate) {
          this.locked = false;
        }
        if (animData.pop) {
          var end_css = {
            top: - $(window).scrollTop() - el.data('offset') + 'px',
            opacity: 0
          };

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.css(css).trigger('closed.fndtn.reveal');
              })
              .removeClass('open');
          }, settings.animation_speed / 2);
        }

        if (animData.fade) {
          var end_css = {opacity : 0};

          return setTimeout(function () {
            return el
              .animate(end_css, settings.animation_speed, 'linear', function () {
                context.locked = false;
                el.css(css).trigger('closed.fndtn.reveal');
              })
              .removeClass('open');
          }, settings.animation_speed / 2);
        }

        return el.hide().css(css).removeClass('open').trigger('closed.fndtn.reveal');
      }

      var settings = this.settings;

      // should we animate the background?
      if (getAnimationData(settings.animation).fade) {
        return el.fadeOut(settings.animation_speed / 2);
      }

      return el.hide();
    },

    close_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = $('iframe', video);

      if (iframe.length > 0) {
        iframe.attr('data-src', iframe[0].src);
        iframe.attr('src', iframe.attr('src'));
        video.hide();
      }
    },

    open_video : function (e) {
      var video = $('.flex-video', e.target),
          iframe = video.find('iframe');

      if (iframe.length > 0) {
        var data_src = iframe.attr('data-src');
        if (typeof data_src === 'string') {
          iframe[0].src = iframe.attr('data-src');
        } else {
          var src = iframe[0].src;
          iframe[0].src = undefined;
          iframe[0].src = src;
        }
        video.show();
      }
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    cache_offset : function (modal) {
      var offset = modal.show().height() + parseInt(modal.css('top'), 10) + modal.scrollY;

      modal.hide();

      return offset;
    },

    off : function () {
      $(this.scope).off('.fndtn.reveal');
    },

    reflow : function () {}
  };

  /*
   * getAnimationData('popAndFade') // {animate: true,  pop: true,  fade: true}
   * getAnimationData('fade')       // {animate: true,  pop: false, fade: true}
   * getAnimationData('pop')        // {animate: true,  pop: true,  fade: false}
   * getAnimationData('foo')        // {animate: false, pop: false, fade: false}
   * getAnimationData(null)         // {animate: false, pop: false, fade: false}
   */
  function getAnimationData(str) {
    var fade = /fade/i.test(str);
    var pop = /pop/i.test(str);
    return {
      animate : fade || pop,
      pop : pop,
      fade : fade
    };
  }
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.slider = {
    name : 'slider',

    version : '5.5.2',

    settings : {
      start : 0,
      end : 100,
      step : 1,
      precision : null,
      initial : null,
      display_selector : '',
      vertical : false,
      trigger_input_change : false,
      on_change : function () {}
    },

    cache : {},

    init : function (scope, method, options) {
      Foundation.inherit(this, 'throttle');
      this.bindings(method, options);
      this.reflow();
    },

    events : function () {
      var self = this;

      $(this.scope)
        .off('.slider')
        .on('mousedown.fndtn.slider touchstart.fndtn.slider pointerdown.fndtn.slider',
        '[' + self.attr_name() + ']:not(.disabled, [disabled]) .range-slider-handle', function (e) {
          if (!self.cache.active) {
            e.preventDefault();
            self.set_active_slider($(e.target));
          }
        })
        .on('mousemove.fndtn.slider touchmove.fndtn.slider pointermove.fndtn.slider', function (e) {
          if (!!self.cache.active) {
            e.preventDefault();
            if ($.data(self.cache.active[0], 'settings').vertical) {
              var scroll_offset = 0;
              if (!e.pageY) {
                scroll_offset = window.scrollY;
              }
              self.calculate_position(self.cache.active, self.get_cursor_position(e, 'y') + scroll_offset);
            } else {
              self.calculate_position(self.cache.active, self.get_cursor_position(e, 'x'));
            }
          }
        })
        .on('mouseup.fndtn.slider touchend.fndtn.slider pointerup.fndtn.slider', function (e) {
          self.remove_active_slider();
        })
        .on('change.fndtn.slider', function (e) {
          self.settings.on_change();
        });

      self.S(window)
        .on('resize.fndtn.slider', self.throttle(function (e) {
          self.reflow();
        }, 300));

      // update slider value as users change input value
      this.S('[' + this.attr_name() + ']').each(function () {
        var slider = $(this),
            handle = slider.children('.range-slider-handle')[0],
            settings = self.initialize_settings(handle);

        if (settings.display_selector != '') {
          $(settings.display_selector).each(function(){
            if (this.hasOwnProperty('value')) {
              $(this).change(function(){
                // is there a better way to do this?
                slider.foundation("slider", "set_value", $(this).val());
              });
            }
          });
        }
      });
    },

    get_cursor_position : function (e, xy) {
      var pageXY = 'page' + xy.toUpperCase(),
          clientXY = 'client' + xy.toUpperCase(),
          position;

      if (typeof e[pageXY] !== 'undefined') {
        position = e[pageXY];
      } else if (typeof e.originalEvent[clientXY] !== 'undefined') {
        position = e.originalEvent[clientXY];
      } else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0][clientXY] !== 'undefined') {
        position = e.originalEvent.touches[0][clientXY];
      } else if (e.currentPoint && typeof e.currentPoint[xy] !== 'undefined') {
        position = e.currentPoint[xy];
      }

      return position;
    },

    set_active_slider : function ($handle) {
      this.cache.active = $handle;
    },

    remove_active_slider : function () {
      this.cache.active = null;
    },

    calculate_position : function ($handle, cursor_x) {
      var self = this,
          settings = $.data($handle[0], 'settings'),
          handle_l = $.data($handle[0], 'handle_l'),
          handle_o = $.data($handle[0], 'handle_o'),
          bar_l = $.data($handle[0], 'bar_l'),
          bar_o = $.data($handle[0], 'bar_o');

      requestAnimationFrame(function () {
        var pct;

        if (Foundation.rtl && !settings.vertical) {
          pct = self.limit_to(((bar_o + bar_l - cursor_x) / bar_l), 0, 1);
        } else {
          pct = self.limit_to(((cursor_x - bar_o) / bar_l), 0, 1);
        }

        pct = settings.vertical ? 1 - pct : pct;

        var norm = self.normalized_value(pct, settings.start, settings.end, settings.step, settings.precision);

        self.set_ui($handle, norm);
      });
    },

    set_ui : function ($handle, value) {
      var settings = $.data($handle[0], 'settings'),
          handle_l = $.data($handle[0], 'handle_l'),
          bar_l = $.data($handle[0], 'bar_l'),
          norm_pct = this.normalized_percentage(value, settings.start, settings.end),
          handle_offset = norm_pct * (bar_l - handle_l) - 1,
          progress_bar_length = norm_pct * 100,
          $handle_parent = $handle.parent(),
          $hidden_inputs = $handle.parent().children('input[type=hidden]');

      if (Foundation.rtl && !settings.vertical) {
        handle_offset = -handle_offset;
      }

      handle_offset = settings.vertical ? -handle_offset + bar_l - handle_l + 1 : handle_offset;
      this.set_translate($handle, handle_offset, settings.vertical);

      if (settings.vertical) {
        $handle.siblings('.range-slider-active-segment').css('height', progress_bar_length + '%');
      } else {
        $handle.siblings('.range-slider-active-segment').css('width', progress_bar_length + '%');
      }

      $handle_parent.attr(this.attr_name(), value).trigger('change.fndtn.slider');

      $hidden_inputs.val(value);
      if (settings.trigger_input_change) {
          $hidden_inputs.trigger('change.fndtn.slider');
      }

      if (!$handle[0].hasAttribute('aria-valuemin')) {
        $handle.attr({
          'aria-valuemin' : settings.start,
          'aria-valuemax' : settings.end
        });
      }
      $handle.attr('aria-valuenow', value);

      if (settings.display_selector != '') {
        $(settings.display_selector).each(function () {
          if (this.hasAttribute('value')) {
            $(this).val(value);
          } else {
            $(this).text(value);
          }
        });
      }

    },

    normalized_percentage : function (val, start, end) {
      return Math.min(1, (val - start) / (end - start));
    },

    normalized_value : function (val, start, end, step, precision) {
      var range = end - start,
          point = val * range,
          mod = (point - (point % step)) / step,
          rem = point % step,
          round = ( rem >= step * 0.5 ? step : 0);
      return ((mod * step + round) + start).toFixed(precision);
    },

    set_translate : function (ele, offset, vertical) {
      if (vertical) {
        $(ele)
          .css('-webkit-transform', 'translateY(' + offset + 'px)')
          .css('-moz-transform', 'translateY(' + offset + 'px)')
          .css('-ms-transform', 'translateY(' + offset + 'px)')
          .css('-o-transform', 'translateY(' + offset + 'px)')
          .css('transform', 'translateY(' + offset + 'px)');
      } else {
        $(ele)
          .css('-webkit-transform', 'translateX(' + offset + 'px)')
          .css('-moz-transform', 'translateX(' + offset + 'px)')
          .css('-ms-transform', 'translateX(' + offset + 'px)')
          .css('-o-transform', 'translateX(' + offset + 'px)')
          .css('transform', 'translateX(' + offset + 'px)');
      }
    },

    limit_to : function (val, min, max) {
      return Math.min(Math.max(val, min), max);
    },

    initialize_settings : function (handle) {
      var settings = $.extend({}, this.settings, this.data_options($(handle).parent())),
          decimal_places_match_result;

      if (settings.precision === null) {
        decimal_places_match_result = ('' + settings.step).match(/\.([\d]*)/);
        settings.precision = decimal_places_match_result && decimal_places_match_result[1] ? decimal_places_match_result[1].length : 0;
      }

      if (settings.vertical) {
        $.data(handle, 'bar_o', $(handle).parent().offset().top);
        $.data(handle, 'bar_l', $(handle).parent().outerHeight());
        $.data(handle, 'handle_o', $(handle).offset().top);
        $.data(handle, 'handle_l', $(handle).outerHeight());
      } else {
        $.data(handle, 'bar_o', $(handle).parent().offset().left);
        $.data(handle, 'bar_l', $(handle).parent().outerWidth());
        $.data(handle, 'handle_o', $(handle).offset().left);
        $.data(handle, 'handle_l', $(handle).outerWidth());
      }

      $.data(handle, 'bar', $(handle).parent());
      return $.data(handle, 'settings', settings);
    },

    set_initial_position : function ($ele) {
      var settings = $.data($ele.children('.range-slider-handle')[0], 'settings'),
          initial = ((typeof settings.initial == 'number' && !isNaN(settings.initial)) ? settings.initial : Math.floor((settings.end - settings.start) * 0.5 / settings.step) * settings.step + settings.start),
          $handle = $ele.children('.range-slider-handle');
      this.set_ui($handle, initial);
    },

    set_value : function (value) {
      var self = this;
      $('[' + self.attr_name() + ']', this.scope).each(function () {
        $(this).attr(self.attr_name(), value);
      });
      if (!!$(this.scope).attr(self.attr_name())) {
        $(this.scope).attr(self.attr_name(), value);
      }
      self.reflow();
    },

    reflow : function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var handle = $(this).children('.range-slider-handle')[0],
            val = $(this).attr(self.attr_name());
        self.initialize_settings(handle);

        if (val) {
          self.set_ui($(handle), parseFloat(val));
        } else {
          self.set_initial_position($(this));
        }
      });
    }
  };

}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tab = {
    name : 'tab',

    version : '5.5.2',

    settings : {
      active_class : 'active',
      callback : function () {},
      deep_linking : false,
      scroll_to_content : true,
      is_hover : false
    },

    default_tab_hashes : [],

    init : function (scope, method, options) {
      var self = this,
          S = this.S;

	  // Store the default active tabs which will be referenced when the
	  // location hash is absent, as in the case of navigating the tabs and
	  // returning to the first viewing via the browser Back button.
	  S('[' + this.attr_name() + '] > .active > a', this.scope).each(function () {
	    self.default_tab_hashes.push(this.hash);
	  });

      // store the initial href, which is used to allow correct behaviour of the
      // browser back button when deep linking is turned on.
      self.entry_location = window.location.href;

      this.bindings(method, options);
      this.handle_location_hash_change();
    },

    events : function () {
      var self = this,
          S = this.S;

      var usual_tab_behavior =  function (e, target) {
          var settings = S(target).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (!settings.is_hover || Modernizr.touch) {
            e.preventDefault();
            e.stopPropagation();
            self.toggle_active_tab(S(target).parent());
          }
        };

      S(this.scope)
        .off('.tab')
        // Key event: focus/tab key
        .on('keydown.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          var keyCode = e.keyCode || e.which;
            // if user pressed tab key
            if (keyCode == 9) { 
              e.preventDefault();
              // TODO: Change usual_tab_behavior into accessibility function?
              usual_tab_behavior(e, el);
            } 
        })
        // Click event: tab title
        .on('click.fndtn.tab', '[' + this.attr_name() + '] > * > a', function(e) {
          var el = this;
          usual_tab_behavior(e, el);
        })
        // Hover event: tab title
        .on('mouseenter.fndtn.tab', '[' + this.attr_name() + '] > * > a', function (e) {
          var settings = S(this).closest('[' + self.attr_name() + ']').data(self.attr_name(true) + '-init');
          if (settings.is_hover) {
            self.toggle_active_tab(S(this).parent());
          }
        });

      // Location hash change event
      S(window).on('hashchange.fndtn.tab', function (e) {
        e.preventDefault();
        self.handle_location_hash_change();
      });
    },

    handle_location_hash_change : function () {

      var self = this,
          S = this.S;

      S('[' + this.attr_name() + ']', this.scope).each(function () {
        var settings = S(this).data(self.attr_name(true) + '-init');
        if (settings.deep_linking) {
          // Match the location hash to a label
          var hash;
          if (settings.scroll_to_content) {
            hash = self.scope.location.hash;
          } else {
            // prefix the hash to prevent anchor scrolling
            hash = self.scope.location.hash.replace('fndtn-', '');
          }
          if (hash != '') {
            // Check whether the location hash references a tab content div or
            // another element on the page (inside or outside the tab content div)
            var hash_element = S(hash);
            if (hash_element.hasClass('content') && hash_element.parent().hasClass('tabs-content')) {
              // Tab content div
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + hash + ']').parent());
            } else {
              // Not the tab content div. If inside the tab content, find the
              // containing tab and toggle it as active.
              var hash_tab_container_id = hash_element.closest('.content').attr('id');
              if (hash_tab_container_id != undefined) {
                self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=#' + hash_tab_container_id + ']').parent(), hash);
              }
            }
          } else {
            // Reference the default tab hashes which were initialized in the init function
            for (var ind = 0; ind < self.default_tab_hashes.length; ind++) {
              self.toggle_active_tab($('[' + self.attr_name() + '] > * > a[href=' + self.default_tab_hashes[ind] + ']').parent());
            }
          }
        }
       });
     },

    toggle_active_tab : function (tab, location_hash) {
      var self = this,
          S = self.S,
          tabs = tab.closest('[' + this.attr_name() + ']'),
          tab_link = tab.find('a'),
          anchor = tab.children('a').first(),
          target_hash = '#' + anchor.attr('href').split('#')[1],
          target = S(target_hash),
          siblings = tab.siblings(),
          settings = tabs.data(this.attr_name(true) + '-init'),
          interpret_keyup_action = function (e) {
            // Light modification of Heydon Pickering's Practical ARIA Examples: http://heydonworks.com/practical_aria_examples/js/a11y.js

            // define current, previous and next (possible) tabs

            var $original = $(this);
            var $prev = $(this).parents('li').prev().children('[role="tab"]');
            var $next = $(this).parents('li').next().children('[role="tab"]');
            var $target;

            // find the direction (prev or next)

            switch (e.keyCode) {
              case 37:
                $target = $prev;
                break;
              case 39:
                $target = $next;
                break;
              default:
                $target = false
                  break;
            }

            if ($target.length) {
              $original.attr({
                'tabindex' : '-1',
                'aria-selected' : null
              });
              $target.attr({
                'tabindex' : '0',
                'aria-selected' : true
              }).focus();
            }

            // Hide panels

            $('[role="tabpanel"]')
              .attr('aria-hidden', 'true');

            // Show panel which corresponds to target

            $('#' + $(document.activeElement).attr('href').substring(1))
              .attr('aria-hidden', null);

          },
          go_to_hash = function(hash) {
            // This function allows correct behaviour of the browser's back button when deep linking is enabled. Without it
            // the user would get continually redirected to the default hash.
            var is_entry_location = window.location.href === self.entry_location,
                default_hash = settings.scroll_to_content ? self.default_tab_hashes[0] : is_entry_location ? window.location.hash :'fndtn-' + self.default_tab_hashes[0].replace('#', '')

            if (!(is_entry_location && hash === default_hash)) {
              window.location.hash = hash;
            }
          };

      // allow usage of data-tab-content attribute instead of href
      if (anchor.data('tab-content')) {
        target_hash = '#' + anchor.data('tab-content').split('#')[1];
        target = S(target_hash);
      }

      if (settings.deep_linking) {

        if (settings.scroll_to_content) {

          // retain current hash to scroll to content
          go_to_hash(location_hash || target_hash);

          if (location_hash == undefined || location_hash == target_hash) {
            tab.parent()[0].scrollIntoView();
          } else {
            S(target_hash)[0].scrollIntoView();
          }
        } else {
          // prefix the hashes so that the browser doesn't scroll down
          if (location_hash != undefined) {
            go_to_hash('fndtn-' + location_hash.replace('#', ''));
          } else {
            go_to_hash('fndtn-' + target_hash.replace('#', ''));
          }
        }
      }

      // WARNING: The activation and deactivation of the tab content must
      // occur after the deep linking in order to properly refresh the browser
      // window (notably in Chrome).
      // Clean up multiple attr instances to done once
      tab.addClass(settings.active_class).triggerHandler('opened');
      tab_link.attr({'aria-selected' : 'true',  tabindex : 0});
      siblings.removeClass(settings.active_class)
      siblings.find('a').attr({'aria-selected' : 'false',  tabindex : -1});
      target.siblings().removeClass(settings.active_class).attr({'aria-hidden' : 'true',  tabindex : -1});
      target.addClass(settings.active_class).attr('aria-hidden', 'false').removeAttr('tabindex');
      settings.callback(tab);
      target.triggerHandler('toggled', [target]);
      tabs.triggerHandler('toggled', [tab]);

      tab_link.off('keydown').on('keydown', interpret_keyup_action );
    },

    data_attr : function (str) {
      if (this.namespace.length > 0) {
        return this.namespace + '-' + str;
      }

      return str;
    },

    off : function () {},

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.tooltip = {
    name : 'tooltip',

    version : '5.5.2',

    settings : {
      additional_inheritable_classes : [],
      tooltip_class : '.tooltip',
      append_to : 'body',
      touch_close_text : 'Tap To Close',
      disable_for_touch : false,
      hover_delay : 200,
      show_on : 'all',
      tip_template : function (selector, content) {
        return '<span data-selector="' + selector + '" id="' + selector + '" class="'
          + Foundation.libs.tooltip.settings.tooltip_class.substring(1)
          + '" role="tooltip">' + content + '<span class="nub"></span></span>';
      }
    },

    cache : {},

    init : function (scope, method, options) {
      Foundation.inherit(this, 'random_str');
      this.bindings(method, options);
    },

    should_show : function (target, tip) {
      var settings = $.extend({}, this.settings, this.data_options(target));

      if (settings.show_on === 'all') {
        return true;
      } else if (this.small() && settings.show_on === 'small') {
        return true;
      } else if (this.medium() && settings.show_on === 'medium') {
        return true;
      } else if (this.large() && settings.show_on === 'large') {
        return true;
      }
      return false;
    },

    medium : function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },

    large : function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },

    events : function (instance) {
      var self = this,
          S = self.S;

      self.create(this.S(instance));

      function _startShow(elt, $this, immediate) {
        if (elt.timer) {
          return;
        }

        if (immediate) {
          elt.timer = null;
          self.showTip($this);
        } else {
          elt.timer = setTimeout(function () {
            elt.timer = null;
            self.showTip($this);
          }.bind(elt), self.settings.hover_delay);
        }
      }

      function _startHide(elt, $this) {
        if (elt.timer) {
          clearTimeout(elt.timer);
          elt.timer = null;
        }

        self.hide($this);
      }

      $(this.scope)
        .off('.tooltip')
        .on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip',
          '[' + this.attr_name() + ']', function (e) {
          var $this = S(this),
              settings = $.extend({}, self.settings, self.data_options($this)),
              is_touch = false;

          if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type) && S(e.target).is('a')) {
            return false;
          }

          if (/mouse/i.test(e.type) && self.ie_touch(e)) {
            return false;
          }
          
          if ($this.hasClass('open')) {
            if (Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              e.preventDefault();
            }
            self.hide($this);
          } else {
            if (settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              return;
            } else if (!settings.disable_for_touch && Modernizr.touch && /touchstart|MSPointerDown/i.test(e.type)) {
              e.preventDefault();
              S(settings.tooltip_class + '.open').hide();
              is_touch = true;
              // close other open tooltips on touch
              if ($('.open[' + self.attr_name() + ']').length > 0) {
               var prevOpen = S($('.open[' + self.attr_name() + ']')[0]);
               self.hide(prevOpen);
              }
            }

            if (/enter|over/i.test(e.type)) {
              _startShow(this, $this);

            } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
              _startHide(this, $this);
            } else {
              _startShow(this, $this, true);
            }
          }
        })
        .on('mouseleave.fndtn.tooltip touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', '[' + this.attr_name() + '].open', function (e) {
          if (/mouse/i.test(e.type) && self.ie_touch(e)) {
            return false;
          }

          if ($(this).data('tooltip-open-event-type') == 'touch' && e.type == 'mouseleave') {
            return;
          } else if ($(this).data('tooltip-open-event-type') == 'mouse' && /MSPointerDown|touchstart/i.test(e.type)) {
            self.convert_to_touch($(this));
          } else {
            _startHide(this, $(this));
          }
        })
        .on('DOMNodeRemoved DOMAttrModified', '[' + this.attr_name() + ']:not(a)', function (e) {
          _startHide(this, S(this));
        });
    },

    ie_touch : function (e) {
      // How do I distinguish between IE11 and Windows Phone 8?????
      return false;
    },

    showTip : function ($target) {
      var $tip = this.getTip($target);
      if (this.should_show($target, $tip)) {
        return this.show($target);
      }
      return;
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          settings = $.extend({}, this.settings, this.data_options($target)),
          tip = null;

      if (selector) {
        tip = this.S('span[data-selector="' + selector + '"]' + settings.tooltip_class);
      }

      return (typeof tip === 'object') ? tip : false;
    },

    selector : function ($target) {
      var dataSelector = $target.attr(this.attr_name()) || $target.attr('data-selector');

      if (typeof dataSelector != 'string') {
        dataSelector = this.random_str(6);
        $target
          .attr('data-selector', dataSelector)
          .attr('aria-describedby', dataSelector);
      }

      return dataSelector;
    },

    create : function ($target) {
      var self = this,
          settings = $.extend({}, this.settings, this.data_options($target)),
          tip_template = this.settings.tip_template;

      if (typeof settings.tip_template === 'string' && window.hasOwnProperty(settings.tip_template)) {
        tip_template = window[settings.tip_template];
      }

      var $tip = $(tip_template(this.selector($target), $('<div></div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo(settings.append_to);

      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('touchstart.fndtn.tooltip MSPointerDown.fndtn.tooltip', function (e) {
          self.hide($target);
        });
      }

      $target.removeAttr('title').attr('title', '');
    },

    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerHeight();

      if (this.small()) {
        tip.css({'width' : '100%'});
      } else {
        tip.css({'width' : (width) ? width : 'auto'});
      }

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : (top) ? top : 'auto',
          'bottom' : (bottom) ? bottom : 'auto',
          'left' : (left) ? left : 'auto',
          'right' : (right) ? right : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left);

      if (this.small()) {
        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', 12.5, $(this.scope).width());
        tip.addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        var left = target.offset().left;
        if (Foundation.rtl) {
          nub.addClass('rtl');
          left = target.offset().left + target.outerWidth() - tip.outerWidth();
        }

        objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', left);
        // reset nub from small styles, if they've been applied
        if (nub.attr('style')) {
          nub.removeAttr('style');
        }
        
        tip.removeClass('tip-override');
        if (classes && classes.indexOf('tip-top') > -1) {
          if (Foundation.rtl) {
            nub.addClass('rtl');
          }
          objPos(tip, (target.offset().top - tip.outerHeight()), 'auto', 'auto', left)
            .removeClass('tip-override');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left - tip.outerWidth() - nubHeight))
            .removeClass('tip-override');
          nub.removeClass('rtl');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - (tip.outerHeight() / 2)), 'auto', 'auto', (target.offset().left + target.outerWidth() + nubHeight))
            .removeClass('tip-override');
          nub.removeClass('rtl');
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    small : function () {
      return matchMedia(Foundation.media_queries.small).matches &&
        !matchMedia(Foundation.media_queries.medium).matches;
    },

    inheritable_classes : function ($target) {
      var settings = $.extend({}, this.settings, this.data_options($target)),
          inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'radius', 'round'].concat(settings.additional_inheritable_classes),
          classes = $target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
            if ($.inArray(el, inheritables) !== -1) {
              return el;
            }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    convert_to_touch : function ($target) {
      var self = this,
          $tip = self.getTip($target),
          settings = $.extend({}, self.settings, self.data_options($target));

      if ($tip.find('.tap-to-close').length === 0) {
        $tip.append('<span class="tap-to-close">' + settings.touch_close_text + '</span>');
        $tip.on('click.fndtn.tooltip.tapclose touchstart.fndtn.tooltip.tapclose MSPointerDown.fndtn.tooltip.tapclose', function (e) {
          self.hide($target);
        });
      }

      $target.data('tooltip-open-event-type', 'touch');
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      if ($target.data('tooltip-open-event-type') == 'touch') {
        this.convert_to_touch($target);
      }

      this.reposition($target, $tip, $target.attr('class'));
      $target.addClass('open');
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);
      $tip.fadeOut(150, function () {
        $tip.find('.tap-to-close').remove();
        $tip.off('click.fndtn.tooltip.tapclose MSPointerDown.fndtn.tapclose');
        $target.removeClass('open');
      });
    },

    off : function () {
      var self = this;
      this.S(this.scope).off('.fndtn.tooltip');
      this.S(this.settings.tooltip_class).each(function (i) {
        $('[' + self.attr_name() + ']').eq(i).attr('title', $(this).text());
      }).remove();
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs.topbar = {
    name : 'topbar',

    version : '5.5.2',

    settings : {
      index : 0,
      start_offset : 0,
      sticky_class : 'sticky',
      custom_back_text : true,
      back_text : 'Back',
      mobile_show_parent_link : true,
      is_hover : true,
      scrolltop : true, // jump to top when sticky nav menu toggle is clicked
      sticky_on : 'all',
      dropdown_autoclose: true
    },

    init : function (section, method, options) {
      Foundation.inherit(this, 'add_custom_rule register_media throttle');
      var self = this;

      self.register_media('topbar', 'foundation-mq-topbar');

      this.bindings(method, options);

      self.S('[' + this.attr_name() + ']', this.scope).each(function () {
        var topbar = $(this),
            settings = topbar.data(self.attr_name(true) + '-init'),
            section = self.S('section, .top-bar-section', this);
        topbar.data('index', 0);
        var topbarContainer = topbar.parent();
        if (topbarContainer.hasClass('fixed') || self.is_sticky(topbar, topbarContainer, settings) ) {
          self.settings.sticky_class = settings.sticky_class;
          self.settings.sticky_topbar = topbar;
          topbar.data('height', topbarContainer.outerHeight());
          topbar.data('stickyoffset', topbarContainer.offset().top);
        } else {
          topbar.data('height', topbar.outerHeight());
        }

        if (!settings.assembled) {
          self.assemble(topbar);
        }

        if (settings.is_hover) {
          self.S('.has-dropdown', topbar).addClass('not-click');
        } else {
          self.S('.has-dropdown', topbar).removeClass('not-click');
        }

        // Pad body when sticky (scrolled) or fixed.
        self.add_custom_rule('.f-topbar-fixed { padding-top: ' + topbar.data('height') + 'px }');

        if (topbarContainer.hasClass('fixed')) {
          self.S('body').addClass('f-topbar-fixed');
        }
      });

    },

    is_sticky : function (topbar, topbarContainer, settings) {
      var sticky     = topbarContainer.hasClass(settings.sticky_class);
      var smallMatch = matchMedia(Foundation.media_queries.small).matches;
      var medMatch   = matchMedia(Foundation.media_queries.medium).matches;
      var lrgMatch   = matchMedia(Foundation.media_queries.large).matches;

      if (sticky && settings.sticky_on === 'all') {
        return true;
      }
      if (sticky && this.small() && settings.sticky_on.indexOf('small') !== -1) {
        if (smallMatch && !medMatch && !lrgMatch) { return true; }
      }
      if (sticky && this.medium() && settings.sticky_on.indexOf('medium') !== -1) {
        if (smallMatch && medMatch && !lrgMatch) { return true; }
      }
      if (sticky && this.large() && settings.sticky_on.indexOf('large') !== -1) {
        if (smallMatch && medMatch && lrgMatch) { return true; }
      }

       return false;
    },

    toggle : function (toggleEl) {
      var self = this,
          topbar;

      if (toggleEl) {
        topbar = self.S(toggleEl).closest('[' + this.attr_name() + ']');
      } else {
        topbar = self.S('[' + this.attr_name() + ']');
      }

      var settings = topbar.data(this.attr_name(true) + '-init');

      var section = self.S('section, .top-bar-section', topbar);

      if (self.breakpoint()) {
        if (!self.rtl) {
          section.css({left : '0%'});
          $('>.name', section).css({left : '100%'});
        } else {
          section.css({right : '0%'});
          $('>.name', section).css({right : '100%'});
        }

        self.S('li.moved', section).removeClass('moved');
        topbar.data('index', 0);

        topbar
          .toggleClass('expanded')
          .css('height', '');
      }

      if (settings.scrolltop) {
        if (!topbar.hasClass('expanded')) {
          if (topbar.hasClass('fixed')) {
            topbar.parent().addClass('fixed');
            topbar.removeClass('fixed');
            self.S('body').addClass('f-topbar-fixed');
          }
        } else if (topbar.parent().hasClass('fixed')) {
          if (settings.scrolltop) {
            topbar.parent().removeClass('fixed');
            topbar.addClass('fixed');
            self.S('body').removeClass('f-topbar-fixed');

            window.scrollTo(0, 0);
          } else {
            topbar.parent().removeClass('expanded');
          }
        }
      } else {
        if (self.is_sticky(topbar, topbar.parent(), settings)) {
          topbar.parent().addClass('fixed');
        }

        if (topbar.parent().hasClass('fixed')) {
          if (!topbar.hasClass('expanded')) {
            topbar.removeClass('fixed');
            topbar.parent().removeClass('expanded');
            self.update_sticky_positioning();
          } else {
            topbar.addClass('fixed');
            topbar.parent().addClass('expanded');
            self.S('body').addClass('f-topbar-fixed');
          }
        }
      }
    },

    timer : null,

    events : function (bar) {
      var self = this,
          S = this.S;

      S(this.scope)
        .off('.topbar')
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] .toggle-topbar', function (e) {
          e.preventDefault();
          self.toggle(this);
        })
        .on('click.fndtn.topbar contextmenu.fndtn.topbar', '.top-bar .top-bar-section li a[href^="#"],[' + this.attr_name() + '] .top-bar-section li a[href^="#"]', function (e) {
            var li = $(this).closest('li'),
                topbar = li.closest('[' + self.attr_name() + ']'),
                settings = topbar.data(self.attr_name(true) + '-init');

            if (settings.dropdown_autoclose && settings.is_hover) {
              var hoverLi = $(this).closest('.hover');
              hoverLi.removeClass('hover');
            }
            if (self.breakpoint() && !li.hasClass('back') && !li.hasClass('has-dropdown')) {
              self.toggle();
            }

        })
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] li.has-dropdown', function (e) {
          var li = S(this),
              target = S(e.target),
              topbar = li.closest('[' + self.attr_name() + ']'),
              settings = topbar.data(self.attr_name(true) + '-init');

          if (target.data('revealId')) {
            self.toggle();
            return;
          }

          if (self.breakpoint()) {
            return;
          }

          if (settings.is_hover && !Modernizr.touch) {
            return;
          }

          e.stopImmediatePropagation();

          if (li.hasClass('hover')) {
            li
              .removeClass('hover')
              .find('li')
              .removeClass('hover');

            li.parents('li.hover')
              .removeClass('hover');
          } else {
            li.addClass('hover');

            $(li).siblings().removeClass('hover');

            if (target[0].nodeName === 'A' && target.parent().hasClass('has-dropdown')) {
              e.preventDefault();
            }
          }
        })
        .on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown>a', function (e) {
          if (self.breakpoint()) {

            e.preventDefault();

            var $this = S(this),
                topbar = $this.closest('[' + self.attr_name() + ']'),
                section = topbar.find('section, .top-bar-section'),
                dropdownHeight = $this.next('.dropdown').outerHeight(),
                $selectedLi = $this.closest('li');

            topbar.data('index', topbar.data('index') + 1);
            $selectedLi.addClass('moved');

            if (!self.rtl) {
              section.css({left : -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({left : 100 * topbar.data('index') + '%'});
            } else {
              section.css({right : -(100 * topbar.data('index')) + '%'});
              section.find('>.name').css({right : 100 * topbar.data('index') + '%'});
            }

            topbar.css('height', $this.siblings('ul').outerHeight(true) + topbar.data('height'));
          }
        });

      S(window).off('.topbar').on('resize.fndtn.topbar', self.throttle(function () {
          self.resize.call(self);
      }, 50)).trigger('resize.fndtn.topbar').load(function () {
          // Ensure that the offset is calculated after all of the pages resources have loaded
          S(this).trigger('resize.fndtn.topbar');
      });

      S('body').off('.topbar').on('click.fndtn.topbar', function (e) {
        var parent = S(e.target).closest('li').closest('li.hover');

        if (parent.length > 0) {
          return;
        }

        S('[' + self.attr_name() + '] li.hover').removeClass('hover');
      });

      // Go up a level on Click
      S(this.scope).on('click.fndtn.topbar', '[' + this.attr_name() + '] .has-dropdown .back', function (e) {
        e.preventDefault();

        var $this = S(this),
            topbar = $this.closest('[' + self.attr_name() + ']'),
            section = topbar.find('section, .top-bar-section'),
            settings = topbar.data(self.attr_name(true) + '-init'),
            $movedLi = $this.closest('li.moved'),
            $previousLevelUl = $movedLi.parent();

        topbar.data('index', topbar.data('index') - 1);

        if (!self.rtl) {
          section.css({left : -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({left : 100 * topbar.data('index') + '%'});
        } else {
          section.css({right : -(100 * topbar.data('index')) + '%'});
          section.find('>.name').css({right : 100 * topbar.data('index') + '%'});
        }

        if (topbar.data('index') === 0) {
          topbar.css('height', '');
        } else {
          topbar.css('height', $previousLevelUl.outerHeight(true) + topbar.data('height'));
        }

        setTimeout(function () {
          $movedLi.removeClass('moved');
        }, 300);
      });

      // Show dropdown menus when their items are focused
      S(this.scope).find('.dropdown a')
        .focus(function () {
          $(this).parents('.has-dropdown').addClass('hover');
        })
        .blur(function () {
          $(this).parents('.has-dropdown').removeClass('hover');
        });
    },

    resize : function () {
      var self = this;
      self.S('[' + this.attr_name() + ']').each(function () {
        var topbar = self.S(this),
            settings = topbar.data(self.attr_name(true) + '-init');

        var stickyContainer = topbar.parent('.' + self.settings.sticky_class);
        var stickyOffset;

        if (!self.breakpoint()) {
          var doToggle = topbar.hasClass('expanded');
          topbar
            .css('height', '')
            .removeClass('expanded')
            .find('li')
            .removeClass('hover');

            if (doToggle) {
              self.toggle(topbar);
            }
        }

        if (self.is_sticky(topbar, stickyContainer, settings)) {
          if (stickyContainer.hasClass('fixed')) {
            // Remove the fixed to allow for correct calculation of the offset.
            stickyContainer.removeClass('fixed');

            stickyOffset = stickyContainer.offset().top;
            if (self.S(document.body).hasClass('f-topbar-fixed')) {
              stickyOffset -= topbar.data('height');
            }

            topbar.data('stickyoffset', stickyOffset);
            stickyContainer.addClass('fixed');
          } else {
            stickyOffset = stickyContainer.offset().top;
            topbar.data('stickyoffset', stickyOffset);
          }
        }

      });
    },

    breakpoint : function () {
      return !matchMedia(Foundation.media_queries['topbar']).matches;
    },

    small : function () {
      return matchMedia(Foundation.media_queries['small']).matches;
    },

    medium : function () {
      return matchMedia(Foundation.media_queries['medium']).matches;
    },

    large : function () {
      return matchMedia(Foundation.media_queries['large']).matches;
    },

    assemble : function (topbar) {
      var self = this,
          settings = topbar.data(this.attr_name(true) + '-init'),
          section = self.S('section, .top-bar-section', topbar);

      // Pull element out of the DOM for manipulation
      section.detach();

      self.S('.has-dropdown>a', section).each(function () {
        var $link = self.S(this),
            $dropdown = $link.siblings('.dropdown'),
            url = $link.attr('href'),
            $titleLi;

        if (!$dropdown.find('.title.back').length) {

          if (settings.mobile_show_parent_link == true && url) {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5></li><li class="parent-link hide-for-medium-up"><a class="parent-link js-generated" href="' + url + '">' + $link.html() +'</a></li>');
          } else {
            $titleLi = $('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5>');
          }

          // Copy link to subnav
          if (settings.custom_back_text == true) {
            $('h5>a', $titleLi).html(settings.back_text);
          } else {
            $('h5>a', $titleLi).html('&laquo; ' + $link.html());
          }
          $dropdown.prepend($titleLi);
        }
      });

      // Put element back in the DOM
      section.appendTo(topbar);

      // check for sticky
      this.sticky();

      this.assembled(topbar);
    },

    assembled : function (topbar) {
      topbar.data(this.attr_name(true), $.extend({}, topbar.data(this.attr_name(true)), {assembled : true}));
    },

    height : function (ul) {
      var total = 0,
          self = this;

      $('> li', ul).each(function () {
        total += self.S(this).outerHeight(true);
      });

      return total;
    },

    sticky : function () {
      var self = this;

      this.S(window).on('scroll', function () {
        self.update_sticky_positioning();
      });
    },

    update_sticky_positioning : function () {
      var klass = '.' + this.settings.sticky_class,
          $window = this.S(window),
          self = this;

      if (self.settings.sticky_topbar && self.is_sticky(this.settings.sticky_topbar,this.settings.sticky_topbar.parent(), this.settings)) {
        var distance = this.settings.sticky_topbar.data('stickyoffset') + this.settings.start_offset;
        if (!self.S(klass).hasClass('expanded')) {
          if ($window.scrollTop() > (distance)) {
            if (!self.S(klass).hasClass('fixed')) {
              self.S(klass).addClass('fixed');
              self.S('body').addClass('f-topbar-fixed');
            }
          } else if ($window.scrollTop() <= distance) {
            if (self.S(klass).hasClass('fixed')) {
              self.S(klass).removeClass('fixed');
              self.S('body').removeClass('f-topbar-fixed');
            }
          }
        }
      }
    },

    off : function () {
      this.S(this.scope).off('.fndtn.topbar');
      this.S(window).off('.fndtn.topbar');
    },

    reflow : function () {}
  };
}(jQuery, window, window.document));

},{}],"jquery":[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:01Z
 */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){function c(a){var b="length"in a&&a.length,c=_.type(a);return"function"===c||_.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}function d(a,b,c){if(_.isFunction(b))return _.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return _.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(ha.test(b))return _.filter(b,a,c);b=_.filter(b,a)}return _.grep(a,function(a){return U.call(b,a)>=0!==c})}function e(a,b){for(;(a=a[b])&&1!==a.nodeType;);return a}function f(a){var b=oa[a]={};return _.each(a.match(na)||[],function(a,c){b[c]=!0}),b}function g(){Z.removeEventListener("DOMContentLoaded",g,!1),a.removeEventListener("load",g,!1),_.ready()}function h(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=_.expando+h.uid++}function i(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(ua,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:ta.test(c)?_.parseJSON(c):c}catch(e){}sa.set(a,b,c)}else c=void 0;return c}function j(){return!0}function k(){return!1}function l(){try{return Z.activeElement}catch(a){}}function m(a,b){return _.nodeName(a,"table")&&_.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function n(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function o(a){var b=Ka.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function p(a,b){for(var c=0,d=a.length;d>c;c++)ra.set(a[c],"globalEval",!b||ra.get(b[c],"globalEval"))}function q(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(ra.hasData(a)&&(f=ra.access(a),g=ra.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)_.event.add(b,e,j[e][c])}sa.hasData(a)&&(h=sa.access(a),i=_.extend({},h),sa.set(b,i))}}function r(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&_.nodeName(a,b)?_.merge([a],c):c}function s(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ya.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}function t(b,c){var d,e=_(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:_.css(e[0],"display");return e.detach(),f}function u(a){var b=Z,c=Oa[a];return c||(c=t(a,b),"none"!==c&&c||(Na=(Na||_("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=Na[0].contentDocument,b.write(),b.close(),c=t(a,b),Na.detach()),Oa[a]=c),c}function v(a,b,c){var d,e,f,g,h=a.style;return c=c||Ra(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||_.contains(a.ownerDocument,a)||(g=_.style(a,b)),Qa.test(g)&&Pa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function w(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}function x(a,b){if(b in a)return b;for(var c=b[0].toUpperCase()+b.slice(1),d=b,e=Xa.length;e--;)if(b=Xa[e]+c,b in a)return b;return d}function y(a,b,c){var d=Ta.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function z(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=_.css(a,c+wa[f],!0,e)),d?("content"===c&&(g-=_.css(a,"padding"+wa[f],!0,e)),"margin"!==c&&(g-=_.css(a,"border"+wa[f]+"Width",!0,e))):(g+=_.css(a,"padding"+wa[f],!0,e),"padding"!==c&&(g+=_.css(a,"border"+wa[f]+"Width",!0,e)));return g}function A(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ra(a),g="border-box"===_.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=v(a,b,f),(0>e||null==e)&&(e=a.style[b]),Qa.test(e))return e;d=g&&(Y.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+z(a,b,c||(g?"border":"content"),d,f)+"px"}function B(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=ra.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&xa(d)&&(f[g]=ra.access(d,"olddisplay",u(d.nodeName)))):(e=xa(d),"none"===c&&e||ra.set(d,"olddisplay",e?c:_.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function C(a,b,c,d,e){return new C.prototype.init(a,b,c,d,e)}function D(){return setTimeout(function(){Ya=void 0}),Ya=_.now()}function E(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=wa[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function F(a,b,c){for(var d,e=(cb[b]||[]).concat(cb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function G(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},n=a.style,o=a.nodeType&&xa(a),p=ra.get(a,"fxshow");c.queue||(h=_._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,_.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[n.overflow,n.overflowX,n.overflowY],j=_.css(a,"display"),k="none"===j?ra.get(a,"olddisplay")||u(a.nodeName):j,"inline"===k&&"none"===_.css(a,"float")&&(n.display="inline-block")),c.overflow&&(n.overflow="hidden",l.always(function(){n.overflow=c.overflow[0],n.overflowX=c.overflow[1],n.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],$a.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(o?"hide":"show")){if("show"!==e||!p||void 0===p[d])continue;o=!0}m[d]=p&&p[d]||_.style(a,d)}else j=void 0;if(_.isEmptyObject(m))"inline"===("none"===j?u(a.nodeName):j)&&(n.display=j);else{p?"hidden"in p&&(o=p.hidden):p=ra.access(a,"fxshow",{}),f&&(p.hidden=!o),o?_(a).show():l.done(function(){_(a).hide()}),l.done(function(){var b;ra.remove(a,"fxshow");for(b in m)_.style(a,b,m[b])});for(d in m)g=F(o?p[d]:0,d,l),d in p||(p[d]=g.start,o&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function H(a,b){var c,d,e,f,g;for(c in a)if(d=_.camelCase(c),e=b[d],f=a[c],_.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=_.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function I(a,b,c){var d,e,f=0,g=bb.length,h=_.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Ya||D(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:_.extend({},b),opts:_.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Ya||D(),duration:c.duration,tweens:[],createTween:function(b,c){var d=_.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(H(k,j.opts.specialEasing);g>f;f++)if(d=bb[f].call(j,a,k,j.opts))return d;return _.map(k,F,j),_.isFunction(j.opts.start)&&j.opts.start.call(a,j),_.fx.timer(_.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}function J(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(na)||[];if(_.isFunction(c))for(;d=f[e++];)"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function K(a,b,c,d){function e(h){var i;return f[h]=!0,_.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||g||f[j]?g?!(i=j):void 0:(b.dataTypes.unshift(j),e(j),!1)}),i}var f={},g=a===tb;return e(b.dataTypes[0])||!f["*"]&&e("*")}function L(a,b){var c,d,e=_.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&_.extend(!0,a,d),a}function M(a,b,c){for(var d,e,f,g,h=a.contents,i=a.dataTypes;"*"===i[0];)i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function N(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];for(f=k.shift();f;)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}function O(a,b,c,d){var e;if(_.isArray(b))_.each(b,function(b,e){c||yb.test(a)?d(a,e):O(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==_.type(b))d(a,b);else for(e in b)O(a+"["+e+"]",b[e],c,d)}function P(a){return _.isWindow(a)?a:9===a.nodeType&&a.defaultView}var Q=[],R=Q.slice,S=Q.concat,T=Q.push,U=Q.indexOf,V={},W=V.toString,X=V.hasOwnProperty,Y={},Z=a.document,$="2.1.4",_=function(a,b){return new _.fn.init(a,b)},aa=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,ba=/^-ms-/,ca=/-([\da-z])/gi,da=function(a,b){return b.toUpperCase()};_.fn=_.prototype={jquery:$,constructor:_,selector:"",length:0,toArray:function(){return R.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:R.call(this)},pushStack:function(a){var b=_.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return _.each(this,a,b)},map:function(a){return this.pushStack(_.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(R.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:T,sort:Q.sort,splice:Q.splice},_.extend=_.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||_.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(_.isPlainObject(d)||(e=_.isArray(d)))?(e?(e=!1,f=c&&_.isArray(c)?c:[]):f=c&&_.isPlainObject(c)?c:{},g[b]=_.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},_.extend({expando:"jQuery"+($+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===_.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!_.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==_.type(a)||a.nodeType||_.isWindow(a)?!1:a.constructor&&!X.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?V[W.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=_.trim(a),a&&(1===a.indexOf("use strict")?(b=Z.createElement("script"),b.text=a,Z.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(ba,"ms-").replace(ca,da)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,d){var e,f=0,g=a.length,h=c(a);if(d){if(h)for(;g>f&&(e=b.apply(a[f],d),e!==!1);f++);else for(f in a)if(e=b.apply(a[f],d),e===!1)break}else if(h)for(;g>f&&(e=b.call(a[f],f,a[f]),e!==!1);f++);else for(f in a)if(e=b.call(a[f],f,a[f]),e===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(aa,"")},makeArray:function(a,b){var d=b||[];return null!=a&&(c(Object(a))?_.merge(d,"string"==typeof a?[a]:a):T.call(d,a)),d},inArray:function(a,b,c){return null==b?-1:U.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,d){var e,f=0,g=a.length,h=c(a),i=[];if(h)for(;g>f;f++)e=b(a[f],f,d),null!=e&&i.push(e);else for(f in a)e=b(a[f],f,d),null!=e&&i.push(e);return S.apply([],i)},guid:1,proxy:function(a,b){var c,d,e;return"string"==typeof b&&(c=a[b],b=a,a=c),_.isFunction(a)?(d=R.call(arguments,2),e=function(){return a.apply(b||this,d.concat(R.call(arguments)))},e.guid=a.guid=a.guid||_.guid++,e):void 0},now:Date.now,support:Y}),_.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){V["[object "+b+"]"]=b.toLowerCase()});var ea=/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
function(a){function b(a,b,c,d){var e,f,g,h,i,j,l,n,o,p;if((b?b.ownerDocument||b:O)!==G&&F(b),b=b||G,c=c||[],h=b.nodeType,"string"!=typeof a||!a||1!==h&&9!==h&&11!==h)return c;if(!d&&I){if(11!==h&&(e=sa.exec(a)))if(g=e[1]){if(9===h){if(f=b.getElementById(g),!f||!f.parentNode)return c;if(f.id===g)return c.push(f),c}else if(b.ownerDocument&&(f=b.ownerDocument.getElementById(g))&&M(b,f)&&f.id===g)return c.push(f),c}else{if(e[2])return $.apply(c,b.getElementsByTagName(a)),c;if((g=e[3])&&v.getElementsByClassName)return $.apply(c,b.getElementsByClassName(g)),c}if(v.qsa&&(!J||!J.test(a))){if(n=l=N,o=b,p=1!==h&&a,1===h&&"object"!==b.nodeName.toLowerCase()){for(j=z(a),(l=b.getAttribute("id"))?n=l.replace(ua,"\\$&"):b.setAttribute("id",n),n="[id='"+n+"'] ",i=j.length;i--;)j[i]=n+m(j[i]);o=ta.test(a)&&k(b.parentNode)||b,p=j.join(",")}if(p)try{return $.apply(c,o.querySelectorAll(p)),c}catch(q){}finally{l||b.removeAttribute("id")}}}return B(a.replace(ia,"$1"),b,c,d)}function c(){function a(c,d){return b.push(c+" ")>w.cacheLength&&delete a[b.shift()],a[c+" "]=d}var b=[];return a}function d(a){return a[N]=!0,a}function e(a){var b=G.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function f(a,b){for(var c=a.split("|"),d=a.length;d--;)w.attrHandle[c[d]]=b}function g(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||V)-(~a.sourceIndex||V);if(d)return d;if(c)for(;c=c.nextSibling;)if(c===b)return-1;return a?1:-1}function h(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function i(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function j(a){return d(function(b){return b=+b,d(function(c,d){for(var e,f=a([],c.length,b),g=f.length;g--;)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function k(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}function l(){}function m(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function n(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=Q++;return b.first?function(b,c,f){for(;b=b[d];)if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[P,f];if(g){for(;b=b[d];)if((1===b.nodeType||e)&&a(b,c,g))return!0}else for(;b=b[d];)if(1===b.nodeType||e){if(i=b[N]||(b[N]={}),(h=i[d])&&h[0]===P&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function o(a){return a.length>1?function(b,c,d){for(var e=a.length;e--;)if(!a[e](b,c,d))return!1;return!0}:a[0]}function p(a,c,d){for(var e=0,f=c.length;f>e;e++)b(a,c[e],d);return d}function q(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function r(a,b,c,e,f,g){return e&&!e[N]&&(e=r(e)),f&&!f[N]&&(f=r(f,g)),d(function(d,g,h,i){var j,k,l,m=[],n=[],o=g.length,r=d||p(b||"*",h.nodeType?[h]:h,[]),s=!a||!d&&b?r:q(r,m,a,h,i),t=c?f||(d?a:o||e)?[]:g:s;if(c&&c(s,t,h,i),e)for(j=q(t,n),e(j,[],h,i),k=j.length;k--;)(l=j[k])&&(t[n[k]]=!(s[n[k]]=l));if(d){if(f||a){if(f){for(j=[],k=t.length;k--;)(l=t[k])&&j.push(s[k]=l);f(null,t=[],j,i)}for(k=t.length;k--;)(l=t[k])&&(j=f?aa(d,l):m[k])>-1&&(d[j]=!(g[j]=l))}}else t=q(t===g?t.splice(o,t.length):t),f?f(null,g,t,i):$.apply(g,t)})}function s(a){for(var b,c,d,e=a.length,f=w.relative[a[0].type],g=f||w.relative[" "],h=f?1:0,i=n(function(a){return a===b},g,!0),j=n(function(a){return aa(b,a)>-1},g,!0),k=[function(a,c,d){var e=!f&&(d||c!==C)||((b=c).nodeType?i(a,c,d):j(a,c,d));return b=null,e}];e>h;h++)if(c=w.relative[a[h].type])k=[n(o(k),c)];else{if(c=w.filter[a[h].type].apply(null,a[h].matches),c[N]){for(d=++h;e>d&&!w.relative[a[d].type];d++);return r(h>1&&o(k),h>1&&m(a.slice(0,h-1).concat({value:" "===a[h-2].type?"*":""})).replace(ia,"$1"),c,d>h&&s(a.slice(h,d)),e>d&&s(a=a.slice(d)),e>d&&m(a))}k.push(c)}return o(k)}function t(a,c){var e=c.length>0,f=a.length>0,g=function(d,g,h,i,j){var k,l,m,n=0,o="0",p=d&&[],r=[],s=C,t=d||f&&w.find.TAG("*",j),u=P+=null==s?1:Math.random()||.1,v=t.length;for(j&&(C=g!==G&&g);o!==v&&null!=(k=t[o]);o++){if(f&&k){for(l=0;m=a[l++];)if(m(k,g,h)){i.push(k);break}j&&(P=u)}e&&((k=!m&&k)&&n--,d&&p.push(k))}if(n+=o,e&&o!==n){for(l=0;m=c[l++];)m(p,r,g,h);if(d){if(n>0)for(;o--;)p[o]||r[o]||(r[o]=Y.call(i));r=q(r)}$.apply(i,r),j&&!d&&r.length>0&&n+c.length>1&&b.uniqueSort(i)}return j&&(P=u,C=s),p};return e?d(g):g}var u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N="sizzle"+1*new Date,O=a.document,P=0,Q=0,R=c(),S=c(),T=c(),U=function(a,b){return a===b&&(E=!0),0},V=1<<31,W={}.hasOwnProperty,X=[],Y=X.pop,Z=X.push,$=X.push,_=X.slice,aa=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},ba="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",ca="[\\x20\\t\\r\\n\\f]",da="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",ea=da.replace("w","w#"),fa="\\["+ca+"*("+da+")(?:"+ca+"*([*^$|!~]?=)"+ca+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+ea+"))|)"+ca+"*\\]",ga=":("+da+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+fa+")*)|.*)\\)|)",ha=new RegExp(ca+"+","g"),ia=new RegExp("^"+ca+"+|((?:^|[^\\\\])(?:\\\\.)*)"+ca+"+$","g"),ja=new RegExp("^"+ca+"*,"+ca+"*"),ka=new RegExp("^"+ca+"*([>+~]|"+ca+")"+ca+"*"),la=new RegExp("="+ca+"*([^\\]'\"]*?)"+ca+"*\\]","g"),ma=new RegExp(ga),na=new RegExp("^"+ea+"$"),oa={ID:new RegExp("^#("+da+")"),CLASS:new RegExp("^\\.("+da+")"),TAG:new RegExp("^("+da.replace("w","w*")+")"),ATTR:new RegExp("^"+fa),PSEUDO:new RegExp("^"+ga),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+ca+"*(even|odd|(([+-]|)(\\d*)n|)"+ca+"*(?:([+-]|)"+ca+"*(\\d+)|))"+ca+"*\\)|)","i"),bool:new RegExp("^(?:"+ba+")$","i"),needsContext:new RegExp("^"+ca+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+ca+"*((?:-\\d)?\\d*)"+ca+"*\\)|)(?=[^-]|$)","i")},pa=/^(?:input|select|textarea|button)$/i,qa=/^h\d$/i,ra=/^[^{]+\{\s*\[native \w/,sa=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ta=/[+~]/,ua=/'|\\/g,va=new RegExp("\\\\([\\da-f]{1,6}"+ca+"?|("+ca+")|.)","ig"),wa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},xa=function(){F()};try{$.apply(X=_.call(O.childNodes),O.childNodes),X[O.childNodes.length].nodeType}catch(ya){$={apply:X.length?function(a,b){Z.apply(a,_.call(b))}:function(a,b){for(var c=a.length,d=0;a[c++]=b[d++];);a.length=c-1}}}v=b.support={},y=b.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},F=b.setDocument=function(a){var b,c,d=a?a.ownerDocument||a:O;return d!==G&&9===d.nodeType&&d.documentElement?(G=d,H=d.documentElement,c=d.defaultView,c&&c!==c.top&&(c.addEventListener?c.addEventListener("unload",xa,!1):c.attachEvent&&c.attachEvent("onunload",xa)),I=!y(d),v.attributes=e(function(a){return a.className="i",!a.getAttribute("className")}),v.getElementsByTagName=e(function(a){return a.appendChild(d.createComment("")),!a.getElementsByTagName("*").length}),v.getElementsByClassName=ra.test(d.getElementsByClassName),v.getById=e(function(a){return H.appendChild(a).id=N,!d.getElementsByName||!d.getElementsByName(N).length}),v.getById?(w.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&I){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},w.filter.ID=function(a){var b=a.replace(va,wa);return function(a){return a.getAttribute("id")===b}}):(delete w.find.ID,w.filter.ID=function(a){var b=a.replace(va,wa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),w.find.TAG=v.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):v.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){for(;c=f[e++];)1===c.nodeType&&d.push(c);return d}return f},w.find.CLASS=v.getElementsByClassName&&function(a,b){return I?b.getElementsByClassName(a):void 0},K=[],J=[],(v.qsa=ra.test(d.querySelectorAll))&&(e(function(a){H.appendChild(a).innerHTML="<a id='"+N+"'></a><select id='"+N+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&J.push("[*^$]="+ca+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||J.push("\\["+ca+"*(?:value|"+ba+")"),a.querySelectorAll("[id~="+N+"-]").length||J.push("~="),a.querySelectorAll(":checked").length||J.push(":checked"),a.querySelectorAll("a#"+N+"+*").length||J.push(".#.+[+~]")}),e(function(a){var b=d.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&J.push("name"+ca+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||J.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),J.push(",.*:")})),(v.matchesSelector=ra.test(L=H.matches||H.webkitMatchesSelector||H.mozMatchesSelector||H.oMatchesSelector||H.msMatchesSelector))&&e(function(a){v.disconnectedMatch=L.call(a,"div"),L.call(a,"[s!='']:x"),K.push("!=",ga)}),J=J.length&&new RegExp(J.join("|")),K=K.length&&new RegExp(K.join("|")),b=ra.test(H.compareDocumentPosition),M=b||ra.test(H.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)for(;b=b.parentNode;)if(b===a)return!0;return!1},U=b?function(a,b){if(a===b)return E=!0,0;var c=!a.compareDocumentPosition-!b.compareDocumentPosition;return c?c:(c=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&c||!v.sortDetached&&b.compareDocumentPosition(a)===c?a===d||a.ownerDocument===O&&M(O,a)?-1:b===d||b.ownerDocument===O&&M(O,b)?1:D?aa(D,a)-aa(D,b):0:4&c?-1:1)}:function(a,b){if(a===b)return E=!0,0;var c,e=0,f=a.parentNode,h=b.parentNode,i=[a],j=[b];if(!f||!h)return a===d?-1:b===d?1:f?-1:h?1:D?aa(D,a)-aa(D,b):0;if(f===h)return g(a,b);for(c=a;c=c.parentNode;)i.unshift(c);for(c=b;c=c.parentNode;)j.unshift(c);for(;i[e]===j[e];)e++;return e?g(i[e],j[e]):i[e]===O?-1:j[e]===O?1:0},d):G},b.matches=function(a,c){return b(a,null,null,c)},b.matchesSelector=function(a,c){if((a.ownerDocument||a)!==G&&F(a),c=c.replace(la,"='$1']"),!(!v.matchesSelector||!I||K&&K.test(c)||J&&J.test(c)))try{var d=L.call(a,c);if(d||v.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return b(c,G,null,[a]).length>0},b.contains=function(a,b){return(a.ownerDocument||a)!==G&&F(a),M(a,b)},b.attr=function(a,b){(a.ownerDocument||a)!==G&&F(a);var c=w.attrHandle[b.toLowerCase()],d=c&&W.call(w.attrHandle,b.toLowerCase())?c(a,b,!I):void 0;return void 0!==d?d:v.attributes||!I?a.getAttribute(b):(d=a.getAttributeNode(b))&&d.specified?d.value:null},b.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},b.uniqueSort=function(a){var b,c=[],d=0,e=0;if(E=!v.detectDuplicates,D=!v.sortStable&&a.slice(0),a.sort(U),E){for(;b=a[e++];)b===a[e]&&(d=c.push(e));for(;d--;)a.splice(c[d],1)}return D=null,a},x=b.getText=function(a){var b,c="",d=0,e=a.nodeType;if(e){if(1===e||9===e||11===e){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=x(a)}else if(3===e||4===e)return a.nodeValue}else for(;b=a[d++];)c+=x(b);return c},w=b.selectors={cacheLength:50,createPseudo:d,match:oa,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(va,wa),a[3]=(a[3]||a[4]||a[5]||"").replace(va,wa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||b.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&b.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return oa.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&ma.test(c)&&(b=z(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(va,wa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=R[a+" "];return b||(b=new RegExp("(^|"+ca+")"+a+"("+ca+"|$)"))&&R(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,c,d){return function(e){var f=b.attr(e,a);return null==f?"!="===c:c?(f+="","="===c?f===d:"!="===c?f!==d:"^="===c?d&&0===f.indexOf(d):"*="===c?d&&f.indexOf(d)>-1:"$="===c?d&&f.slice(-d.length)===d:"~="===c?(" "+f.replace(ha," ")+" ").indexOf(d)>-1:"|="===c?f===d||f.slice(0,d.length+1)===d+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){for(;p;){for(l=b;l=l[p];)if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){for(k=q[N]||(q[N]={}),j=k[a]||[],n=j[0]===P&&j[1],m=j[0]===P&&j[2],l=n&&q.childNodes[n];l=++n&&l&&l[p]||(m=n=0)||o.pop();)if(1===l.nodeType&&++m&&l===b){k[a]=[P,n,m];break}}else if(s&&(j=(b[N]||(b[N]={}))[a])&&j[0]===P)m=j[1];else for(;(l=++n&&l&&l[p]||(m=n=0)||o.pop())&&((h?l.nodeName.toLowerCase()!==r:1!==l.nodeType)||!++m||(s&&((l[N]||(l[N]={}))[a]=[P,m]),l!==b)););return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,c){var e,f=w.pseudos[a]||w.setFilters[a.toLowerCase()]||b.error("unsupported pseudo: "+a);return f[N]?f(c):f.length>1?(e=[a,a,"",c],w.setFilters.hasOwnProperty(a.toLowerCase())?d(function(a,b){for(var d,e=f(a,c),g=e.length;g--;)d=aa(a,e[g]),a[d]=!(b[d]=e[g])}):function(a){return f(a,0,e)}):f}},pseudos:{not:d(function(a){var b=[],c=[],e=A(a.replace(ia,"$1"));return e[N]?d(function(a,b,c,d){for(var f,g=e(a,null,d,[]),h=a.length;h--;)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,d,f){return b[0]=a,e(b,null,f,c),b[0]=null,!c.pop()}}),has:d(function(a){return function(c){return b(a,c).length>0}}),contains:d(function(a){return a=a.replace(va,wa),function(b){return(b.textContent||b.innerText||x(b)).indexOf(a)>-1}}),lang:d(function(a){return na.test(a||"")||b.error("unsupported lang: "+a),a=a.replace(va,wa).toLowerCase(),function(b){var c;do if(c=I?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===H},focus:function(a){return a===G.activeElement&&(!G.hasFocus||G.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!w.pseudos.empty(a)},header:function(a){return qa.test(a.nodeName)},input:function(a){return pa.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:j(function(){return[0]}),last:j(function(a,b){return[b-1]}),eq:j(function(a,b,c){return[0>c?c+b:c]}),even:j(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:j(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:j(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:j(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},w.pseudos.nth=w.pseudos.eq;for(u in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})w.pseudos[u]=h(u);for(u in{submit:!0,reset:!0})w.pseudos[u]=i(u);return l.prototype=w.filters=w.pseudos,w.setFilters=new l,z=b.tokenize=function(a,c){var d,e,f,g,h,i,j,k=S[a+" "];if(k)return c?0:k.slice(0);for(h=a,i=[],j=w.preFilter;h;){(!d||(e=ja.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),d=!1,(e=ka.exec(h))&&(d=e.shift(),f.push({value:d,type:e[0].replace(ia," ")}),h=h.slice(d.length));for(g in w.filter)!(e=oa[g].exec(h))||j[g]&&!(e=j[g](e))||(d=e.shift(),f.push({value:d,type:g,matches:e}),h=h.slice(d.length));if(!d)break}return c?h.length:h?b.error(a):S(a,i).slice(0)},A=b.compile=function(a,b){var c,d=[],e=[],f=T[a+" "];if(!f){for(b||(b=z(a)),c=b.length;c--;)f=s(b[c]),f[N]?d.push(f):e.push(f);f=T(a,t(e,d)),f.selector=a}return f},B=b.select=function(a,b,c,d){var e,f,g,h,i,j="function"==typeof a&&a,l=!d&&z(a=j.selector||a);if(c=c||[],1===l.length){if(f=l[0]=l[0].slice(0),f.length>2&&"ID"===(g=f[0]).type&&v.getById&&9===b.nodeType&&I&&w.relative[f[1].type]){if(b=(w.find.ID(g.matches[0].replace(va,wa),b)||[])[0],!b)return c;j&&(b=b.parentNode),a=a.slice(f.shift().value.length)}for(e=oa.needsContext.test(a)?0:f.length;e--&&(g=f[e],!w.relative[h=g.type]);)if((i=w.find[h])&&(d=i(g.matches[0].replace(va,wa),ta.test(f[0].type)&&k(b.parentNode)||b))){if(f.splice(e,1),a=d.length&&m(f),!a)return $.apply(c,d),c;break}}return(j||A(a,l))(d,b,!I,c,ta.test(a)&&k(b.parentNode)||b),c},v.sortStable=N.split("").sort(U).join("")===N,v.detectDuplicates=!!E,F(),v.sortDetached=e(function(a){return 1&a.compareDocumentPosition(G.createElement("div"))}),e(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||f("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),v.attributes&&e(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||f("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),e(function(a){return null==a.getAttribute("disabled")})||f(ba,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),b}(a);_.find=ea,_.expr=ea.selectors,_.expr[":"]=_.expr.pseudos,_.unique=ea.uniqueSort,_.text=ea.getText,_.isXMLDoc=ea.isXML,_.contains=ea.contains;var fa=_.expr.match.needsContext,ga=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,ha=/^.[^:#\[\.,]*$/;_.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?_.find.matchesSelector(d,a)?[d]:[]:_.find.matches(a,_.grep(b,function(a){return 1===a.nodeType}))},_.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(_(a).filter(function(){for(b=0;c>b;b++)if(_.contains(e[b],this))return!0}));for(b=0;c>b;b++)_.find(a,e[b],d);return d=this.pushStack(c>1?_.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(d(this,a||[],!1))},not:function(a){return this.pushStack(d(this,a||[],!0))},is:function(a){return!!d(this,"string"==typeof a&&fa.test(a)?_(a):a||[],!1).length}});var ia,ja=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,ka=_.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:ja.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||ia).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof _?b[0]:b,_.merge(this,_.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:Z,!0)),ga.test(c[1])&&_.isPlainObject(b))for(c in b)_.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=Z.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=Z,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):_.isFunction(a)?"undefined"!=typeof ia.ready?ia.ready(a):a(_):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),_.makeArray(a,this))};ka.prototype=_.fn,ia=_(Z);var la=/^(?:parents|prev(?:Until|All))/,ma={children:!0,contents:!0,next:!0,prev:!0};_.extend({dir:function(a,b,c){for(var d=[],e=void 0!==c;(a=a[b])&&9!==a.nodeType;)if(1===a.nodeType){if(e&&_(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),_.fn.extend({has:function(a){var b=_(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(_.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=fa.test(a)||"string"!=typeof a?_(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&_.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?_.unique(f):f)},index:function(a){return a?"string"==typeof a?U.call(_(a),this[0]):U.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(_.unique(_.merge(this.get(),_(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}}),_.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return _.dir(a,"parentNode")},parentsUntil:function(a,b,c){return _.dir(a,"parentNode",c)},next:function(a){return e(a,"nextSibling")},prev:function(a){return e(a,"previousSibling")},nextAll:function(a){return _.dir(a,"nextSibling")},prevAll:function(a){return _.dir(a,"previousSibling")},nextUntil:function(a,b,c){return _.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return _.dir(a,"previousSibling",c)},siblings:function(a){return _.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return _.sibling(a.firstChild)},contents:function(a){return a.contentDocument||_.merge([],a.childNodes)}},function(a,b){_.fn[a]=function(c,d){var e=_.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=_.filter(d,e)),this.length>1&&(ma[a]||_.unique(e),la.test(a)&&e.reverse()),this.pushStack(e)}});var na=/\S+/g,oa={};_.Callbacks=function(a){a="string"==typeof a?oa[a]||f(a):_.extend({},a);var b,c,d,e,g,h,i=[],j=!a.once&&[],k=function(f){for(b=a.memory&&f,c=!0,h=e||0,e=0,g=i.length,d=!0;i&&g>h;h++)if(i[h].apply(f[0],f[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,i&&(j?j.length&&k(j.shift()):b?i=[]:l.disable())},l={add:function(){if(i){var c=i.length;!function f(b){_.each(b,function(b,c){var d=_.type(c);"function"===d?a.unique&&l.has(c)||i.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),d?g=i.length:b&&(e=c,k(b))}return this},remove:function(){return i&&_.each(arguments,function(a,b){for(var c;(c=_.inArray(b,i,c))>-1;)i.splice(c,1),d&&(g>=c&&g--,h>=c&&h--)}),this},has:function(a){return a?_.inArray(a,i)>-1:!(!i||!i.length)},empty:function(){return i=[],g=0,this},disable:function(){return i=j=b=void 0,this},disabled:function(){return!i},lock:function(){return j=void 0,b||l.disable(),this},locked:function(){return!j},fireWith:function(a,b){return!i||c&&!j||(b=b||[],b=[a,b.slice?b.slice():b],d?j.push(b):k(b)),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!c}};return l},_.extend({Deferred:function(a){var b=[["resolve","done",_.Callbacks("once memory"),"resolved"],["reject","fail",_.Callbacks("once memory"),"rejected"],["notify","progress",_.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return _.Deferred(function(c){_.each(b,function(b,f){var g=_.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&_.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?_.extend(a,d):d}},e={};return d.pipe=d.then,_.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b,c,d,e=0,f=R.call(arguments),g=f.length,h=1!==g||a&&_.isFunction(a.promise)?g:0,i=1===h?a:_.Deferred(),j=function(a,c,d){return function(e){c[a]=this,d[a]=arguments.length>1?R.call(arguments):e,d===b?i.notifyWith(c,d):--h||i.resolveWith(c,d)}};if(g>1)for(b=new Array(g),c=new Array(g),d=new Array(g);g>e;e++)f[e]&&_.isFunction(f[e].promise)?f[e].promise().done(j(e,d,f)).fail(i.reject).progress(j(e,c,b)):--h;return h||i.resolveWith(d,f),i.promise()}});var pa;_.fn.ready=function(a){return _.ready.promise().done(a),this},_.extend({isReady:!1,readyWait:1,holdReady:function(a){a?_.readyWait++:_.ready(!0)},ready:function(a){(a===!0?--_.readyWait:_.isReady)||(_.isReady=!0,a!==!0&&--_.readyWait>0||(pa.resolveWith(Z,[_]),_.fn.triggerHandler&&(_(Z).triggerHandler("ready"),_(Z).off("ready"))))}}),_.ready.promise=function(b){return pa||(pa=_.Deferred(),"complete"===Z.readyState?setTimeout(_.ready):(Z.addEventListener("DOMContentLoaded",g,!1),a.addEventListener("load",g,!1))),pa.promise(b)},_.ready.promise();var qa=_.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===_.type(c)){e=!0;for(h in c)_.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,_.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(_(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};_.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType},h.uid=1,h.accepts=_.acceptData,h.prototype={key:function(a){if(!h.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=h.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,_.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(_.isEmptyObject(f))_.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,_.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{_.isArray(b)?d=b.concat(b.map(_.camelCase)):(e=_.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(na)||[])),c=d.length;for(;c--;)delete g[d[c]]}},hasData:function(a){return!_.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var ra=new h,sa=new h,ta=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ua=/([A-Z])/g;_.extend({hasData:function(a){return sa.hasData(a)||ra.hasData(a)},data:function(a,b,c){return sa.access(a,b,c)},removeData:function(a,b){sa.remove(a,b)},_data:function(a,b,c){return ra.access(a,b,c)},_removeData:function(a,b){ra.remove(a,b)}}),_.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=sa.get(f),1===f.nodeType&&!ra.get(f,"hasDataAttrs"))){for(c=g.length;c--;)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=_.camelCase(d.slice(5)),i(f,d,e[d])));ra.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){sa.set(this,a)}):qa(this,function(b){var c,d=_.camelCase(a);if(f&&void 0===b){if(c=sa.get(f,a),void 0!==c)return c;if(c=sa.get(f,d),void 0!==c)return c;if(c=i(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=sa.get(this,d);sa.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&sa.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){sa.remove(this,a)})}}),_.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=ra.get(a,b),c&&(!d||_.isArray(c)?d=ra.access(a,b,_.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=_.queue(a,b),d=c.length,e=c.shift(),f=_._queueHooks(a,b),g=function(){_.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return ra.get(a,c)||ra.access(a,c,{empty:_.Callbacks("once memory").add(function(){ra.remove(a,[b+"queue",c])})})}}),_.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?_.queue(this[0],a):void 0===b?this:this.each(function(){var c=_.queue(this,a,b);_._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&_.dequeue(this,a)})},dequeue:function(a){return this.each(function(){_.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=_.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};for("string"!=typeof a&&(b=a,a=void 0),a=a||"fx";g--;)c=ra.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var va=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,wa=["Top","Right","Bottom","Left"],xa=function(a,b){return a=b||a,"none"===_.css(a,"display")||!_.contains(a.ownerDocument,a)},ya=/^(?:checkbox|radio)$/i;!function(){var a=Z.createDocumentFragment(),b=a.appendChild(Z.createElement("div")),c=Z.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),Y.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",Y.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var za="undefined";Y.focusinBubbles="onfocusin"in a;var Aa=/^key/,Ba=/^(?:mouse|pointer|contextmenu)|click/,Ca=/^(?:focusinfocus|focusoutblur)$/,Da=/^([^.]*)(?:\.(.+)|)$/;_.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=ra.get(a);if(q)for(c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=_.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return typeof _!==za&&_.event.triggered!==b.type?_.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(na)||[""],j=b.length;j--;)h=Da.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=_.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=_.event.special[n]||{},k=_.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&_.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),_.event.global[n]=!0)},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=ra.hasData(a)&&ra.get(a);if(q&&(i=q.events)){for(b=(b||"").match(na)||[""],j=b.length;j--;)if(h=Da.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){for(l=_.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;f--;)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||_.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)_.event.remove(a,n+b[j],c,d,!0);_.isEmptyObject(i)&&(delete q.handle,ra.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,j,k,l,m=[d||Z],n=X.call(b,"type")?b.type:b,o=X.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||Z,3!==d.nodeType&&8!==d.nodeType&&!Ca.test(n+_.event.triggered)&&(n.indexOf(".")>=0&&(o=n.split("."),n=o.shift(),o.sort()),j=n.indexOf(":")<0&&"on"+n,b=b[_.expando]?b:new _.Event(n,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=o.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),
c=null==c?[b]:_.makeArray(c,[b]),l=_.event.special[n]||{},e||!l.trigger||l.trigger.apply(d,c)!==!1)){if(!e&&!l.noBubble&&!_.isWindow(d)){for(i=l.delegateType||n,Ca.test(i+n)||(g=g.parentNode);g;g=g.parentNode)m.push(g),h=g;h===(d.ownerDocument||Z)&&m.push(h.defaultView||h.parentWindow||a)}for(f=0;(g=m[f++])&&!b.isPropagationStopped();)b.type=f>1?i:l.bindType||n,k=(ra.get(g,"events")||{})[b.type]&&ra.get(g,"handle"),k&&k.apply(g,c),k=j&&g[j],k&&k.apply&&_.acceptData(g)&&(b.result=k.apply(g,c),b.result===!1&&b.preventDefault());return b.type=n,e||b.isDefaultPrevented()||l._default&&l._default.apply(m.pop(),c)!==!1||!_.acceptData(d)||j&&_.isFunction(d[n])&&!_.isWindow(d)&&(h=d[j],h&&(d[j]=null),_.event.triggered=n,d[n](),_.event.triggered=void 0,h&&(d[j]=h)),b.result}},dispatch:function(a){a=_.event.fix(a);var b,c,d,e,f,g=[],h=R.call(arguments),i=(ra.get(this,"events")||{})[a.type]||[],j=_.event.special[a.type]||{};if(h[0]=a,a.delegateTarget=this,!j.preDispatch||j.preDispatch.call(this,a)!==!1){for(g=_.event.handlers.call(this,a,i),b=0;(e=g[b++])&&!a.isPropagationStopped();)for(a.currentTarget=e.elem,c=0;(f=e.handlers[c++])&&!a.isImmediatePropagationStopped();)(!a.namespace_re||a.namespace_re.test(f.namespace))&&(a.handleObj=f,a.data=f.data,d=((_.event.special[f.origType]||{}).handle||f.handler).apply(e.elem,h),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()));return j.postDispatch&&j.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?_(e,this).index(i)>=0:_.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||Z,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[_.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];for(g||(this.fixHooks[e]=g=Ba.test(e)?this.mouseHooks:Aa.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new _.Event(f),b=d.length;b--;)c=d[b],a[c]=f[c];return a.target||(a.target=Z),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==l()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===l()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&_.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return _.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=_.extend(new _.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?_.event.trigger(e,null,b):_.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},_.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},_.Event=function(a,b){return this instanceof _.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?j:k):this.type=a,b&&_.extend(this,b),this.timeStamp=a&&a.timeStamp||_.now(),void(this[_.expando]=!0)):new _.Event(a,b)},_.Event.prototype={isDefaultPrevented:k,isPropagationStopped:k,isImmediatePropagationStopped:k,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=j,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=j,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=j,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},_.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){_.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!_.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),Y.focusinBubbles||_.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){_.event.simulate(b,a.target,_.event.fix(a),!0)};_.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=ra.access(d,b);e||d.addEventListener(a,c,!0),ra.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=ra.access(d,b)-1;e?ra.access(d,b,e):(d.removeEventListener(a,c,!0),ra.remove(d,b))}}}),_.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=k;else if(!d)return this;return 1===e&&(f=d,d=function(a){return _().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=_.guid++)),this.each(function(){_.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,_(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=k),this.each(function(){_.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){_.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?_.event.trigger(a,b,c,!0):void 0}});var Ea=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,Fa=/<([\w:]+)/,Ga=/<|&#?\w+;/,Ha=/<(?:script|style|link)/i,Ia=/checked\s*(?:[^=]|=\s*.checked.)/i,Ja=/^$|\/(?:java|ecma)script/i,Ka=/^true\/(.*)/,La=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,Ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};Ma.optgroup=Ma.option,Ma.tbody=Ma.tfoot=Ma.colgroup=Ma.caption=Ma.thead,Ma.th=Ma.td,_.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=_.contains(a.ownerDocument,a);if(!(Y.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||_.isXMLDoc(a)))for(g=r(h),f=r(a),d=0,e=f.length;e>d;d++)s(f[d],g[d]);if(b)if(c)for(f=f||r(a),g=g||r(h),d=0,e=f.length;e>d;d++)q(f[d],g[d]);else q(a,h);return g=r(h,"script"),g.length>0&&p(g,!i&&r(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,n=a.length;n>m;m++)if(e=a[m],e||0===e)if("object"===_.type(e))_.merge(l,e.nodeType?[e]:e);else if(Ga.test(e)){for(f=f||k.appendChild(b.createElement("div")),g=(Fa.exec(e)||["",""])[1].toLowerCase(),h=Ma[g]||Ma._default,f.innerHTML=h[1]+e.replace(Ea,"<$1></$2>")+h[2],j=h[0];j--;)f=f.lastChild;_.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));for(k.textContent="",m=0;e=l[m++];)if((!d||-1===_.inArray(e,d))&&(i=_.contains(e.ownerDocument,e),f=r(k.appendChild(e),"script"),i&&p(f),c))for(j=0;e=f[j++];)Ja.test(e.type||"")&&c.push(e);return k},cleanData:function(a){for(var b,c,d,e,f=_.event.special,g=0;void 0!==(c=a[g]);g++){if(_.acceptData(c)&&(e=c[ra.expando],e&&(b=ra.cache[e]))){if(b.events)for(d in b.events)f[d]?_.event.remove(c,d):_.removeEvent(c,d,b.handle);ra.cache[e]&&delete ra.cache[e]}delete sa.cache[c[sa.expando]]}}}),_.fn.extend({text:function(a){return qa(this,function(a){return void 0===a?_.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=m(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=m(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?_.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||_.cleanData(r(c)),c.parentNode&&(b&&_.contains(c.ownerDocument,c)&&p(r(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(_.cleanData(r(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return _.clone(this,a,b)})},html:function(a){return qa(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Ha.test(a)&&!Ma[(Fa.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Ea,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(_.cleanData(r(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,_.cleanData(r(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=S.apply([],a);var c,d,e,f,g,h,i=0,j=this.length,k=this,l=j-1,m=a[0],p=_.isFunction(m);if(p||j>1&&"string"==typeof m&&!Y.checkClone&&Ia.test(m))return this.each(function(c){var d=k.eq(c);p&&(a[0]=m.call(this,c,d.html())),d.domManip(a,b)});if(j&&(c=_.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(e=_.map(r(c,"script"),n),f=e.length;j>i;i++)g=c,i!==l&&(g=_.clone(g,!0,!0),f&&_.merge(e,r(g,"script"))),b.call(this[i],g,i);if(f)for(h=e[e.length-1].ownerDocument,_.map(e,o),i=0;f>i;i++)g=e[i],Ja.test(g.type||"")&&!ra.access(g,"globalEval")&&_.contains(h,g)&&(g.src?_._evalUrl&&_._evalUrl(g.src):_.globalEval(g.textContent.replace(La,"")))}return this}}),_.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){_.fn[a]=function(a){for(var c,d=[],e=_(a),f=e.length-1,g=0;f>=g;g++)c=g===f?this:this.clone(!0),_(e[g])[b](c),T.apply(d,c.get());return this.pushStack(d)}});var Na,Oa={},Pa=/^margin/,Qa=new RegExp("^("+va+")(?!px)[a-z%]+$","i"),Ra=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};!function(){function b(){g.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",g.innerHTML="",e.appendChild(f);var b=a.getComputedStyle(g,null);c="1%"!==b.top,d="4px"===b.width,e.removeChild(f)}var c,d,e=Z.documentElement,f=Z.createElement("div"),g=Z.createElement("div");g.style&&(g.style.backgroundClip="content-box",g.cloneNode(!0).style.backgroundClip="",Y.clearCloneStyle="content-box"===g.style.backgroundClip,f.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",f.appendChild(g),a.getComputedStyle&&_.extend(Y,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return null==d&&b(),d},reliableMarginRight:function(){var b,c=g.appendChild(Z.createElement("div"));return c.style.cssText=g.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",g.style.width="1px",e.appendChild(f),b=!parseFloat(a.getComputedStyle(c,null).marginRight),e.removeChild(f),g.removeChild(c),b}}))}(),_.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Sa=/^(none|table(?!-c[ea]).+)/,Ta=new RegExp("^("+va+")(.*)$","i"),Ua=new RegExp("^([+-])=("+va+")","i"),Va={position:"absolute",visibility:"hidden",display:"block"},Wa={letterSpacing:"0",fontWeight:"400"},Xa=["Webkit","O","Moz","ms"];_.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=v(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=_.camelCase(b),i=a.style;return b=_.cssProps[h]||(_.cssProps[h]=x(i,h)),g=_.cssHooks[b]||_.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Ua.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(_.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||_.cssNumber[h]||(c+="px"),Y.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=_.camelCase(b);return b=_.cssProps[h]||(_.cssProps[h]=x(a.style,h)),g=_.cssHooks[b]||_.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=v(a,b,d)),"normal"===e&&b in Wa&&(e=Wa[b]),""===c||c?(f=parseFloat(e),c===!0||_.isNumeric(f)?f||0:e):e}}),_.each(["height","width"],function(a,b){_.cssHooks[b]={get:function(a,c,d){return c?Sa.test(_.css(a,"display"))&&0===a.offsetWidth?_.swap(a,Va,function(){return A(a,b,d)}):A(a,b,d):void 0},set:function(a,c,d){var e=d&&Ra(a);return y(a,c,d?z(a,b,d,"border-box"===_.css(a,"boxSizing",!1,e),e):0)}}}),_.cssHooks.marginRight=w(Y.reliableMarginRight,function(a,b){return b?_.swap(a,{display:"inline-block"},v,[a,"marginRight"]):void 0}),_.each({margin:"",padding:"",border:"Width"},function(a,b){_.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+wa[d]+b]=f[d]||f[d-2]||f[0];return e}},Pa.test(a)||(_.cssHooks[a+b].set=y)}),_.fn.extend({css:function(a,b){return qa(this,function(a,b,c){var d,e,f={},g=0;if(_.isArray(b)){for(d=Ra(a),e=b.length;e>g;g++)f[b[g]]=_.css(a,b[g],!1,d);return f}return void 0!==c?_.style(a,b,c):_.css(a,b)},a,b,arguments.length>1)},show:function(){return B(this,!0)},hide:function(){return B(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){xa(this)?_(this).show():_(this).hide()})}}),_.Tween=C,C.prototype={constructor:C,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(_.cssNumber[c]?"":"px")},cur:function(){var a=C.propHooks[this.prop];return a&&a.get?a.get(this):C.propHooks._default.get(this)},run:function(a){var b,c=C.propHooks[this.prop];return this.options.duration?this.pos=b=_.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):C.propHooks._default.set(this),this}},C.prototype.init.prototype=C.prototype,C.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=_.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){_.fx.step[a.prop]?_.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[_.cssProps[a.prop]]||_.cssHooks[a.prop])?_.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},C.propHooks.scrollTop=C.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},_.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},_.fx=C.prototype.init,_.fx.step={};var Ya,Za,$a=/^(?:toggle|show|hide)$/,_a=new RegExp("^(?:([+-])=|)("+va+")([a-z%]*)$","i"),ab=/queueHooks$/,bb=[G],cb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=_a.exec(b),f=e&&e[3]||(_.cssNumber[a]?"":"px"),g=(_.cssNumber[a]||"px"!==f&&+d)&&_a.exec(_.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,_.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};_.Animation=_.extend(I,{tweener:function(a,b){_.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],cb[c]=cb[c]||[],cb[c].unshift(b)},prefilter:function(a,b){b?bb.unshift(a):bb.push(a)}}),_.speed=function(a,b,c){var d=a&&"object"==typeof a?_.extend({},a):{complete:c||!c&&b||_.isFunction(a)&&a,duration:a,easing:c&&b||b&&!_.isFunction(b)&&b};return d.duration=_.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in _.fx.speeds?_.fx.speeds[d.duration]:_.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){_.isFunction(d.old)&&d.old.call(this),d.queue&&_.dequeue(this,d.queue)},d},_.fn.extend({fadeTo:function(a,b,c,d){return this.filter(xa).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=_.isEmptyObject(a),f=_.speed(b,c,d),g=function(){var b=I(this,_.extend({},a),f);(e||ra.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=_.timers,g=ra.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&_.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=ra.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=_.timers,g=d?d.length:0;for(c.finish=!0,_.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),_.each(["toggle","show","hide"],function(a,b){var c=_.fn[b];_.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(E(b,!0),a,d,e)}}),_.each({slideDown:E("show"),slideUp:E("hide"),slideToggle:E("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){_.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),_.timers=[],_.fx.tick=function(){var a,b=0,c=_.timers;for(Ya=_.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||_.fx.stop(),Ya=void 0},_.fx.timer=function(a){_.timers.push(a),a()?_.fx.start():_.timers.pop()},_.fx.interval=13,_.fx.start=function(){Za||(Za=setInterval(_.fx.tick,_.fx.interval))},_.fx.stop=function(){clearInterval(Za),Za=null},_.fx.speeds={slow:600,fast:200,_default:400},_.fn.delay=function(a,b){return a=_.fx?_.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=Z.createElement("input"),b=Z.createElement("select"),c=b.appendChild(Z.createElement("option"));a.type="checkbox",Y.checkOn=""!==a.value,Y.optSelected=c.selected,b.disabled=!0,Y.optDisabled=!c.disabled,a=Z.createElement("input"),a.value="t",a.type="radio",Y.radioValue="t"===a.value}();var db,eb,fb=_.expr.attrHandle;_.fn.extend({attr:function(a,b){return qa(this,_.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){_.removeAttr(this,a)})}}),_.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===za?_.prop(a,b,c):(1===f&&_.isXMLDoc(a)||(b=b.toLowerCase(),d=_.attrHooks[b]||(_.expr.match.bool.test(b)?eb:db)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=_.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void _.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(na);if(f&&1===a.nodeType)for(;c=f[e++];)d=_.propFix[c]||c,_.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!Y.radioValue&&"radio"===b&&_.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),eb={set:function(a,b,c){return b===!1?_.removeAttr(a,c):a.setAttribute(c,c),c}},_.each(_.expr.match.bool.source.match(/\w+/g),function(a,b){var c=fb[b]||_.find.attr;fb[b]=function(a,b,d){var e,f;return d||(f=fb[b],fb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,fb[b]=f),e}});var gb=/^(?:input|select|textarea|button)$/i;_.fn.extend({prop:function(a,b){return qa(this,_.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[_.propFix[a]||a]})}}),_.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!_.isXMLDoc(a),f&&(b=_.propFix[b]||b,e=_.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||gb.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),Y.optSelected||(_.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),_.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){_.propFix[this.toLowerCase()]=this});var hb=/[\t\r\n\f]/g;_.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(_.isFunction(a))return this.each(function(b){_(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(na)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(hb," "):" ")){for(f=0;e=b[f++];)d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=_.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(_.isFunction(a))return this.each(function(b){_(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(na)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(hb," "):"")){for(f=0;e=b[f++];)for(;d.indexOf(" "+e+" ")>=0;)d=d.replace(" "+e+" "," ");g=a?_.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(_.isFunction(a)?function(c){_(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c)for(var b,d=0,e=_(this),f=a.match(na)||[];b=f[d++];)e.hasClass(b)?e.removeClass(b):e.addClass(b);else(c===za||"boolean"===c)&&(this.className&&ra.set(this,"__className__",this.className),this.className=this.className||a===!1?"":ra.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(hb," ").indexOf(b)>=0)return!0;return!1}});var ib=/\r/g;_.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=_.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,_(this).val()):a,null==e?e="":"number"==typeof e?e+="":_.isArray(e)&&(e=_.map(e,function(a){return null==a?"":a+""})),b=_.valHooks[this.type]||_.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=_.valHooks[e.type]||_.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ib,""):null==c?"":c)}}}),_.extend({valHooks:{option:{get:function(a){var b=_.find.attr(a,"value");return null!=b?b:_.trim(_.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(Y.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&_.nodeName(c.parentNode,"optgroup"))){if(b=_(c).val(),f)return b;g.push(b)}return g},set:function(a,b){for(var c,d,e=a.options,f=_.makeArray(b),g=e.length;g--;)d=e[g],(d.selected=_.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),_.each(["radio","checkbox"],function(){_.valHooks[this]={set:function(a,b){return _.isArray(b)?a.checked=_.inArray(_(a).val(),b)>=0:void 0}},Y.checkOn||(_.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),_.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){_.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),_.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var jb=_.now(),kb=/\?/;_.parseJSON=function(a){return JSON.parse(a+"")},_.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&_.error("Invalid XML: "+a),b};var lb=/#.*$/,mb=/([?&])_=[^&]*/,nb=/^(.*?):[ \t]*([^\r\n]*)$/gm,ob=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,pb=/^(?:GET|HEAD)$/,qb=/^\/\//,rb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,sb={},tb={},ub="*/".concat("*"),vb=a.location.href,wb=rb.exec(vb.toLowerCase())||[];_.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:vb,type:"GET",isLocal:ob.test(wb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":ub,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":_.parseJSON,"text xml":_.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?L(L(a,_.ajaxSettings),b):L(_.ajaxSettings,a)},ajaxPrefilter:J(sb),ajaxTransport:J(tb),ajax:function(a,b){function c(a,b,c,g){var i,k,r,s,u,w=b;2!==t&&(t=2,h&&clearTimeout(h),d=void 0,f=g||"",v.readyState=a>0?4:0,i=a>=200&&300>a||304===a,c&&(s=M(l,v,c)),s=N(l,s,v,i),i?(l.ifModified&&(u=v.getResponseHeader("Last-Modified"),u&&(_.lastModified[e]=u),u=v.getResponseHeader("etag"),u&&(_.etag[e]=u)),204===a||"HEAD"===l.type?w="nocontent":304===a?w="notmodified":(w=s.state,k=s.data,r=s.error,i=!r)):(r=w,(a||!w)&&(w="error",0>a&&(a=0))),v.status=a,v.statusText=(b||w)+"",i?o.resolveWith(m,[k,w,v]):o.rejectWith(m,[v,w,r]),v.statusCode(q),q=void 0,j&&n.trigger(i?"ajaxSuccess":"ajaxError",[v,l,i?k:r]),p.fireWith(m,[v,w]),j&&(n.trigger("ajaxComplete",[v,l]),--_.active||_.event.trigger("ajaxStop")))}"object"==typeof a&&(b=a,a=void 0),b=b||{};var d,e,f,g,h,i,j,k,l=_.ajaxSetup({},b),m=l.context||l,n=l.context&&(m.nodeType||m.jquery)?_(m):_.event,o=_.Deferred(),p=_.Callbacks("once memory"),q=l.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!g)for(g={};b=nb.exec(f);)g[b[1].toLowerCase()]=b[2];b=g[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(l.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return d&&d.abort(b),c(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,l.url=((a||l.url||vb)+"").replace(lb,"").replace(qb,wb[1]+"//"),l.type=b.method||b.type||l.method||l.type,l.dataTypes=_.trim(l.dataType||"*").toLowerCase().match(na)||[""],null==l.crossDomain&&(i=rb.exec(l.url.toLowerCase()),l.crossDomain=!(!i||i[1]===wb[1]&&i[2]===wb[2]&&(i[3]||("http:"===i[1]?"80":"443"))===(wb[3]||("http:"===wb[1]?"80":"443")))),l.data&&l.processData&&"string"!=typeof l.data&&(l.data=_.param(l.data,l.traditional)),K(sb,l,b,v),2===t)return v;j=_.event&&l.global,j&&0===_.active++&&_.event.trigger("ajaxStart"),l.type=l.type.toUpperCase(),l.hasContent=!pb.test(l.type),e=l.url,l.hasContent||(l.data&&(e=l.url+=(kb.test(e)?"&":"?")+l.data,delete l.data),l.cache===!1&&(l.url=mb.test(e)?e.replace(mb,"$1_="+jb++):e+(kb.test(e)?"&":"?")+"_="+jb++)),l.ifModified&&(_.lastModified[e]&&v.setRequestHeader("If-Modified-Since",_.lastModified[e]),_.etag[e]&&v.setRequestHeader("If-None-Match",_.etag[e])),(l.data&&l.hasContent&&l.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",l.contentType),v.setRequestHeader("Accept",l.dataTypes[0]&&l.accepts[l.dataTypes[0]]?l.accepts[l.dataTypes[0]]+("*"!==l.dataTypes[0]?", "+ub+"; q=0.01":""):l.accepts["*"]);for(k in l.headers)v.setRequestHeader(k,l.headers[k]);if(l.beforeSend&&(l.beforeSend.call(m,v,l)===!1||2===t))return v.abort();u="abort";for(k in{success:1,error:1,complete:1})v[k](l[k]);if(d=K(tb,l,b,v)){v.readyState=1,j&&n.trigger("ajaxSend",[v,l]),l.async&&l.timeout>0&&(h=setTimeout(function(){v.abort("timeout")},l.timeout));try{t=1,d.send(r,c)}catch(w){if(!(2>t))throw w;c(-1,w)}}else c(-1,"No Transport");return v},getJSON:function(a,b,c){return _.get(a,b,c,"json")},getScript:function(a,b){return _.get(a,void 0,b,"script")}}),_.each(["get","post"],function(a,b){_[b]=function(a,c,d,e){return _.isFunction(c)&&(e=e||d,d=c,c=void 0),_.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),_._evalUrl=function(a){return _.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},_.fn.extend({wrapAll:function(a){var b;return _.isFunction(a)?this.each(function(b){_(this).wrapAll(a.call(this,b))}):(this[0]&&(b=_(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){for(var a=this;a.firstElementChild;)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(_.isFunction(a)?function(b){_(this).wrapInner(a.call(this,b))}:function(){var b=_(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=_.isFunction(a);return this.each(function(c){_(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){_.nodeName(this,"body")||_(this).replaceWith(this.childNodes)}).end()}}),_.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},_.expr.filters.visible=function(a){return!_.expr.filters.hidden(a)};var xb=/%20/g,yb=/\[\]$/,zb=/\r?\n/g,Ab=/^(?:submit|button|image|reset|file)$/i,Bb=/^(?:input|select|textarea|keygen)/i;_.param=function(a,b){var c,d=[],e=function(a,b){b=_.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b);

};if(void 0===b&&(b=_.ajaxSettings&&_.ajaxSettings.traditional),_.isArray(a)||a.jquery&&!_.isPlainObject(a))_.each(a,function(){e(this.name,this.value)});else for(c in a)O(c,a[c],b,e);return d.join("&").replace(xb,"+")},_.fn.extend({serialize:function(){return _.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=_.prop(this,"elements");return a?_.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!_(this).is(":disabled")&&Bb.test(this.nodeName)&&!Ab.test(a)&&(this.checked||!ya.test(a))}).map(function(a,b){var c=_(this).val();return null==c?null:_.isArray(c)?_.map(c,function(a){return{name:b.name,value:a.replace(zb,"\r\n")}}):{name:b.name,value:c.replace(zb,"\r\n")}}).get()}}),_.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Cb=0,Db={},Eb={0:200,1223:204},Fb=_.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Db)Db[a]()}),Y.cors=!!Fb&&"withCredentials"in Fb,Y.ajax=Fb=!!Fb,_.ajaxTransport(function(a){var b;return Y.cors||Fb&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Cb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Db[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Eb[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Db[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),_.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return _.globalEval(a),a}}}),_.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),_.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=_("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),Z.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Gb=[],Hb=/(=)\?(?=&|$)|\?\?/;_.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Gb.pop()||_.expando+"_"+jb++;return this[a]=!0,a}}),_.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Hb.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Hb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=_.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Hb,"$1"+e):b.jsonp!==!1&&(b.url+=(kb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||_.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Gb.push(e)),g&&_.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),_.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||Z;var d=ga.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=_.buildFragment([a],b,e),e&&e.length&&_(e).remove(),_.merge([],d.childNodes))};var Ib=_.fn.load;_.fn.load=function(a,b,c){if("string"!=typeof a&&Ib)return Ib.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=_.trim(a.slice(h)),a=a.slice(0,h)),_.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&_.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?_("<div>").append(_.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},_.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){_.fn[b]=function(a){return this.on(b,a)}}),_.expr.filters.animated=function(a){return _.grep(_.timers,function(b){return a===b.elem}).length};var Jb=a.document.documentElement;_.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=_.css(a,"position"),l=_(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=_.css(a,"top"),i=_.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),_.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},_.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){_.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,_.contains(b,d)?(typeof d.getBoundingClientRect!==za&&(e=d.getBoundingClientRect()),c=P(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===_.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),_.nodeName(a[0],"html")||(d=a.offset()),d.top+=_.css(a[0],"borderTopWidth",!0),d.left+=_.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-_.css(c,"marginTop",!0),left:b.left-d.left-_.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var a=this.offsetParent||Jb;a&&!_.nodeName(a,"html")&&"static"===_.css(a,"position");)a=a.offsetParent;return a||Jb})}}),_.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;_.fn[b]=function(e){return qa(this,function(b,e,f){var g=P(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),_.each(["top","left"],function(a,b){_.cssHooks[b]=w(Y.pixelPosition,function(a,c){return c?(c=v(a,b),Qa.test(c)?_(a).position()[b]+"px":c):void 0})}),_.each({Height:"height",Width:"width"},function(a,b){_.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){_.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return qa(this,function(b,c,d){var e;return _.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?_.css(b,c,g):_.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),_.fn.size=function(){return this.length},_.fn.andSelf=_.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return _});var Kb=a.jQuery,Lb=a.$;return _.noConflict=function(b){return a.$===_&&(a.$=Lb),b&&a.jQuery===_&&(a.jQuery=Kb),_},typeof b===za&&(a.jQuery=a.$=_),_});
},{}],"underscore":[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvbGliL2pzL2NvbW1vbnMuanMiLCJmb3VuZGF0aW9uIiwianF1ZXJ5IiwidW5kZXJzY29yZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3h2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBSZWN1cGVyYW1vcyBvIGNyZWFtb3MgdW4gb2JqZXRvIGRlIGVzcGFjaW8gZGUgbm9tYnJlc1xudmFyIEFwcCA9IHdpbmRvdy5BcHAgfHwge307XG5cblxuLy8gRXNwZWNpZmljYW1vcyBsb3MgbcOzZHVsb3MgcXVlIG5lY2VzaXRhbW9zIHF1ZSB0ZW5nYW4gYWNjZXNvIGdsb2JhbFxuLy8gRWouIEFwcC5Nb2R1bGVfQSA9IHJlcXVpcmUoJ21vZHVsZV9BJyk7XG5cblxuLy8gTmVjZXNpdGFtb3MgcXVlIGpRdWVyeSBmdW5jaW9uZSBjb21vIHVuYSB2YXJpYmxlIGdsb2JhbCB5IGNvbW8gdW5hIHZhcnVpYWJsZSBpbnN0YW5jaWFibGUgZGVzZGUgcmVxdWlyZVxud2luZG93LmpRdWVyeSAgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuXG4vLyBSZWVtcGxhemFtb3MgbyBjcmVhbW9zIGVsIGVzcGFjaW8gZGUgbm9tYnJlcyBnbG9iYWxcbndpbmRvdy5BcHAgPSBBcHA7IiwiLypcbiAqIEZvdW5kYXRpb24gUmVzcG9uc2l2ZSBMaWJyYXJ5XG4gKiBodHRwOi8vZm91bmRhdGlvbi56dXJiLmNvbVxuICogQ29weXJpZ2h0IDIwMTQsIFpVUkJcbiAqIEZyZWUgdG8gdXNlIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4qL1xuXG4oZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGhlYWRlcl9oZWxwZXJzID0gZnVuY3Rpb24gKGNsYXNzX2FycmF5KSB7XG4gICAgdmFyIGkgPSBjbGFzc19hcnJheS5sZW5ndGg7XG4gICAgdmFyIGhlYWQgPSAkKCdoZWFkJyk7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAoaGVhZC5oYXMoJy4nICsgY2xhc3NfYXJyYXlbaV0pLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBoZWFkLmFwcGVuZCgnPG1ldGEgY2xhc3M9XCInICsgY2xhc3NfYXJyYXlbaV0gKyAnXCIgLz4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaGVhZGVyX2hlbHBlcnMoW1xuICAgICdmb3VuZGF0aW9uLW1xLXNtYWxsJyxcbiAgICAnZm91bmRhdGlvbi1tcS1zbWFsbC1vbmx5JyxcbiAgICAnZm91bmRhdGlvbi1tcS1tZWRpdW0nLFxuICAgICdmb3VuZGF0aW9uLW1xLW1lZGl1bS1vbmx5JyxcbiAgICAnZm91bmRhdGlvbi1tcS1sYXJnZScsXG4gICAgJ2ZvdW5kYXRpb24tbXEtbGFyZ2Utb25seScsXG4gICAgJ2ZvdW5kYXRpb24tbXEteGxhcmdlJyxcbiAgICAnZm91bmRhdGlvbi1tcS14bGFyZ2Utb25seScsXG4gICAgJ2ZvdW5kYXRpb24tbXEteHhsYXJnZScsXG4gICAgJ2ZvdW5kYXRpb24tZGF0YS1hdHRyaWJ1dGUtbmFtZXNwYWNlJ10pO1xuXG4gIC8vIEVuYWJsZSBGYXN0Q2xpY2sgaWYgcHJlc2VudFxuXG4gICQoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0eXBlb2YgRmFzdENsaWNrICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gRG9uJ3QgYXR0YWNoIHRvIGJvZHkgaWYgdW5kZWZpbmVkXG4gICAgICBpZiAodHlwZW9mIGRvY3VtZW50LmJvZHkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIEZhc3RDbGljay5hdHRhY2goZG9jdW1lbnQuYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBwcml2YXRlIEZhc3QgU2VsZWN0b3Igd3JhcHBlcixcbiAgLy8gcmV0dXJucyBqUXVlcnkgb2JqZWN0LiBPbmx5IHVzZSB3aGVyZVxuICAvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgYXZhaWxhYmxlLlxuICB2YXIgUyA9IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoY29udGV4dCkge1xuICAgICAgICB2YXIgY29udDtcbiAgICAgICAgaWYgKGNvbnRleHQuanF1ZXJ5KSB7XG4gICAgICAgICAgY29udCA9IGNvbnRleHRbMF07XG4gICAgICAgICAgaWYgKCFjb250KSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udCA9IGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICQoY29udC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChzZWxlY3RvciwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gTmFtZXNwYWNlIGZ1bmN0aW9ucy5cblxuICB2YXIgYXR0cl9uYW1lID0gZnVuY3Rpb24gKGluaXQpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgaWYgKCFpbml0KSB7XG4gICAgICBhcnIucHVzaCgnZGF0YScpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgYXJyLnB1c2godGhpcy5uYW1lc3BhY2UpO1xuICAgIH1cbiAgICBhcnIucHVzaCh0aGlzLm5hbWUpO1xuXG4gICAgcmV0dXJuIGFyci5qb2luKCctJyk7XG4gIH07XG5cbiAgdmFyIGFkZF9uYW1lc3BhY2UgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgdmFyIHBhcnRzID0gc3RyLnNwbGl0KCctJyksXG4gICAgICAgIGkgPSBwYXJ0cy5sZW5ndGgsXG4gICAgICAgIGFyciA9IFtdO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKGkgIT09IDApIHtcbiAgICAgICAgYXJyLnB1c2gocGFydHNbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBhcnIucHVzaCh0aGlzLm5hbWVzcGFjZSwgcGFydHNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFyci5wdXNoKHBhcnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcnIucmV2ZXJzZSgpLmpvaW4oJy0nKTtcbiAgfTtcblxuICAvLyBFdmVudCBiaW5kaW5nIGFuZCBkYXRhLW9wdGlvbnMgdXBkYXRpbmcuXG5cbiAgdmFyIGJpbmRpbmdzID0gZnVuY3Rpb24gKG1ldGhvZCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYmluZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgc2hvdWxkX2JpbmRfZXZlbnRzID0gISR0aGlzLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICAkdGhpcy5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JywgJC5leHRlbmQoe30sIHNlbGYuc2V0dGluZ3MsIChvcHRpb25zIHx8IG1ldGhvZCksIHNlbGYuZGF0YV9vcHRpb25zKCR0aGlzKSkpO1xuXG4gICAgICAgICAgaWYgKHNob3VsZF9iaW5kX2V2ZW50cykge1xuICAgICAgICAgICAgc2VsZi5ldmVudHModGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgaWYgKFModGhpcy5zY29wZSkuaXMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArJ10nKSkge1xuICAgICAgYmluZC5jYWxsKHRoaXMuc2NvcGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBTKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyddJywgdGhpcy5zY29wZSkuZWFjaChiaW5kKTtcbiAgICB9XG4gICAgLy8gIyBQYXRjaCB0byBmaXggIzUwNDMgdG8gbW92ZSB0aGlzICphZnRlciogdGhlIGlmL2Vsc2UgY2xhdXNlIGluIG9yZGVyIGZvciBCYWNrYm9uZSBhbmQgc2ltaWxhciBmcmFtZXdvcmtzIHRvIGhhdmUgaW1wcm92ZWQgY29udHJvbCBvdmVyIGV2ZW50IGJpbmRpbmcgYW5kIGRhdGEtb3B0aW9ucyB1cGRhdGluZy5cbiAgICBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgfTtcblxuICB2YXIgc2luZ2xlX2ltYWdlX2xvYWRlZCA9IGZ1bmN0aW9uIChpbWFnZSwgY2FsbGJhY2spIHtcbiAgICBmdW5jdGlvbiBsb2FkZWQgKCkge1xuICAgICAgY2FsbGJhY2soaW1hZ2VbMF0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJpbmRMb2FkICgpIHtcbiAgICAgIHRoaXMub25lKCdsb2FkJywgbG9hZGVkKTtcblxuICAgICAgaWYgKC9NU0lFIChcXGQrXFwuXFxkKyk7Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgIHZhciBzcmMgPSB0aGlzLmF0dHIoICdzcmMnICksXG4gICAgICAgICAgICBwYXJhbSA9IHNyYy5tYXRjaCggL1xcPy8gKSA/ICcmJyA6ICc/JztcblxuICAgICAgICBwYXJhbSArPSAncmFuZG9tPScgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICB0aGlzLmF0dHIoJ3NyYycsIHNyYyArIHBhcmFtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWltYWdlLmF0dHIoJ3NyYycpKSB7XG4gICAgICBsb2FkZWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW1hZ2VbMF0uY29tcGxldGUgfHwgaW1hZ2VbMF0ucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgbG9hZGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJpbmRMb2FkLmNhbGwoaW1hZ2UpO1xuICAgIH1cbiAgfTtcblxuICAvKiEgbWF0Y2hNZWRpYSgpIHBvbHlmaWxsIC0gVGVzdCBhIENTUyBtZWRpYSB0eXBlL3F1ZXJ5IGluIEpTLiBBdXRob3JzICYgY29weXJpZ2h0IChjKSAyMDEyOiBTY290dCBKZWhsLCBQYXVsIElyaXNoLCBOaWNob2xhcyBaYWthcywgRGF2aWQgS25pZ2h0LiBEdWFsIE1JVC9CU0QgbGljZW5zZSAqL1xuXG4gIHdpbmRvdy5tYXRjaE1lZGlhIHx8ICh3aW5kb3cubWF0Y2hNZWRpYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgIC8vIEZvciBicm93c2VycyB0aGF0IHN1cHBvcnQgbWF0Y2hNZWRpdW0gYXBpIHN1Y2ggYXMgSUUgOSBhbmQgd2Via2l0XG4gICAgICB2YXIgc3R5bGVNZWRpYSA9ICh3aW5kb3cuc3R5bGVNZWRpYSB8fCB3aW5kb3cubWVkaWEpO1xuXG4gICAgICAvLyBGb3IgdGhvc2UgdGhhdCBkb24ndCBzdXBwb3J0IG1hdGNoTWVkaXVtXG4gICAgICBpZiAoIXN0eWxlTWVkaWEpIHtcbiAgICAgICAgICB2YXIgc3R5bGUgICAgICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxuICAgICAgICAgICAgICBzY3JpcHQgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSxcbiAgICAgICAgICAgICAgaW5mbyAgICAgICAgPSBudWxsO1xuXG4gICAgICAgICAgc3R5bGUudHlwZSAgPSAndGV4dC9jc3MnO1xuICAgICAgICAgIHN0eWxlLmlkICAgID0gJ21hdGNobWVkaWFqcy10ZXN0JztcblxuICAgICAgICAgIHNjcmlwdC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdHlsZSwgc2NyaXB0KTtcblxuICAgICAgICAgIC8vICdzdHlsZS5jdXJyZW50U3R5bGUnIGlzIHVzZWQgYnkgSUUgPD0gOCBhbmQgJ3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlJyBmb3IgYWxsIG90aGVyIGJyb3dzZXJzXG4gICAgICAgICAgaW5mbyA9ICgnZ2V0Q29tcHV0ZWRTdHlsZScgaW4gd2luZG93KSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzdHlsZSwgbnVsbCkgfHwgc3R5bGUuY3VycmVudFN0eWxlO1xuXG4gICAgICAgICAgc3R5bGVNZWRpYSA9IHtcbiAgICAgICAgICAgICAgbWF0Y2hNZWRpdW06IGZ1bmN0aW9uKG1lZGlhKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICdAbWVkaWEgJyArIG1lZGlhICsgJ3sgI21hdGNobWVkaWFqcy10ZXN0IHsgd2lkdGg6IDFweDsgfSB9JztcblxuICAgICAgICAgICAgICAgICAgLy8gJ3N0eWxlLnN0eWxlU2hlZXQnIGlzIHVzZWQgYnkgSUUgPD0gOCBhbmQgJ3N0eWxlLnRleHRDb250ZW50JyBmb3IgYWxsIG90aGVyIGJyb3dzZXJzXG4gICAgICAgICAgICAgICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgLy8gVGVzdCBpZiBtZWRpYSBxdWVyeSBpcyB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICByZXR1cm4gaW5mby53aWR0aCA9PT0gJzFweCc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24obWVkaWEpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBtYXRjaGVzOiBzdHlsZU1lZGlhLm1hdGNoTWVkaXVtKG1lZGlhIHx8ICdhbGwnKSxcbiAgICAgICAgICAgICAgbWVkaWE6IG1lZGlhIHx8ICdhbGwnXG4gICAgICAgICAgfTtcbiAgICAgIH07XG4gIH0oKSk7XG5cbiAgLypcbiAgICoganF1ZXJ5LnJlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vZ25hcmYzNy9qcXVlcnktcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAqIFJlcXVpcmVzIGpRdWVyeSAxLjgrXG4gICAqXG4gICAqIENvcHlyaWdodCAoYykgMjAxMiBDb3JleSBGcmFuZ1xuICAgKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gICAqL1xuXG4gIChmdW5jdGlvbihqUXVlcnkpIHtcblxuXG4gIC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBhZGFwdGVkIGZyb20gRXJpayBNw7ZsbGVyXG4gIC8vIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbiAgLy8gaHR0cDovL3BhdWxpcmlzaC5jb20vMjAxMS9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWFuaW1hdGluZy9cbiAgLy8gaHR0cDovL215Lm9wZXJhLmNvbS9lbW9sbGVyL2Jsb2cvMjAxMS8xMi8yMC9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtZm9yLXNtYXJ0LWVyLWFuaW1hdGluZ1xuXG4gIHZhciBhbmltYXRpbmcsXG4gICAgICBsYXN0VGltZSA9IDAsXG4gICAgICB2ZW5kb3JzID0gWyd3ZWJraXQnLCAnbW96J10sXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lLFxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG4gICAgICBqcXVlcnlGeEF2YWlsYWJsZSA9ICd1bmRlZmluZWQnICE9PSB0eXBlb2YgalF1ZXJ5LmZ4O1xuXG4gIGZvciAoOyBsYXN0VGltZSA8IHZlbmRvcnMubGVuZ3RoICYmICFyZXF1ZXN0QW5pbWF0aW9uRnJhbWU7IGxhc3RUaW1lKyspIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZScgXTtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJyBdIHx8XG4gICAgICB3aW5kb3dbIHZlbmRvcnNbbGFzdFRpbWVdICsgJ0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZScgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhZigpIHtcbiAgICBpZiAoYW5pbWF0aW5nKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmFmKTtcblxuICAgICAgaWYgKGpxdWVyeUZ4QXZhaWxhYmxlKSB7XG4gICAgICAgIGpRdWVyeS5meC50aWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKHJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuICAgIC8vIHVzZSByQUZcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuXG4gICAgaWYgKGpxdWVyeUZ4QXZhaWxhYmxlKSB7XG4gICAgICBqUXVlcnkuZngudGltZXIgPSBmdW5jdGlvbiAodGltZXIpIHtcbiAgICAgICAgaWYgKHRpbWVyKCkgJiYgalF1ZXJ5LnRpbWVycy5wdXNoKHRpbWVyKSAmJiAhYW5pbWF0aW5nKSB7XG4gICAgICAgICAgYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgICByYWYoKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgalF1ZXJ5LmZ4LnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gcG9seWZpbGxcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKSxcbiAgICAgICAgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuXG4gICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgIH07XG5cbiAgfVxuXG4gIH0oICQgKSk7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlUXVvdGVzIChzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycgfHwgc3RyaW5nIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXlsnXFxcXC9cIl0rfCg7XFxzP30pK3xbJ1xcXFwvXCJdKyQvZywgJycpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH1cblxuICB3aW5kb3cuRm91bmRhdGlvbiA9IHtcbiAgICBuYW1lIDogJ0ZvdW5kYXRpb24nLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBtZWRpYV9xdWVyaWVzIDoge1xuICAgICAgJ3NtYWxsJyAgICAgICA6IFMoJy5mb3VuZGF0aW9uLW1xLXNtYWxsJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAnc21hbGwtb25seScgIDogUygnLmZvdW5kYXRpb24tbXEtc21hbGwtb25seScpLmNzcygnZm9udC1mYW1pbHknKS5yZXBsYWNlKC9eW1xcL1xcXFwnXCJdK3woO1xccz99KSt8W1xcL1xcXFwnXCJdKyQvZywgJycpLFxuICAgICAgJ21lZGl1bScgICAgICA6IFMoJy5mb3VuZGF0aW9uLW1xLW1lZGl1bScpLmNzcygnZm9udC1mYW1pbHknKS5yZXBsYWNlKC9eW1xcL1xcXFwnXCJdK3woO1xccz99KSt8W1xcL1xcXFwnXCJdKyQvZywgJycpLFxuICAgICAgJ21lZGl1bS1vbmx5JyA6IFMoJy5mb3VuZGF0aW9uLW1xLW1lZGl1bS1vbmx5JykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAnbGFyZ2UnICAgICAgIDogUygnLmZvdW5kYXRpb24tbXEtbGFyZ2UnKS5jc3MoJ2ZvbnQtZmFtaWx5JykucmVwbGFjZSgvXltcXC9cXFxcJ1wiXSt8KDtcXHM/fSkrfFtcXC9cXFxcJ1wiXSskL2csICcnKSxcbiAgICAgICdsYXJnZS1vbmx5JyAgOiBTKCcuZm91bmRhdGlvbi1tcS1sYXJnZS1vbmx5JykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAneGxhcmdlJyAgICAgIDogUygnLmZvdW5kYXRpb24tbXEteGxhcmdlJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJyksXG4gICAgICAneGxhcmdlLW9ubHknIDogUygnLmZvdW5kYXRpb24tbXEteGxhcmdlLW9ubHknKS5jc3MoJ2ZvbnQtZmFtaWx5JykucmVwbGFjZSgvXltcXC9cXFxcJ1wiXSt8KDtcXHM/fSkrfFtcXC9cXFxcJ1wiXSskL2csICcnKSxcbiAgICAgICd4eGxhcmdlJyAgICAgOiBTKCcuZm91bmRhdGlvbi1tcS14eGxhcmdlJykuY3NzKCdmb250LWZhbWlseScpLnJlcGxhY2UoL15bXFwvXFxcXCdcIl0rfCg7XFxzP30pK3xbXFwvXFxcXCdcIl0rJC9nLCAnJylcbiAgICB9LFxuXG4gICAgc3R5bGVzaGVldCA6ICQoJzxzdHlsZT48L3N0eWxlPicpLmFwcGVuZFRvKCdoZWFkJylbMF0uc2hlZXQsXG5cbiAgICBnbG9iYWwgOiB7XG4gICAgICBuYW1lc3BhY2UgOiB1bmRlZmluZWRcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbGlicmFyaWVzLCBtZXRob2QsIG9wdGlvbnMsIHJlc3BvbnNlKSB7XG4gICAgICB2YXIgYXJncyA9IFtzY29wZSwgbWV0aG9kLCBvcHRpb25zLCByZXNwb25zZV0sXG4gICAgICAgICAgcmVzcG9uc2VzID0gW107XG5cbiAgICAgIC8vIGNoZWNrIFJUTFxuICAgICAgdGhpcy5ydGwgPSAvcnRsL2kudGVzdChTKCdodG1sJykuYXR0cignZGlyJykpO1xuXG4gICAgICAvLyBzZXQgZm91bmRhdGlvbiBnbG9iYWwgc2NvcGVcbiAgICAgIHRoaXMuc2NvcGUgPSBzY29wZSB8fCB0aGlzLnNjb3BlO1xuXG4gICAgICB0aGlzLnNldF9uYW1lc3BhY2UoKTtcblxuICAgICAgaWYgKGxpYnJhcmllcyAmJiB0eXBlb2YgbGlicmFyaWVzID09PSAnc3RyaW5nJyAmJiAhL3JlZmxvdy9pLnRlc3QobGlicmFyaWVzKSkge1xuICAgICAgICBpZiAodGhpcy5saWJzLmhhc093blByb3BlcnR5KGxpYnJhcmllcykpIHtcbiAgICAgICAgICByZXNwb25zZXMucHVzaCh0aGlzLmluaXRfbGliKGxpYnJhcmllcywgYXJncykpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBsaWIgaW4gdGhpcy5saWJzKSB7XG4gICAgICAgICAgcmVzcG9uc2VzLnB1c2godGhpcy5pbml0X2xpYihsaWIsIGxpYnJhcmllcykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIFMod2luZG93KS5sb2FkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgUyh3aW5kb3cpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5jbGVhcmluZycpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5kcm9wZG93bicpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5lcXVhbGl6ZXInKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uaW50ZXJjaGFuZ2UnKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uam95cmlkZScpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5tYWdlbGxhbicpXG4gICAgICAgICAgLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi50b3BiYXInKVxuICAgICAgICAgIC50cmlnZ2VyKCdyZXNpemUuZm5kdG4uc2xpZGVyJyk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNjb3BlO1xuICAgIH0sXG5cbiAgICBpbml0X2xpYiA6IGZ1bmN0aW9uIChsaWIsIGFyZ3MpIHtcbiAgICAgIGlmICh0aGlzLmxpYnMuaGFzT3duUHJvcGVydHkobGliKSkge1xuICAgICAgICB0aGlzLnBhdGNoKHRoaXMubGlic1tsaWJdKTtcblxuICAgICAgICBpZiAoYXJncyAmJiBhcmdzLmhhc093blByb3BlcnR5KGxpYikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5saWJzW2xpYl0uc2V0dGluZ3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMubGlic1tsaWJdLnNldHRpbmdzLCBhcmdzW2xpYl0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5saWJzW2xpYl0uZGVmYXVsdHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMubGlic1tsaWJdLmRlZmF1bHRzLCBhcmdzW2xpYl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLmxpYnNbbGliXS5pbml0LmFwcGx5KHRoaXMubGlic1tsaWJdLCBbdGhpcy5zY29wZSwgYXJnc1tsaWJdXSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzID0gYXJncyBpbnN0YW5jZW9mIEFycmF5ID8gYXJncyA6IG5ldyBBcnJheShhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlic1tsaWJdLmluaXQuYXBwbHkodGhpcy5saWJzW2xpYl0sIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfSxcblxuICAgIHBhdGNoIDogZnVuY3Rpb24gKGxpYikge1xuICAgICAgbGliLnNjb3BlID0gdGhpcy5zY29wZTtcbiAgICAgIGxpYi5uYW1lc3BhY2UgPSB0aGlzLmdsb2JhbC5uYW1lc3BhY2U7XG4gICAgICBsaWIucnRsID0gdGhpcy5ydGw7XG4gICAgICBsaWJbJ2RhdGFfb3B0aW9ucyddID0gdGhpcy51dGlscy5kYXRhX29wdGlvbnM7XG4gICAgICBsaWJbJ2F0dHJfbmFtZSddID0gYXR0cl9uYW1lO1xuICAgICAgbGliWydhZGRfbmFtZXNwYWNlJ10gPSBhZGRfbmFtZXNwYWNlO1xuICAgICAgbGliWydiaW5kaW5ncyddID0gYmluZGluZ3M7XG4gICAgICBsaWJbJ1MnXSA9IHRoaXMudXRpbHMuUztcbiAgICB9LFxuXG4gICAgaW5oZXJpdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kcykge1xuICAgICAgdmFyIG1ldGhvZHNfYXJyID0gbWV0aG9kcy5zcGxpdCgnICcpLFxuICAgICAgICAgIGkgPSBtZXRob2RzX2Fyci5sZW5ndGg7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHRoaXMudXRpbHMuaGFzT3duUHJvcGVydHkobWV0aG9kc19hcnJbaV0pKSB7XG4gICAgICAgICAgc2NvcGVbbWV0aG9kc19hcnJbaV1dID0gdGhpcy51dGlsc1ttZXRob2RzX2FycltpXV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0X25hbWVzcGFjZSA6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBEb24ndCBib3RoZXIgcmVhZGluZyB0aGUgbmFtZXNwYWNlIG91dCBvZiB0aGUgbWV0YSB0YWdcbiAgICAgIC8vICAgIGlmIHRoZSBuYW1lc3BhY2UgaGFzIGJlZW4gc2V0IGdsb2JhbGx5IGluIGphdmFzY3JpcHRcbiAgICAgIC8vXG4gICAgICAvLyBFeGFtcGxlOlxuICAgICAgLy8gICAgRm91bmRhdGlvbi5nbG9iYWwubmFtZXNwYWNlID0gJ215LW5hbWVzcGFjZSc7XG4gICAgICAvLyBvciBtYWtlIGl0IGFuIGVtcHR5IHN0cmluZzpcbiAgICAgIC8vICAgIEZvdW5kYXRpb24uZ2xvYmFsLm5hbWVzcGFjZSA9ICcnO1xuICAgICAgLy9cbiAgICAgIC8vXG5cbiAgICAgIC8vIElmIHRoZSBuYW1lc3BhY2UgaGFzIG5vdCBiZWVuIHNldCAoaXMgdW5kZWZpbmVkKSwgdHJ5IHRvIHJlYWQgaXQgb3V0IG9mIHRoZSBtZXRhIGVsZW1lbnQuXG4gICAgICAvLyBPdGhlcndpc2UgdXNlIHRoZSBnbG9iYWxseSBkZWZpbmVkIG5hbWVzcGFjZSwgZXZlbiBpZiBpdCdzIGVtcHR5ICgnJylcbiAgICAgIHZhciBuYW1lc3BhY2UgPSAoIHRoaXMuZ2xvYmFsLm5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkICkgPyAkKCcuZm91bmRhdGlvbi1kYXRhLWF0dHJpYnV0ZS1uYW1lc3BhY2UnKS5jc3MoJ2ZvbnQtZmFtaWx5JykgOiB0aGlzLmdsb2JhbC5uYW1lc3BhY2U7XG5cbiAgICAgIC8vIEZpbmFsbHksIGlmIHRoZSBuYW1zZXBhY2UgaXMgZWl0aGVyIHVuZGVmaW5lZCBvciBmYWxzZSwgc2V0IGl0IHRvIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgIC8vIE90aGVyd2lzZSB1c2UgdGhlIG5hbWVzcGFjZSB2YWx1ZS5cbiAgICAgIHRoaXMuZ2xvYmFsLm5hbWVzcGFjZSA9ICggbmFtZXNwYWNlID09PSB1bmRlZmluZWQgfHwgL2ZhbHNlL2kudGVzdChuYW1lc3BhY2UpICkgPyAnJyA6IG5hbWVzcGFjZTtcbiAgICB9LFxuXG4gICAgbGlicyA6IHt9LFxuXG4gICAgLy8gbWV0aG9kcyB0aGF0IGNhbiBiZSBpbmhlcml0ZWQgaW4gbGlicmFyaWVzXG4gICAgdXRpbHMgOiB7XG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgRmFzdCBTZWxlY3RvciB3cmFwcGVyIHJldHVybnMgalF1ZXJ5IG9iamVjdC4gT25seSB1c2Ugd2hlcmUgZ2V0RWxlbWVudEJ5SWRcbiAgICAgIC8vICAgIGlzIG5vdCBhdmFpbGFibGUuXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgU2VsZWN0b3IgKFN0cmluZyk6IENTUyBzZWxlY3RvciBkZXNjcmliaW5nIHRoZSBlbGVtZW50KHMpIHRvIGJlXG4gICAgICAvLyAgICByZXR1cm5lZCBhcyBhIGpRdWVyeSBvYmplY3QuXG4gICAgICAvL1xuICAgICAgLy8gICAgU2NvcGUgKFN0cmluZyk6IENTUyBzZWxlY3RvciBkZXNjcmliaW5nIHRoZSBhcmVhIHRvIGJlIHNlYXJjaGVkLiBEZWZhdWx0XG4gICAgICAvLyAgICBpcyBkb2N1bWVudC5cbiAgICAgIC8vXG4gICAgICAvLyBSZXR1cm5zOlxuICAgICAgLy8gICAgRWxlbWVudCAoalF1ZXJ5IE9iamVjdCk6IGpRdWVyeSBvYmplY3QgY29udGFpbmluZyBlbGVtZW50cyBtYXRjaGluZyB0aGVcbiAgICAgIC8vICAgIHNlbGVjdG9yIHdpdGhpbiB0aGUgc2NvcGUuXG4gICAgICBTIDogUyxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBFeGVjdXRlcyBhIGZ1bmN0aW9uIGEgbWF4IG9mIG9uY2UgZXZlcnkgbiBtaWxsaXNlY29uZHNcbiAgICAgIC8vXG4gICAgICAvLyBBcmd1bWVudHM6XG4gICAgICAvLyAgICBGdW5jIChGdW5jdGlvbik6IEZ1bmN0aW9uIHRvIGJlIHRocm90dGxlZC5cbiAgICAgIC8vXG4gICAgICAvLyAgICBEZWxheSAoSW50ZWdlcik6IEZ1bmN0aW9uIGV4ZWN1dGlvbiB0aHJlc2hvbGQgaW4gbWlsbGlzZWNvbmRzLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBMYXp5X2Z1bmN0aW9uIChGdW5jdGlvbik6IEZ1bmN0aW9uIHdpdGggdGhyb3R0bGluZyBhcHBsaWVkLlxuICAgICAgdGhyb3R0bGUgOiBmdW5jdGlvbiAoZnVuYywgZGVsYXkpIHtcbiAgICAgICAgdmFyIHRpbWVyID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgICAgIGlmICh0aW1lciA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBFeGVjdXRlcyBhIGZ1bmN0aW9uIHdoZW4gaXQgc3RvcHMgYmVpbmcgaW52b2tlZCBmb3IgbiBzZWNvbmRzXG4gICAgICAvLyAgICBNb2RpZmllZCB2ZXJzaW9uIG9mIF8uZGVib3VuY2UoKSBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIEZ1bmMgKEZ1bmN0aW9uKTogRnVuY3Rpb24gdG8gYmUgZGVib3VuY2VkLlxuICAgICAgLy9cbiAgICAgIC8vICAgIERlbGF5IChJbnRlZ2VyKTogRnVuY3Rpb24gZXhlY3V0aW9uIHRocmVzaG9sZCBpbiBtaWxsaXNlY29uZHMuXG4gICAgICAvL1xuICAgICAgLy8gICAgSW1tZWRpYXRlIChCb29sKTogV2hldGhlciB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAvLyAgICBvZiB0aGUgZGVsYXkgaW5zdGVhZCBvZiB0aGUgZW5kLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBMYXp5X2Z1bmN0aW9uIChGdW5jdGlvbik6IEZ1bmN0aW9uIHdpdGggZGVib3VuY2luZyBhcHBsaWVkLlxuICAgICAgZGVib3VuY2UgOiBmdW5jdGlvbiAoZnVuYywgZGVsYXksIGltbWVkaWF0ZSkge1xuICAgICAgICB2YXIgdGltZW91dCwgcmVzdWx0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIGRlbGF5KTtcbiAgICAgICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgUGFyc2VzIGRhdGEtb3B0aW9ucyBhdHRyaWJ1dGVcbiAgICAgIC8vXG4gICAgICAvLyBBcmd1bWVudHM6XG4gICAgICAvLyAgICBFbCAoalF1ZXJ5IE9iamVjdCk6IEVsZW1lbnQgdG8gYmUgcGFyc2VkLlxuICAgICAgLy9cbiAgICAgIC8vIFJldHVybnM6XG4gICAgICAvLyAgICBPcHRpb25zIChKYXZhc2NyaXB0IE9iamVjdCk6IENvbnRlbnRzIG9mIHRoZSBlbGVtZW50J3MgZGF0YS1vcHRpb25zXG4gICAgICAvLyAgICBhdHRyaWJ1dGUuXG4gICAgICBkYXRhX29wdGlvbnMgOiBmdW5jdGlvbiAoZWwsIGRhdGFfYXR0cl9uYW1lKSB7XG4gICAgICAgIGRhdGFfYXR0cl9uYW1lID0gZGF0YV9hdHRyX25hbWUgfHwgJ29wdGlvbnMnO1xuICAgICAgICB2YXIgb3B0cyA9IHt9LCBpaSwgcCwgb3B0c19hcnIsXG4gICAgICAgICAgICBkYXRhX29wdGlvbnMgPSBmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgICAgdmFyIG5hbWVzcGFjZSA9IEZvdW5kYXRpb24uZ2xvYmFsLm5hbWVzcGFjZTtcblxuICAgICAgICAgICAgICBpZiAobmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YShuYW1lc3BhY2UgKyAnLScgKyBkYXRhX2F0dHJfbmFtZSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gZWwuZGF0YShkYXRhX2F0dHJfbmFtZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciBjYWNoZWRfb3B0aW9ucyA9IGRhdGFfb3B0aW9ucyhlbCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjYWNoZWRfb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gY2FjaGVkX29wdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRzX2FyciA9IChjYWNoZWRfb3B0aW9ucyB8fCAnOicpLnNwbGl0KCc7Jyk7XG4gICAgICAgIGlpID0gb3B0c19hcnIubGVuZ3RoO1xuXG4gICAgICAgIGZ1bmN0aW9uIGlzTnVtYmVyIChvKSB7XG4gICAgICAgICAgcmV0dXJuICFpc05hTiAobyAtIDApICYmIG8gIT09IG51bGwgJiYgbyAhPT0gJycgJiYgbyAhPT0gZmFsc2UgJiYgbyAhPT0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRyaW0gKHN0cikge1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuICQudHJpbShzdHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGlpLS0pIHtcbiAgICAgICAgICBwID0gb3B0c19hcnJbaWldLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgcCA9IFtwWzBdLCBwLnNsaWNlKDEpLmpvaW4oJzonKV07XG5cbiAgICAgICAgICBpZiAoL3RydWUvaS50ZXN0KHBbMV0pKSB7XG4gICAgICAgICAgICBwWzFdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKC9mYWxzZS9pLnRlc3QocFsxXSkpIHtcbiAgICAgICAgICAgIHBbMV0gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzTnVtYmVyKHBbMV0pKSB7XG4gICAgICAgICAgICBpZiAocFsxXS5pbmRleE9mKCcuJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgIHBbMV0gPSBwYXJzZUludChwWzFdLCAxMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwWzFdID0gcGFyc2VGbG9hdChwWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocC5sZW5ndGggPT09IDIgJiYgcFswXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvcHRzW3RyaW0ocFswXSldID0gdHJpbShwWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0cztcbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgQWRkcyBKUy1yZWNvZ25pemFibGUgbWVkaWEgcXVlcmllc1xuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIE1lZGlhIChTdHJpbmcpOiBLZXkgc3RyaW5nIGZvciB0aGUgbWVkaWEgcXVlcnkgdG8gYmUgc3RvcmVkIGFzIGluXG4gICAgICAvLyAgICBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNcbiAgICAgIC8vXG4gICAgICAvLyAgICBDbGFzcyAoU3RyaW5nKTogQ2xhc3MgbmFtZSBmb3IgdGhlIGdlbmVyYXRlZCA8bWV0YT4gdGFnXG4gICAgICByZWdpc3Rlcl9tZWRpYSA6IGZ1bmN0aW9uIChtZWRpYSwgbWVkaWFfY2xhc3MpIHtcbiAgICAgICAgaWYgKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1ttZWRpYV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICQoJ2hlYWQnKS5hcHBlbmQoJzxtZXRhIGNsYXNzPVwiJyArIG1lZGlhX2NsYXNzICsgJ1wiLz4nKTtcbiAgICAgICAgICBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbbWVkaWFdID0gcmVtb3ZlUXVvdGVzKCQoJy4nICsgbWVkaWFfY2xhc3MpLmNzcygnZm9udC1mYW1pbHknKSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8vIERlc2NyaXB0aW9uOlxuICAgICAgLy8gICAgQWRkIGN1c3RvbSBDU1Mgd2l0aGluIGEgSlMtZGVmaW5lZCBtZWRpYSBxdWVyeVxuICAgICAgLy9cbiAgICAgIC8vIEFyZ3VtZW50czpcbiAgICAgIC8vICAgIFJ1bGUgKFN0cmluZyk6IENTUyBydWxlIHRvIGJlIGFwcGVuZGVkIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgIC8vXG4gICAgICAvLyAgICBNZWRpYSAoU3RyaW5nKTogT3B0aW9uYWwgbWVkaWEgcXVlcnkgc3RyaW5nIGZvciB0aGUgQ1NTIHJ1bGUgdG8gYmVcbiAgICAgIC8vICAgIG5lc3RlZCB1bmRlci5cbiAgICAgIGFkZF9jdXN0b21fcnVsZSA6IGZ1bmN0aW9uIChydWxlLCBtZWRpYSkge1xuICAgICAgICBpZiAobWVkaWEgPT09IHVuZGVmaW5lZCAmJiBGb3VuZGF0aW9uLnN0eWxlc2hlZXQpIHtcbiAgICAgICAgICBGb3VuZGF0aW9uLnN0eWxlc2hlZXQuaW5zZXJ0UnVsZShydWxlLCBGb3VuZGF0aW9uLnN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgcXVlcnkgPSBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbbWVkaWFdO1xuXG4gICAgICAgICAgaWYgKHF1ZXJ5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIEZvdW5kYXRpb24uc3R5bGVzaGVldC5pbnNlcnRSdWxlKCdAbWVkaWEgJyArXG4gICAgICAgICAgICAgIEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1ttZWRpYV0gKyAneyAnICsgcnVsZSArICcgfScsIEZvdW5kYXRpb24uc3R5bGVzaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBQZXJmb3JtcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gYW4gaW1hZ2UgaXMgZnVsbHkgbG9hZGVkXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgSW1hZ2UgKGpRdWVyeSBPYmplY3QpOiBJbWFnZShzKSB0byBjaGVjayBpZiBsb2FkZWQuXG4gICAgICAvL1xuICAgICAgLy8gICAgQ2FsbGJhY2sgKEZ1bmN0aW9uKTogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGltYWdlIGlzIGZ1bGx5IGxvYWRlZC5cbiAgICAgIGltYWdlX2xvYWRlZCA6IGZ1bmN0aW9uIChpbWFnZXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIHVubG9hZGVkID0gaW1hZ2VzLmxlbmd0aDtcblxuICAgICAgICBmdW5jdGlvbiBwaWN0dXJlc19oYXNfaGVpZ2h0KGltYWdlcykge1xuICAgICAgICAgIHZhciBwaWN0dXJlc19udW1iZXIgPSBpbWFnZXMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IHBpY3R1cmVzX251bWJlciAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZihpbWFnZXMuYXR0cignaGVpZ2h0JykgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1bmxvYWRlZCA9PT0gMCB8fCBwaWN0dXJlc19oYXNfaGVpZ2h0KGltYWdlcykpIHtcbiAgICAgICAgICBjYWxsYmFjayhpbWFnZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW1hZ2VzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNpbmdsZV9pbWFnZV9sb2FkZWQoc2VsZi5TKHRoaXMpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1bmxvYWRlZCAtPSAxO1xuICAgICAgICAgICAgaWYgKHVubG9hZGVkID09PSAwKSB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGltYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBSZXR1cm5zIGEgcmFuZG9tLCBhbHBoYW51bWVyaWMgc3RyaW5nXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgTGVuZ3RoIChJbnRlZ2VyKTogTGVuZ3RoIG9mIHN0cmluZyB0byBiZSBnZW5lcmF0ZWQuIERlZmF1bHRzIHRvIHJhbmRvbVxuICAgICAgLy8gICAgaW50ZWdlci5cbiAgICAgIC8vXG4gICAgICAvLyBSZXR1cm5zOlxuICAgICAgLy8gICAgUmFuZCAoU3RyaW5nKTogUHNldWRvLXJhbmRvbSwgYWxwaGFudW1lcmljIHN0cmluZy5cbiAgICAgIHJhbmRvbV9zdHIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5maWR4KSB7XG4gICAgICAgICAgdGhpcy5maWR4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZWZpeCA9IHRoaXMucHJlZml4IHx8IFsodGhpcy5uYW1lIHx8ICdGJyksICgrbmV3IERhdGUpLnRvU3RyaW5nKDM2KV0uam9pbignLScpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnByZWZpeCArICh0aGlzLmZpZHgrKykudG9TdHJpbmcoMzYpO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBIZWxwZXIgZm9yIHdpbmRvdy5tYXRjaE1lZGlhXG4gICAgICAvL1xuICAgICAgLy8gQXJndW1lbnRzOlxuICAgICAgLy8gICAgbXEgKFN0cmluZyk6IE1lZGlhIHF1ZXJ5XG4gICAgICAvL1xuICAgICAgLy8gUmV0dXJuczpcbiAgICAgIC8vICAgIChCb29sZWFuKTogV2hldGhlciB0aGUgbWVkaWEgcXVlcnkgcGFzc2VzIG9yIG5vdFxuICAgICAgbWF0Y2ggOiBmdW5jdGlvbiAobXEpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKG1xKS5tYXRjaGVzO1xuICAgICAgfSxcblxuICAgICAgLy8gRGVzY3JpcHRpb246XG4gICAgICAvLyAgICBIZWxwZXJzIGZvciBjaGVja2luZyBGb3VuZGF0aW9uIGRlZmF1bHQgbWVkaWEgcXVlcmllcyB3aXRoIEpTXG4gICAgICAvL1xuICAgICAgLy8gUmV0dXJuczpcbiAgICAgIC8vICAgIChCb29sZWFuKTogV2hldGhlciB0aGUgbWVkaWEgcXVlcnkgcGFzc2VzIG9yIG5vdFxuXG4gICAgICBpc19zbWFsbF91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLnNtYWxsKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX21lZGl1bV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSk7XG4gICAgICB9LFxuXG4gICAgICBpc19sYXJnZV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLmxhcmdlKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX3hsYXJnZV91cCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWF0Y2goRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLnhsYXJnZSk7XG4gICAgICB9LFxuXG4gICAgICBpc194eGxhcmdlX3VwIDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXRjaChGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMueHhsYXJnZSk7XG4gICAgICB9LFxuXG4gICAgICBpc19zbWFsbF9vbmx5IDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgIXRoaXMuaXNfbGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194bGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9LFxuXG4gICAgICBpc19tZWRpdW1fb25seSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgIXRoaXMuaXNfbGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194bGFyZ2VfdXAoKSAmJiAhdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9LFxuXG4gICAgICBpc19sYXJnZV9vbmx5IDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc19tZWRpdW1fdXAoKSAmJiB0aGlzLmlzX2xhcmdlX3VwKCkgJiYgIXRoaXMuaXNfeGxhcmdlX3VwKCkgJiYgIXRoaXMuaXNfeHhsYXJnZV91cCgpO1xuICAgICAgfSxcblxuICAgICAgaXNfeGxhcmdlX29ubHkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzX21lZGl1bV91cCgpICYmIHRoaXMuaXNfbGFyZ2VfdXAoKSAmJiB0aGlzLmlzX3hsYXJnZV91cCgpICYmICF0aGlzLmlzX3h4bGFyZ2VfdXAoKTtcbiAgICAgIH0sXG5cbiAgICAgIGlzX3h4bGFyZ2Vfb25seSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNfbWVkaXVtX3VwKCkgJiYgdGhpcy5pc19sYXJnZV91cCgpICYmIHRoaXMuaXNfeGxhcmdlX3VwKCkgJiYgdGhpcy5pc194eGxhcmdlX3VwKCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gICQuZm4uZm91bmRhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5pdC5hcHBseShGb3VuZGF0aW9uLCBbdGhpc10uY29uY2F0KGFyZ3MpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pO1xuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuYWJpZGUgPSB7XG4gICAgbmFtZSA6ICdhYmlkZScsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgbGl2ZV92YWxpZGF0ZSA6IHRydWUsXG4gICAgICB2YWxpZGF0ZV9vbl9ibHVyIDogdHJ1ZSxcbiAgICAgIC8vIHZhbGlkYXRlX29uOiAndGFiJywgLy8gdGFiICh3aGVuIHVzZXIgdGFicyBiZXR3ZWVuIGZpZWxkcyksIGNoYW5nZSAoaW5wdXQgY2hhbmdlcyksIG1hbnVhbCAoY2FsbCBjdXN0b20gZXZlbnRzKSBcbiAgICAgIGZvY3VzX29uX2ludmFsaWQgOiB0cnVlLFxuICAgICAgZXJyb3JfbGFiZWxzIDogdHJ1ZSwgLy8gbGFiZWxzIHdpdGggYSBmb3I9XCJpbnB1dElkXCIgd2lsbCByZWNpZXZlIGFuIGBlcnJvcmAgY2xhc3NcbiAgICAgIGVycm9yX2NsYXNzIDogJ2Vycm9yJyxcbiAgICAgIHRpbWVvdXQgOiAxMDAwLFxuICAgICAgcGF0dGVybnMgOiB7XG4gICAgICAgIGFscGhhIDogL15bYS16QS1aXSskLyxcbiAgICAgICAgYWxwaGFfbnVtZXJpYyA6IC9eW2EtekEtWjAtOV0rJC8sXG4gICAgICAgIGludGVnZXIgOiAvXlstK10/XFxkKyQvLFxuICAgICAgICBudW1iZXIgOiAvXlstK10/XFxkKig/OltcXC5cXCxdXFxkKyk/JC8sXG5cbiAgICAgICAgLy8gYW1leCwgdmlzYSwgZGluZXJzXG4gICAgICAgIGNhcmQgOiAvXig/OjRbMC05XXsxMn0oPzpbMC05XXszfSk/fDVbMS01XVswLTldezE0fXw2KD86MDExfDVbMC05XVswLTldKVswLTldezEyfXwzWzQ3XVswLTldezEzfXwzKD86MFswLTVdfFs2OF1bMC05XSlbMC05XXsxMX18KD86MjEzMXwxODAwfDM1XFxkezN9KVxcZHsxMX0pJC8sXG4gICAgICAgIGN2diA6IC9eKFswLTldKXszLDR9JC8sXG5cbiAgICAgICAgLy8gaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2Uvc3RhdGVzLW9mLXRoZS10eXBlLWF0dHJpYnV0ZS5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzXG4gICAgICAgIGVtYWlsIDogL15bYS16QS1aMC05LiEjJCUmJyorXFwvPT9eX2B7fH1+LV0rQFthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrJC8sXG5cbiAgICAgICAgLy8gaHR0cDovL2Jsb2dzLmxzZS5hYy51ay9sdGkvMjAwOC8wNC8yMy9hLXJlZ3VsYXItZXhwcmVzc2lvbi10by1tYXRjaC1hbnktdXJsL1xuICAgICAgICB1cmw6IC9eKGh0dHBzP3xmdHB8ZmlsZXxzc2gpOlxcL1xcLyhbLTs6Jj1cXCtcXCQsXFx3XStAezF9KT8oWy1BLVphLXowLTlcXC5dKykrOj8oXFxkKyk/KChcXC9bLVxcK34lXFwvXFwuXFx3XSspP1xcPz8oWy1cXCs9JjslQFxcLlxcd10rKT8jPyhbXFx3XSspPyk/LyxcbiAgICAgICAgLy8gYWJjLmRlXG4gICAgICAgIGRvbWFpbiA6IC9eKFthLXpBLVowLTldKFthLXpBLVowLTlcXC1dezAsNjF9W2EtekEtWjAtOV0pP1xcLikrW2EtekEtWl17Miw4fSQvLFxuXG4gICAgICAgIGRhdGV0aW1lIDogL14oWzAtMl1bMC05XXszfSlcXC0oWzAtMV1bMC05XSlcXC0oWzAtM11bMC05XSlUKFswLTVdWzAtOV0pXFw6KFswLTVdWzAtOV0pXFw6KFswLTVdWzAtOV0pKFp8KFtcXC1cXCtdKFswLTFdWzAtOV0pXFw6MDApKSQvLFxuICAgICAgICAvLyBZWVlZLU1NLUREXG4gICAgICAgIGRhdGUgOiAvKD86MTl8MjApWzAtOV17Mn0tKD86KD86MFsxLTldfDFbMC0yXSktKD86MFsxLTldfDFbMC05XXwyWzAtOV0pfCg/Oig/ITAyKSg/OjBbMS05XXwxWzAtMl0pLSg/OjMwKSl8KD86KD86MFsxMzU3OF18MVswMl0pLTMxKSkkLyxcbiAgICAgICAgLy8gSEg6TU06U1NcbiAgICAgICAgdGltZSA6IC9eKDBbMC05XXwxWzAtOV18MlswLTNdKSg6WzAtNV1bMC05XSl7Mn0kLyxcbiAgICAgICAgZGF0ZUlTTyA6IC9eXFxkezR9W1xcL1xcLV1cXGR7MSwyfVtcXC9cXC1dXFxkezEsMn0kLyxcbiAgICAgICAgLy8gTU0vREQvWVlZWVxuICAgICAgICBtb250aF9kYXlfeWVhciA6IC9eKDBbMS05XXwxWzAxMl0pWy0gXFwvLl0oMFsxLTldfFsxMl1bMC05XXwzWzAxXSlbLSBcXC8uXVxcZHs0fSQvLFxuICAgICAgICAvLyBERC9NTS9ZWVlZXG4gICAgICAgIGRheV9tb250aF95ZWFyIDogL14oMFsxLTldfFsxMl1bMC05XXwzWzAxXSlbLSBcXC8uXSgwWzEtOV18MVswMTJdKVstIFxcLy5dXFxkezR9JC8sXG5cbiAgICAgICAgLy8gI0ZGRiBvciAjRkZGRkZGXG4gICAgICAgIGNvbG9yIDogL14jPyhbYS1mQS1GMC05XXs2fXxbYS1mQS1GMC05XXszfSkkL1xuICAgICAgfSxcbiAgICAgIHZhbGlkYXRvcnMgOiB7XG4gICAgICAgIGVxdWFsVG8gOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkLCBwYXJlbnQpIHtcbiAgICAgICAgICB2YXIgZnJvbSAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWVxdWFsdG8nKSkpLnZhbHVlLFxuICAgICAgICAgICAgICB0byAgICA9IGVsLnZhbHVlLFxuICAgICAgICAgICAgICB2YWxpZCA9IChmcm9tID09PSB0byk7XG5cbiAgICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdGltZXIgOiBudWxsLFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGZvcm0gPSBzZWxmLlMoc2NvcGUpLmF0dHIoJ25vdmFsaWRhdGUnLCAnbm92YWxpZGF0ZScpLFxuICAgICAgICAgIHNldHRpbmdzID0gZm9ybS5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwge307XG5cbiAgICAgIHRoaXMuaW52YWxpZF9hdHRyID0gdGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWludmFsaWQnKTtcblxuICAgICAgZnVuY3Rpb24gdmFsaWRhdGUob3JpZ2luYWxTZWxmLCBlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVyKTtcbiAgICAgICAgc2VsZi50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYudmFsaWRhdGUoW29yaWdpbmFsU2VsZl0sIGUpO1xuICAgICAgICB9LmJpbmQob3JpZ2luYWxTZWxmKSwgc2V0dGluZ3MudGltZW91dCk7XG4gICAgICB9XG5cblxuICAgICAgZm9ybVxuICAgICAgICAub2ZmKCcuYWJpZGUnKVxuICAgICAgICAub24oJ3N1Ym1pdC5mbmR0bi5hYmlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIGlzX2FqYXggPSAvYWpheC9pLnRlc3Qoc2VsZi5TKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpO1xuICAgICAgICAgIHJldHVybiBzZWxmLnZhbGlkYXRlKHNlbGYuUyh0aGlzKS5maW5kKCdpbnB1dCwgdGV4dGFyZWEsIHNlbGVjdCcpLm5vdChcIjpoaWRkZW4sIFtkYXRhLWFiaWRlLWlnbm9yZV1cIikuZ2V0KCksIGUsIGlzX2FqYXgpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ3ZhbGlkYXRlLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdtYW51YWwnKSB7XG4gICAgICAgICAgICBzZWxmLnZhbGlkYXRlKFtlLnRhcmdldF0sIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdyZXNldCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbGYucmVzZXQoJCh0aGlzKSwgZSk7ICAgICAgICAgIFxuICAgICAgICB9KVxuICAgICAgICAuZmluZCgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnKS5ub3QoXCI6aGlkZGVuLCBbZGF0YS1hYmlkZS1pZ25vcmVdXCIpXG4gICAgICAgICAgLm9mZignLmFiaWRlJylcbiAgICAgICAgICAub24oJ2JsdXIuZm5kdG4uYWJpZGUgY2hhbmdlLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIG9sZCBzZXR0aW5ncyBmYWxsYmFja1xuICAgICAgICAgICAgLy8gd2lsbCBiZSBkZXByZWNhdGVkIHdpdGggRjYgcmVsZWFzZVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlX29uX2JsdXIgJiYgc2V0dGluZ3MudmFsaWRhdGVfb25fYmx1ciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICB2YWxpZGF0ZSh0aGlzLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5ldyBzZXR0aW5ncyBjb21iaW5pbmcgdmFsaWRhdGUgb3B0aW9ucyBpbnRvIG9uZSBzZXR0aW5nXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdrZXlkb3duLmZuZHRuLmFiaWRlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIG9sZCBzZXR0aW5ncyBmYWxsYmFja1xuICAgICAgICAgICAgLy8gd2lsbCBiZSBkZXByZWNhdGVkIHdpdGggRjYgcmVsZWFzZVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmxpdmVfdmFsaWRhdGUgJiYgc2V0dGluZ3MubGl2ZV92YWxpZGF0ZSA9PT0gdHJ1ZSAmJiBlLndoaWNoICE9IDkpIHtcbiAgICAgICAgICAgICAgdmFsaWRhdGUodGhpcywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBuZXcgc2V0dGluZ3MgY29tYmluaW5nIHZhbGlkYXRlIG9wdGlvbnMgaW50byBvbmUgc2V0dGluZ1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlX29uID09PSAndGFiJyAmJiBlLndoaWNoID09PSA5KSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2V0dGluZ3MudmFsaWRhdGVfb24gPT09ICdjaGFuZ2UnKSB7XG4gICAgICAgICAgICAgIHZhbGlkYXRlKHRoaXMsIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBhZHxpUGhvbmV8QW5kcm9pZHxCbGFja0JlcnJ5fFdpbmRvd3MgUGhvbmV8d2ViT1MvaSkpIHtcbiAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKGUudGFyZ2V0KS5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlc2V0IDogZnVuY3Rpb24gKGZvcm0sIGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIGZvcm0ucmVtb3ZlQXR0cihzZWxmLmludmFsaWRfYXR0cik7XG5cbiAgICAgICQoJ1snICsgc2VsZi5pbnZhbGlkX2F0dHIgKyAnXScsIGZvcm0pLnJlbW92ZUF0dHIoc2VsZi5pbnZhbGlkX2F0dHIpO1xuICAgICAgJCgnLicgKyBzZWxmLnNldHRpbmdzLmVycm9yX2NsYXNzLCBmb3JtKS5ub3QoJ3NtYWxsJykucmVtb3ZlQ2xhc3Moc2VsZi5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAkKCc6aW5wdXQnLCBmb3JtKS5ub3QoJzpidXR0b24sIDpzdWJtaXQsIDpyZXNldCwgOmhpZGRlbiwgW2RhdGEtYWJpZGUtaWdub3JlXScpLnZhbCgnJykucmVtb3ZlQXR0cihzZWxmLmludmFsaWRfYXR0cik7XG4gICAgfSxcblxuICAgIHZhbGlkYXRlIDogZnVuY3Rpb24gKGVscywgZSwgaXNfYWpheCkge1xuICAgICAgdmFyIHZhbGlkYXRpb25zID0gdGhpcy5wYXJzZV9wYXR0ZXJucyhlbHMpLFxuICAgICAgICAgIHZhbGlkYXRpb25fY291bnQgPSB2YWxpZGF0aW9ucy5sZW5ndGgsXG4gICAgICAgICAgZm9ybSA9IHRoaXMuUyhlbHNbMF0pLmNsb3Nlc3QoJ2Zvcm0nKSxcbiAgICAgICAgICBzdWJtaXRfZXZlbnQgPSAvc3VibWl0Ly50ZXN0KGUudHlwZSk7XG5cbiAgICAgIC8vIEhhcyB0byBjb3VudCB1cCB0byBtYWtlIHN1cmUgdGhlIGZvY3VzIGdldHMgYXBwbGllZCB0byB0aGUgdG9wIGVycm9yXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbGlkYXRpb25fY291bnQ7IGkrKykge1xuICAgICAgICBpZiAoIXZhbGlkYXRpb25zW2ldICYmIChzdWJtaXRfZXZlbnQgfHwgaXNfYWpheCkpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5mb2N1c19vbl9pbnZhbGlkKSB7XG4gICAgICAgICAgICBlbHNbaV0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybS50cmlnZ2VyKCdpbnZhbGlkLmZuZHRuLmFiaWRlJyk7XG4gICAgICAgICAgdGhpcy5TKGVsc1tpXSkuY2xvc2VzdCgnZm9ybScpLmF0dHIodGhpcy5pbnZhbGlkX2F0dHIsICcnKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1Ym1pdF9ldmVudCB8fCBpc19hamF4KSB7XG4gICAgICAgIGZvcm0udHJpZ2dlcigndmFsaWQuZm5kdG4uYWJpZGUnKTtcbiAgICAgIH1cblxuICAgICAgZm9ybS5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKTtcblxuICAgICAgaWYgKGlzX2FqYXgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcGFyc2VfcGF0dGVybnMgOiBmdW5jdGlvbiAoZWxzKSB7XG4gICAgICB2YXIgaSA9IGVscy5sZW5ndGgsXG4gICAgICAgICAgZWxfcGF0dGVybnMgPSBbXTtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBlbF9wYXR0ZXJucy5wdXNoKHRoaXMucGF0dGVybihlbHNbaV0pKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tfdmFsaWRhdGlvbl9hbmRfYXBwbHlfc3R5bGVzKGVsX3BhdHRlcm5zKTtcbiAgICB9LFxuXG4gICAgcGF0dGVybiA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHR5cGUgPSBlbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSxcbiAgICAgICAgICByZXF1aXJlZCA9IHR5cGVvZiBlbC5nZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJykgPT09ICdzdHJpbmcnO1xuXG4gICAgICB2YXIgcGF0dGVybiA9IGVsLmdldEF0dHJpYnV0ZSgncGF0dGVybicpIHx8ICcnO1xuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYXR0ZXJucy5oYXNPd25Qcm9wZXJ0eShwYXR0ZXJuKSAmJiBwYXR0ZXJuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtlbCwgdGhpcy5zZXR0aW5ncy5wYXR0ZXJuc1twYXR0ZXJuXSwgcmVxdWlyZWRdO1xuICAgICAgfSBlbHNlIGlmIChwYXR0ZXJuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIFtlbCwgbmV3IFJlZ0V4cChwYXR0ZXJuKSwgcmVxdWlyZWRdO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYXR0ZXJucy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSkge1xuICAgICAgICByZXR1cm4gW2VsLCB0aGlzLnNldHRpbmdzLnBhdHRlcm5zW3R5cGVdLCByZXF1aXJlZF07XG4gICAgICB9XG5cbiAgICAgIHBhdHRlcm4gPSAvLiovO1xuXG4gICAgICByZXR1cm4gW2VsLCBwYXR0ZXJuLCByZXF1aXJlZF07XG4gICAgfSxcblxuICAgIC8vIFRPRE86IEJyZWFrIHRoaXMgdXAgaW50byBzbWFsbGVyIG1ldGhvZHMsIGdldHRpbmcgaGFyZCB0byByZWFkLlxuICAgIGNoZWNrX3ZhbGlkYXRpb25fYW5kX2FwcGx5X3N0eWxlcyA6IGZ1bmN0aW9uIChlbF9wYXR0ZXJucykge1xuICAgICAgdmFyIGkgPSBlbF9wYXR0ZXJucy5sZW5ndGgsXG4gICAgICAgICAgdmFsaWRhdGlvbnMgPSBbXSxcbiAgICAgICAgICBmb3JtID0gdGhpcy5TKGVsX3BhdHRlcm5zWzBdWzBdKS5jbG9zZXN0KCdbZGF0YS0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnXScpLFxuICAgICAgICAgIHNldHRpbmdzID0gZm9ybS5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwge307XG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciBlbCA9IGVsX3BhdHRlcm5zW2ldWzBdLFxuICAgICAgICAgICAgcmVxdWlyZWQgPSBlbF9wYXR0ZXJuc1tpXVsyXSxcbiAgICAgICAgICAgIHZhbHVlID0gZWwudmFsdWUudHJpbSgpLFxuICAgICAgICAgICAgZGlyZWN0X3BhcmVudCA9IHRoaXMuUyhlbCkucGFyZW50KCksXG4gICAgICAgICAgICB2YWxpZGF0b3IgPSBlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWFiaWRlLXZhbGlkYXRvcicpKSxcbiAgICAgICAgICAgIGlzX3JhZGlvID0gZWwudHlwZSA9PT0gJ3JhZGlvJyxcbiAgICAgICAgICAgIGlzX2NoZWNrYm94ID0gZWwudHlwZSA9PT0gJ2NoZWNrYm94JyxcbiAgICAgICAgICAgIGxhYmVsID0gdGhpcy5TKCdsYWJlbFtmb3I9XCInICsgZWwuZ2V0QXR0cmlidXRlKCdpZCcpICsgJ1wiXScpLFxuICAgICAgICAgICAgdmFsaWRfbGVuZ3RoID0gKHJlcXVpcmVkKSA/IChlbC52YWx1ZS5sZW5ndGggPiAwKSA6IHRydWUsXG4gICAgICAgICAgICBlbF92YWxpZGF0aW9ucyA9IFtdO1xuXG4gICAgICAgIHZhciBwYXJlbnQsIHZhbGlkO1xuXG4gICAgICAgIC8vIHN1cHBvcnQgb2xkIHdheSB0byBkbyBlcXVhbFRvIHZhbGlkYXRpb25zXG4gICAgICAgIGlmIChlbC5nZXRBdHRyaWJ1dGUodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWVxdWFsdG8nKSkpIHsgdmFsaWRhdG9yID0gJ2VxdWFsVG8nIH1cblxuICAgICAgICBpZiAoIWRpcmVjdF9wYXJlbnQuaXMoJ2xhYmVsJykpIHtcbiAgICAgICAgICBwYXJlbnQgPSBkaXJlY3RfcGFyZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhcmVudCA9IGRpcmVjdF9wYXJlbnQucGFyZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNfcmFkaW8gJiYgcmVxdWlyZWQpIHtcbiAgICAgICAgICBlbF92YWxpZGF0aW9ucy5wdXNoKHRoaXMudmFsaWRfcmFkaW8oZWwsIHJlcXVpcmVkKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNfY2hlY2tib3ggJiYgcmVxdWlyZWQpIHtcbiAgICAgICAgICBlbF92YWxpZGF0aW9ucy5wdXNoKHRoaXMudmFsaWRfY2hlY2tib3goZWwsIHJlcXVpcmVkKSk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh2YWxpZGF0b3IpIHtcbiAgICAgICAgICAvLyBWYWxpZGF0ZSB1c2luZyBlYWNoIG9mIHRoZSBzcGVjaWZpZWQgKHNwYWNlLWRlbGltaXRlZCkgdmFsaWRhdG9ycy5cbiAgICAgICAgICB2YXIgdmFsaWRhdG9ycyA9IHZhbGlkYXRvci5zcGxpdCgnICcpO1xuICAgICAgICAgIHZhciBsYXN0X3ZhbGlkID0gdHJ1ZSwgYWxsX3ZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICBmb3IgKHZhciBpdiA9IDA7IGl2IDwgdmFsaWRhdG9ycy5sZW5ndGg7IGl2KyspIHtcbiAgICAgICAgICAgICAgdmFsaWQgPSB0aGlzLnNldHRpbmdzLnZhbGlkYXRvcnNbdmFsaWRhdG9yc1tpdl1dLmFwcGx5KHRoaXMsIFtlbCwgcmVxdWlyZWQsIHBhcmVudF0pXG4gICAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godmFsaWQpO1xuICAgICAgICAgICAgICBhbGxfdmFsaWQgPSB2YWxpZCAmJiBsYXN0X3ZhbGlkO1xuICAgICAgICAgICAgICBsYXN0X3ZhbGlkID0gdmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhbGxfdmFsaWQpIHtcbiAgICAgICAgICAgICAgdGhpcy5TKGVsKS5yZW1vdmVBdHRyKHRoaXMuaW52YWxpZF9hdHRyKTtcbiAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICAgIGxhYmVsLnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpLnJlbW92ZUF0dHIoJ3JvbGUnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcigndmFsaWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLlMoZWwpLmF0dHIodGhpcy5pbnZhbGlkX2F0dHIsICcnKTtcbiAgICAgICAgICAgICAgcGFyZW50LmFkZENsYXNzKCdlcnJvcicpO1xuICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoID4gMCAmJiB0aGlzLnNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgICAgICAgIGxhYmVsLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpLmF0dHIoJ3JvbGUnLCAnYWxlcnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcignaW52YWxpZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGlmIChlbF9wYXR0ZXJuc1tpXVsxXS50ZXN0KHZhbHVlKSAmJiB2YWxpZF9sZW5ndGggfHxcbiAgICAgICAgICAgICFyZXF1aXJlZCAmJiBlbC52YWx1ZS5sZW5ndGggPCAxIHx8ICQoZWwpLmF0dHIoJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2godHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsX3ZhbGlkYXRpb25zLnB1c2goZmFsc2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGVsX3ZhbGlkYXRpb25zID0gW2VsX3ZhbGlkYXRpb25zLmV2ZXJ5KGZ1bmN0aW9uICh2YWxpZCkge3JldHVybiB2YWxpZDt9KV07XG4gICAgICAgICAgaWYgKGVsX3ZhbGlkYXRpb25zWzBdKSB7XG4gICAgICAgICAgICB0aGlzLlMoZWwpLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgICAgICAgcGFyZW50LnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXR0aW5ncy5lcnJvcl9sYWJlbHMpIHtcbiAgICAgICAgICAgICAgbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykucmVtb3ZlQXR0cigncm9sZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChlbCkudHJpZ2dlckhhbmRsZXIoJ3ZhbGlkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuUyhlbCkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdhcmlhLWludmFsaWQnLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgZXJyb3IgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dFxuICAgICAgICAgICAgdmFyIGVycm9yRWxlbSA9IHBhcmVudC5maW5kKCdzbWFsbC4nICsgdGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcywgJ3NwYW4uJyArIHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgdmFyIGVycm9ySUQgPSBlcnJvckVsZW0ubGVuZ3RoID4gMCA/IGVycm9yRWxlbVswXS5pZCA6ICcnO1xuICAgICAgICAgICAgaWYgKGVycm9ySUQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGVzY3JpYmVkYnknLCBlcnJvcklEKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZWwuc2V0QXR0cmlidXRlKCdhcmlhLWRlc2NyaWJlZGJ5JywgJChlbCkuZmluZCgnLmVycm9yJylbMF0uaWQpO1xuICAgICAgICAgICAgcGFyZW50LmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgdGhpcy5zZXR0aW5ncy5lcnJvcl9sYWJlbHMpIHtcbiAgICAgICAgICAgICAgbGFiZWwuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcykuYXR0cigncm9sZScsICdhbGVydCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChlbCkudHJpZ2dlckhhbmRsZXIoJ2ludmFsaWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFsaWRhdGlvbnMgPSB2YWxpZGF0aW9ucy5jb25jYXQoZWxfdmFsaWRhdGlvbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRpb25zO1xuICAgIH0sXG5cbiAgICB2YWxpZF9jaGVja2JveCA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuUyhlbCksXG4gICAgICAgICAgdmFsaWQgPSAoZWwuaXMoJzpjaGVja2VkJykgfHwgIXJlcXVpcmVkIHx8IGVsLmdldCgwKS5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykpO1xuXG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cikucGFyZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgICQoZWwpLnRyaWdnZXJIYW5kbGVyKCd2YWxpZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpLnBhcmVudCgpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAkKGVsKS50cmlnZ2VySGFuZGxlcignaW52YWxpZCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSxcblxuICAgIHZhbGlkX3JhZGlvIDogZnVuY3Rpb24gKGVsLCByZXF1aXJlZCkge1xuICAgICAgdmFyIG5hbWUgPSBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSxcbiAgICAgICAgICBncm91cCA9IHRoaXMuUyhlbCkuY2xvc2VzdCgnW2RhdGEtJyArIHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJ10nKS5maW5kKFwiW25hbWU9J1wiICsgbmFtZSArIFwiJ11cIiksXG4gICAgICAgICAgY291bnQgPSBncm91cC5sZW5ndGgsXG4gICAgICAgICAgdmFsaWQgPSBmYWxzZSxcbiAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBIYXMgdG8gY291bnQgdXAgdG8gbWFrZSBzdXJlIHRoZSBmb2N1cyBnZXRzIGFwcGxpZWQgdG8gdGhlIHRvcCBlcnJvclxuICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpZiggZ3JvdXBbaV0uZ2V0QXR0cmlidXRlKCdkaXNhYmxlZCcpICl7XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9dHJ1ZTtcbiAgICAgICAgICAgICAgICB2YWxpZD10cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBbaV0uY2hlY2tlZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiggZGlzYWJsZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgLy8gSGFzIHRvIGNvdW50IHVwIHRvIG1ha2Ugc3VyZSB0aGUgZm9jdXMgZ2V0cyBhcHBsaWVkIHRvIHRoZSB0b3AgZXJyb3JcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICB0aGlzLlMoZ3JvdXBbaV0pLnJlbW92ZUF0dHIodGhpcy5pbnZhbGlkX2F0dHIpLnBhcmVudCgpLnJlbW92ZUNsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICQoZ3JvdXBbaV0pLnRyaWdnZXJIYW5kbGVyKCd2YWxpZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuUyhncm91cFtpXSkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpLnBhcmVudCgpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICAgICQoZ3JvdXBbaV0pLnRyaWdnZXJIYW5kbGVyKCdpbnZhbGlkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbGlkO1xuICAgIH0sXG5cbiAgICB2YWxpZF9lcXVhbCA6IGZ1bmN0aW9uIChlbCwgcmVxdWlyZWQsIHBhcmVudCkge1xuICAgICAgdmFyIGZyb20gID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWwuZ2V0QXR0cmlidXRlKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1lcXVhbHRvJykpKS52YWx1ZSxcbiAgICAgICAgICB0byAgICA9IGVsLnZhbHVlLFxuICAgICAgICAgIHZhbGlkID0gKGZyb20gPT09IHRvKTtcblxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHRoaXMuUyhlbCkucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cik7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDbGFzcyh0aGlzLnNldHRpbmdzLmVycm9yX2NsYXNzKTtcbiAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA+IDAgJiYgc2V0dGluZ3MuZXJyb3JfbGFiZWxzKSB7XG4gICAgICAgICAgbGFiZWwucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuUyhlbCkuYXR0cih0aGlzLmludmFsaWRfYXR0ciwgJycpO1xuICAgICAgICBwYXJlbnQuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICAgIGlmIChsYWJlbC5sZW5ndGggPiAwICYmIHNldHRpbmdzLmVycm9yX2xhYmVscykge1xuICAgICAgICAgIGxhYmVsLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuZXJyb3JfY2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9LFxuXG4gICAgdmFsaWRfb25lb2YgOiBmdW5jdGlvbiAoZWwsIHJlcXVpcmVkLCBwYXJlbnQsIGRvTm90VmFsaWRhdGVPdGhlcnMpIHtcbiAgICAgIHZhciBlbCA9IHRoaXMuUyhlbCksXG4gICAgICAgIG90aGVycyA9IHRoaXMuUygnWycgKyB0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtb25lb2YnKSArICddJyksXG4gICAgICAgIHZhbGlkID0gb3RoZXJzLmZpbHRlcignOmNoZWNrZWQnKS5sZW5ndGggPiAwO1xuXG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cih0aGlzLmludmFsaWRfYXR0cikucGFyZW50KCkucmVtb3ZlQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5hdHRyKHRoaXMuaW52YWxpZF9hdHRyLCAnJykucGFyZW50KCkuYWRkQ2xhc3ModGhpcy5zZXR0aW5ncy5lcnJvcl9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghZG9Ob3RWYWxpZGF0ZU90aGVycykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBvdGhlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgX3RoaXMudmFsaWRfb25lb2YuY2FsbChfdGhpcywgdGhpcywgbnVsbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uKHNjb3BlLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgZm9ybSA9IHNlbGYuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5hdHRyKCdub3ZhbGlkYXRlJywgJ25vdmFsaWRhdGUnKTtcbiAgICAgICAgICBzZWxmLlMoZm9ybSkuZWFjaChmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgICAgc2VsZi5ldmVudHMoZWwpO1xuICAgICAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy5hY2NvcmRpb24gPSB7XG4gICAgbmFtZSA6ICdhY2NvcmRpb24nLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGNvbnRlbnRfY2xhc3MgOiAnY29udGVudCcsXG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIG11bHRpX2V4cGFuZCA6IGZhbHNlLFxuICAgICAgdG9nZ2xlYWJsZSA6IHRydWUsXG4gICAgICBjYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBTID0gdGhpcy5TO1xuICAgICAgc2VsZi5jcmVhdGUodGhpcy5TKGluc3RhbmNlKSk7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgIC5vZmYoJy5mbmR0bi5hY2NvcmRpb24nKVxuICAgICAgLm9uKCdjbGljay5mbmR0bi5hY2NvcmRpb24nLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gPiBkZCA+IGEsIFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gbGkgPiBhJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGFjY29yZGlvbiA9IFModGhpcykuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgIGdyb3VwU2VsZWN0b3IgPSBzZWxmLmF0dHJfbmFtZSgpICsgJz0nICsgYWNjb3JkaW9uLmF0dHIoc2VsZi5hdHRyX25hbWUoKSksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGFjY29yZGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncyxcbiAgICAgICAgICAgIHRhcmdldCA9IFMoJyMnICsgdGhpcy5ocmVmLnNwbGl0KCcjJylbMV0pLFxuICAgICAgICAgICAgYXVudHMgPSAkKCc+IGRkLCA+IGxpJywgYWNjb3JkaW9uKSxcbiAgICAgICAgICAgIHNpYmxpbmdzID0gYXVudHMuY2hpbGRyZW4oJy4nICsgc2V0dGluZ3MuY29udGVudF9jbGFzcyksXG4gICAgICAgICAgICBhY3RpdmVfY29udGVudCA9IHNpYmxpbmdzLmZpbHRlcignLicgKyBzZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiAoYWNjb3JkaW9uLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpIHtcbiAgICAgICAgICBzaWJsaW5ncyA9IHNpYmxpbmdzLmFkZCgnWycgKyBncm91cFNlbGVjdG9yICsgJ10gZGQgPiAnICsgJy4nICsgc2V0dGluZ3MuY29udGVudF9jbGFzcyArICcsIFsnICsgZ3JvdXBTZWxlY3RvciArICddIGxpID4gJyArICcuJyArIHNldHRpbmdzLmNvbnRlbnRfY2xhc3MpO1xuICAgICAgICAgIGF1bnRzID0gYXVudHMuYWRkKCdbJyArIGdyb3VwU2VsZWN0b3IgKyAnXSBkZCwgWycgKyBncm91cFNlbGVjdG9yICsgJ10gbGknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy50b2dnbGVhYmxlICYmIHRhcmdldC5pcyhhY3RpdmVfY29udGVudCkpIHtcbiAgICAgICAgICB0YXJnZXQucGFyZW50KCdkZCwgbGknKS50b2dnbGVDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MsIGZhbHNlKTtcbiAgICAgICAgICB0YXJnZXQudG9nZ2xlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzLCBmYWxzZSk7XG4gICAgICAgICAgUyh0aGlzKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgZnVuY3Rpb24oaSwgYXR0cil7XG4gICAgICAgICAgICAgIHJldHVybiBhdHRyID09PSAndHJ1ZScgPyAnZmFsc2UnIDogJ3RydWUnO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKHRhcmdldCk7XG4gICAgICAgICAgdGFyZ2V0LnRyaWdnZXJIYW5kbGVyKCd0b2dnbGVkJywgW2FjY29yZGlvbl0pO1xuICAgICAgICAgIGFjY29yZGlvbi50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFt0YXJnZXRdKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNldHRpbmdzLm11bHRpX2V4cGFuZCkge1xuICAgICAgICAgIHNpYmxpbmdzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcyk7XG4gICAgICAgICAgYXVudHMucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgICBhdW50cy5jaGlsZHJlbignYScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCdmYWxzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0LmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcykucGFyZW50KCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgc2V0dGluZ3MuY2FsbGJhY2sodGFyZ2V0KTtcbiAgICAgICAgdGFyZ2V0LnRyaWdnZXJIYW5kbGVyKCd0b2dnbGVkJywgW2FjY29yZGlvbl0pO1xuICAgICAgICBhY2NvcmRpb24udHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFyZ2V0XSk7XG4gICAgICAgIFModGhpcykuYXR0cignYXJpYS1leHBhbmRlZCcsJ3RydWUnKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIGFjY29yZGlvbiA9ICRpbnN0YW5jZSxcbiAgICAgICAgICBhdW50cyA9ICQoJz4gLmFjY29yZGlvbi1uYXZpZ2F0aW9uJywgYWNjb3JkaW9uKSxcbiAgICAgICAgICBzZXR0aW5ncyA9IGFjY29yZGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgYXVudHMuY2hpbGRyZW4oJ2EnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywnZmFsc2UnKTtcbiAgICAgIGF1bnRzLmhhcygnLicgKyBzZXR0aW5ncy5jb250ZW50X2NsYXNzICsgJy4nICsgc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS5jaGlsZHJlbignYScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCd0cnVlJyk7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5tdWx0aV9leHBhbmQpIHtcbiAgICAgICAgJGluc3RhbmNlLmF0dHIoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJywndHJ1ZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7fSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuYWxlcnQgPSB7XG4gICAgbmFtZSA6ICdhbGVydCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuYWxlcnQnKS5vbignY2xpY2suZm5kdG4uYWxlcnQnLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gLmNsb3NlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGFsZXJ0Qm94ID0gUyh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgICAgc2V0dGluZ3MgPSBhbGVydEJveC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmIChNb2Rlcm5penIuY3NzdHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICBhbGVydEJveC5hZGRDbGFzcygnYWxlcnQtY2xvc2UnKTtcbiAgICAgICAgICBhbGVydEJveC5vbigndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIFModGhpcykudHJpZ2dlcignY2xvc2UuZm5kdG4uYWxlcnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnRCb3guZmFkZU91dCgzMDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFModGhpcykudHJpZ2dlcignY2xvc2UuZm5kdG4uYWxlcnQnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLmNsZWFyaW5nID0ge1xuICAgIG5hbWUgOiAnY2xlYXJpbmcnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIHRlbXBsYXRlcyA6IHtcbiAgICAgICAgdmlld2luZyA6ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiY2xlYXJpbmctY2xvc2VcIj4mdGltZXM7PC9hPicgK1xuICAgICAgICAgICc8ZGl2IGNsYXNzPVwidmlzaWJsZS1pbWdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIj48ZGl2IGNsYXNzPVwiY2xlYXJpbmctdG91Y2gtbGFiZWxcIj48L2Rpdj48aW1nIHNyYz1cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBQUQvQUN3QUFBQUFBUUFCQUFBQ0FEcyUzRFwiIGFsdD1cIlwiIC8+JyArXG4gICAgICAgICAgJzxwIGNsYXNzPVwiY2xlYXJpbmctY2FwdGlvblwiPjwvcD48YSBocmVmPVwiI1wiIGNsYXNzPVwiY2xlYXJpbmctbWFpbi1wcmV2XCI+PHNwYW4+PC9zcGFuPjwvYT4nICtcbiAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImNsZWFyaW5nLW1haW4tbmV4dFwiPjxzcGFuPjwvc3Bhbj48L2E+PC9kaXY+JyArXG4gICAgICAgICAgJzxpbWcgY2xhc3M9XCJjbGVhcmluZy1wcmVsb2FkLW5leHRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmVcIiBzcmM9XCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhBUUFCQUFEL0FDd0FBQUFBQVFBQkFBQUNBRHMlM0RcIiBhbHQ9XCJcIiAvPicgK1xuICAgICAgICAgICc8aW1nIGNsYXNzPVwiY2xlYXJpbmctcHJlbG9hZC1wcmV2XCIgc3R5bGU9XCJkaXNwbGF5OiBub25lXCIgc3JjPVwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQVFBQkFBRC9BQ3dBQUFBQUFRQUJBQUFDQURzJTNEXCIgYWx0PVwiXCIgLz4nXG4gICAgICB9LFxuXG4gICAgICAvLyBjb21tYSBkZWxpbWl0ZWQgbGlzdCBvZiBzZWxlY3RvcnMgdGhhdCwgb24gY2xpY2ssIHdpbGwgY2xvc2UgY2xlYXJpbmcsXG4gICAgICAvLyBhZGQgJ2Rpdi5jbGVhcmluZy1ibGFja291dCwgZGl2LnZpc2libGUtaW1nJyB0byBjbG9zZSBvbiBiYWNrZ3JvdW5kIGNsaWNrXG4gICAgICBjbG9zZV9zZWxlY3RvcnMgOiAnLmNsZWFyaW5nLWNsb3NlLCBkaXYuY2xlYXJpbmctYmxhY2tvdXQnLFxuXG4gICAgICAvLyBEZWZhdWx0IHRvIHRoZSBlbnRpcmUgbGkgZWxlbWVudC5cbiAgICAgIG9wZW5fc2VsZWN0b3JzIDogJycsXG5cbiAgICAgIC8vIEltYWdlIHdpbGwgYmUgc2tpcHBlZCBpbiBjYXJvdXNlbC5cbiAgICAgIHNraXBfc2VsZWN0b3IgOiAnJyxcblxuICAgICAgdG91Y2hfbGFiZWwgOiAnJyxcblxuICAgICAgLy8gZXZlbnQgaW5pdGlhbGl6ZXJzIGFuZCBsb2Nrc1xuICAgICAgaW5pdCA6IGZhbHNlLFxuICAgICAgbG9ja2VkIDogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIGltYWdlX2xvYWRlZCcpO1xuXG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG5cbiAgICAgIGlmIChzZWxmLlModGhpcy5zY29wZSkuaXMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJykpIHtcbiAgICAgICAgdGhpcy5hc3NlbWJsZShzZWxmLlMoJ2xpJywgdGhpcy5zY29wZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuYXNzZW1ibGUoc2VsZi5TKCdsaScsIHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlMsXG4gICAgICAgICAgJHNjcm9sbF9jb250YWluZXIgPSAkKCcuc2Nyb2xsLWNvbnRhaW5lcicpO1xuXG4gICAgICBpZiAoJHNjcm9sbF9jb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNjb3BlID0gJHNjcm9sbF9jb250YWluZXI7XG4gICAgICB9XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmNsZWFyaW5nJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5jbGVhcmluZycsICd1bFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddIGxpICcgKyB0aGlzLnNldHRpbmdzLm9wZW5fc2VsZWN0b3JzLFxuICAgICAgICAgIGZ1bmN0aW9uIChlLCBjdXJyZW50LCB0YXJnZXQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gY3VycmVudCB8fCBTKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldCB8fCBjdXJyZW50LFxuICAgICAgICAgICAgICAgIG5leHQgPSBjdXJyZW50Lm5leHQoJ2xpJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBjdXJyZW50LmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgICAgIGltYWdlID0gUyhlLnRhcmdldCk7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCFzZXR0aW5ncykge1xuICAgICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSBjdXJyZW50LmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBjbGVhcmluZyBpcyBvcGVuIGFuZCB0aGUgY3VycmVudCBpbWFnZSBpc1xuICAgICAgICAgICAgLy8gY2xpY2tlZCwgZ28gdG8gdGhlIG5leHQgaW1hZ2UgaW4gc2VxdWVuY2VcbiAgICAgICAgICAgIGlmICh0YXJnZXQuaGFzQ2xhc3MoJ3Zpc2libGUnKSAmJlxuICAgICAgICAgICAgICBjdXJyZW50WzBdID09PSB0YXJnZXRbMF0gJiZcbiAgICAgICAgICAgICAgbmV4dC5sZW5ndGggPiAwICYmIHNlbGYuaXNfb3BlbihjdXJyZW50KSkge1xuICAgICAgICAgICAgICB0YXJnZXQgPSBuZXh0O1xuICAgICAgICAgICAgICBpbWFnZSA9IFMoJ2ltZycsIHRhcmdldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBjdXJyZW50IGFuZCB0YXJnZXQgdG8gdGhlIGNsaWNrZWQgbGkgaWYgbm90IG90aGVyd2lzZSBkZWZpbmVkLlxuICAgICAgICAgICAgc2VsZi5vcGVuKGltYWdlLCBjdXJyZW50LCB0YXJnZXQpO1xuICAgICAgICAgICAgc2VsZi51cGRhdGVfcGFkZGxlcyh0YXJnZXQpO1xuICAgICAgICAgIH0pXG5cbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5jbGVhcmluZycsICcuY2xlYXJpbmctbWFpbi1uZXh0JyxcbiAgICAgICAgICBmdW5jdGlvbiAoZSkgeyBzZWxmLm5hdihlLCAnbmV4dCcpIH0pXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCAnLmNsZWFyaW5nLW1haW4tcHJldicsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgc2VsZi5uYXYoZSwgJ3ByZXYnKSB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJywgdGhpcy5zZXR0aW5ncy5jbG9zZV9zZWxlY3RvcnMsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgRm91bmRhdGlvbi5saWJzLmNsZWFyaW5nLmNsb3NlKGUsIHRoaXMpIH0pO1xuXG4gICAgICAkKGRvY3VtZW50KS5vbigna2V5ZG93bi5mbmR0bi5jbGVhcmluZycsXG4gICAgICAgICAgZnVuY3Rpb24gKGUpIHsgc2VsZi5rZXlkb3duKGUpIH0pO1xuXG4gICAgICBTKHdpbmRvdykub2ZmKCcuY2xlYXJpbmcnKS5vbigncmVzaXplLmZuZHRuLmNsZWFyaW5nJyxcbiAgICAgICAgZnVuY3Rpb24gKCkgeyBzZWxmLnJlc2l6ZSgpIH0pO1xuXG4gICAgICB0aGlzLnN3aXBlX2V2ZW50cyhzY29wZSk7XG4gICAgfSxcblxuICAgIHN3aXBlX2V2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgUyA9IHNlbGYuUztcblxuICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAub24oJ3RvdWNoc3RhcnQuZm5kdG4uY2xlYXJpbmcnLCAnLnZpc2libGUtaW1nJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIWUudG91Y2hlcykgeyBlID0gZS5vcmlnaW5hbEV2ZW50OyB9XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRfcGFnZV94IDogZS50b3VjaGVzWzBdLnBhZ2VYLFxuICAgICAgICAgICAgICAgIHN0YXJ0X3BhZ2VfeSA6IGUudG91Y2hlc1swXS5wYWdlWSxcbiAgICAgICAgICAgICAgICBzdGFydF90aW1lIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICBkZWx0YV94IDogMCxcbiAgICAgICAgICAgICAgICBpc19zY3JvbGxpbmcgOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgIFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIGRhdGEpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2htb3ZlLmZuZHRuLmNsZWFyaW5nJywgJy52aXNpYmxlLWltZycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgICAgIGUgPSBlLm9yaWdpbmFsRXZlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIElnbm9yZSBwaW5jaC96b29tIGV2ZW50c1xuICAgICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID4gMSB8fCBlLnNjYWxlICYmIGUuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgZGF0YSA9IFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicpO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZGF0YSA9IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRhdGEuZGVsdGFfeCA9IGUudG91Y2hlc1swXS5wYWdlWCAtIGRhdGEuc3RhcnRfcGFnZV94O1xuXG4gICAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgICBkYXRhLmRlbHRhX3ggPSAtZGF0YS5kZWx0YV94O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5pc19zY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRhLmlzX3Njcm9sbGluZyA9ICEhKCBkYXRhLmlzX3Njcm9sbGluZyB8fCBNYXRoLmFicyhkYXRhLmRlbHRhX3gpIDwgTWF0aC5hYnMoZS50b3VjaGVzWzBdLnBhZ2VZIC0gZGF0YS5zdGFydF9wYWdlX3kpICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmlzX3Njcm9sbGluZyAmJiAhZGF0YS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSAoZGF0YS5kZWx0YV94IDwgMCkgPyAnbmV4dCcgOiAncHJldic7XG4gICAgICAgICAgICBkYXRhLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLm5hdihlLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCd0b3VjaGVuZC5mbmR0bi5jbGVhcmluZycsICcudmlzaWJsZS1pbWcnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIFModGhpcykuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIHt9KTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgYXNzZW1ibGUgOiBmdW5jdGlvbiAoJGxpKSB7XG4gICAgICB2YXIgJGVsID0gJGxpLnBhcmVudCgpO1xuXG4gICAgICBpZiAoJGVsLnBhcmVudCgpLmhhc0NsYXNzKCdjYXJvdXNlbCcpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGVsLmFmdGVyKCc8ZGl2IGlkPVwiZm91bmRhdGlvbkNsZWFyaW5nSG9sZGVyXCI+PC9kaXY+Jyk7XG5cbiAgICAgIHZhciBncmlkID0gJGVsLmRldGFjaCgpLFxuICAgICAgICAgIGdyaWRfb3V0ZXJIVE1MID0gJyc7XG5cbiAgICAgIGlmIChncmlkWzBdID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ3JpZF9vdXRlckhUTUwgPSBncmlkWzBdLm91dGVySFRNTDtcbiAgICAgIH1cblxuICAgICAgdmFyIGhvbGRlciA9IHRoaXMuUygnI2ZvdW5kYXRpb25DbGVhcmluZ0hvbGRlcicpLFxuICAgICAgICAgIHNldHRpbmdzID0gJGVsLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgZ3JpZCA6ICc8ZGl2IGNsYXNzPVwiY2Fyb3VzZWxcIj4nICsgZ3JpZF9vdXRlckhUTUwgKyAnPC9kaXY+JyxcbiAgICAgICAgICAgIHZpZXdpbmcgOiBzZXR0aW5ncy50ZW1wbGF0ZXMudmlld2luZ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgd3JhcHBlciA9ICc8ZGl2IGNsYXNzPVwiY2xlYXJpbmctYXNzZW1ibGVkXCI+PGRpdj4nICsgZGF0YS52aWV3aW5nICtcbiAgICAgICAgICAgIGRhdGEuZ3JpZCArICc8L2Rpdj48L2Rpdj4nLFxuICAgICAgICAgIHRvdWNoX2xhYmVsID0gdGhpcy5zZXR0aW5ncy50b3VjaF9sYWJlbDtcblxuICAgICAgaWYgKE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICB3cmFwcGVyID0gJCh3cmFwcGVyKS5maW5kKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnKS5odG1sKHRvdWNoX2xhYmVsKS5lbmQoKTtcbiAgICAgIH1cblxuICAgICAgaG9sZGVyLmFmdGVyKHdyYXBwZXIpLnJlbW92ZSgpO1xuICAgIH0sXG5cbiAgICBvcGVuIDogZnVuY3Rpb24gKCRpbWFnZSwgY3VycmVudCwgdGFyZ2V0KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgYm9keSA9ICQoZG9jdW1lbnQuYm9keSksXG4gICAgICAgICAgcm9vdCA9IHRhcmdldC5jbG9zZXN0KCcuY2xlYXJpbmctYXNzZW1ibGVkJyksXG4gICAgICAgICAgY29udGFpbmVyID0gc2VsZi5TKCdkaXYnLCByb290KS5maXJzdCgpLFxuICAgICAgICAgIHZpc2libGVfaW1hZ2UgPSBzZWxmLlMoJy52aXNpYmxlLWltZycsIGNvbnRhaW5lciksXG4gICAgICAgICAgaW1hZ2UgPSBzZWxmLlMoJ2ltZycsIHZpc2libGVfaW1hZ2UpLm5vdCgkaW1hZ2UpLFxuICAgICAgICAgIGxhYmVsID0gc2VsZi5TKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnLCBjb250YWluZXIpLFxuICAgICAgICAgIGVycm9yID0gZmFsc2UsXG4gICAgICAgICAgbG9hZGVkID0ge307XG5cbiAgICAgIC8vIEV2ZW50IHRvIGRpc2FibGUgc2Nyb2xsaW5nIG9uIHRvdWNoIGRldmljZXMgd2hlbiBDbGVhcmluZyBpcyBhY3RpdmF0ZWRcbiAgICAgICQoJ2JvZHknKS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGltYWdlLmVycm9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHN0YXJ0TG9hZCgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5pbWFnZV9sb2FkZWQoaW1hZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZS5vdXRlcldpZHRoKCkgPT09IDEgJiYgIWVycm9yKSB7XG4gICAgICAgICAgICAgIHN0YXJ0TG9hZC5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY2IuY2FsbCh0aGlzLCBpbWFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBjYiAoaW1hZ2UpIHtcbiAgICAgICAgdmFyICRpbWFnZSA9ICQoaW1hZ2UpO1xuICAgICAgICAkaW1hZ2UuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgJGltYWdlLnRyaWdnZXIoJ2ltYWdlVmlzaWJsZScpO1xuICAgICAgICAvLyB0b2dnbGUgdGhlIGdhbGxlcnlcbiAgICAgICAgYm9keS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuICAgICAgICByb290LmFkZENsYXNzKCdjbGVhcmluZy1ibGFja291dCcpO1xuICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoJ2NsZWFyaW5nLWNvbnRhaW5lcicpO1xuICAgICAgICB2aXNpYmxlX2ltYWdlLnNob3coKTtcbiAgICAgICAgdGhpcy5maXhfaGVpZ2h0KHRhcmdldClcbiAgICAgICAgICAuY2FwdGlvbihzZWxmLlMoJy5jbGVhcmluZy1jYXB0aW9uJywgdmlzaWJsZV9pbWFnZSksIHNlbGYuUygnaW1nJywgdGFyZ2V0KSlcbiAgICAgICAgICAuY2VudGVyX2FuZF9sYWJlbChpbWFnZSwgbGFiZWwpXG4gICAgICAgICAgLnNoaWZ0KGN1cnJlbnQsIHRhcmdldCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJ2xpJykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygndmlzaWJsZScpO1xuICAgICAgICAgICAgdGFyZ2V0LmNsb3Nlc3QoJ2xpJykuYWRkQ2xhc3MoJ3Zpc2libGUnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdvcGVuZWQuZm5kdG4uY2xlYXJpbmcnKVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMubG9ja2VkKCkpIHtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdvcGVuLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICAgIC8vIHNldCB0aGUgaW1hZ2UgdG8gdGhlIHNlbGVjdGVkIHRodW1ibmFpbFxuICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWQoJGltYWdlKTtcbiAgICAgICAgaWYgKGxvYWRlZC5pbnRlcmNoYW5nZSkge1xuICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsIGxvYWRlZC5pbnRlcmNoYW5nZSlcbiAgICAgICAgICAgIC5mb3VuZGF0aW9uKCdpbnRlcmNoYW5nZScsICdyZWZsb3cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGxvYWRlZC5zcmMpXG4gICAgICAgICAgICAuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBpbWFnZS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG5cbiAgICAgICAgc3RhcnRMb2FkLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNsb3NlIDogZnVuY3Rpb24gKGUsIGVsKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciByb290ID0gKGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgICAgIGlmICgvYmxhY2tvdXQvLnRlc3QodGFyZ2V0LnNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5jbG9zZXN0KCcuY2xlYXJpbmctYmxhY2tvdXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KCQoZWwpKSksXG4gICAgICAgICAgYm9keSA9ICQoZG9jdW1lbnQuYm9keSksIGNvbnRhaW5lciwgdmlzaWJsZV9pbWFnZTtcblxuICAgICAgaWYgKGVsID09PSBlLnRhcmdldCAmJiByb290KSB7XG4gICAgICAgIGJvZHkuY3NzKCdvdmVyZmxvdycsICcnKTtcbiAgICAgICAgY29udGFpbmVyID0gJCgnZGl2Jywgcm9vdCkuZmlyc3QoKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZSA9ICQoJy52aXNpYmxlLWltZycsIGNvbnRhaW5lcik7XG4gICAgICAgIHZpc2libGVfaW1hZ2UudHJpZ2dlcignY2xvc2UuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4ID0gMDtcbiAgICAgICAgJCgndWxbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHJvb3QpXG4gICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJycpLmNsb3Nlc3QoJy5jbGVhcmluZy1ibGFja291dCcpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdjbGVhcmluZy1ibGFja291dCcpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NsZWFyaW5nLWNvbnRhaW5lcicpO1xuICAgICAgICB2aXNpYmxlX2ltYWdlLmhpZGUoKTtcbiAgICAgICAgdmlzaWJsZV9pbWFnZS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICAgIH1cblxuICAgICAgLy8gRXZlbnQgdG8gcmUtZW5hYmxlIHNjcm9sbGluZyBvbiB0b3VjaCBkZXZpY2VzXG4gICAgICAkKCdib2R5Jykub2ZmKCd0b3VjaG1vdmUnKTtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBpc19vcGVuIDogZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgIHJldHVybiBjdXJyZW50LnBhcmVudCgpLnByb3AoJ3N0eWxlJykubGVuZ3RoID4gMDtcbiAgICB9LFxuXG4gICAga2V5ZG93biA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgY2xlYXJpbmcgPSAkKCcuY2xlYXJpbmctYmxhY2tvdXQgdWxbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgIE5FWFRfS0VZID0gdGhpcy5ydGwgPyAzNyA6IDM5LFxuICAgICAgICAgIFBSRVZfS0VZID0gdGhpcy5ydGwgPyAzOSA6IDM3LFxuICAgICAgICAgIEVTQ19LRVkgPSAyNztcblxuICAgICAgaWYgKGUud2hpY2ggPT09IE5FWFRfS0VZKSB7XG4gICAgICAgIHRoaXMuZ28oY2xlYXJpbmcsICduZXh0Jyk7XG4gICAgICB9XG4gICAgICBpZiAoZS53aGljaCA9PT0gUFJFVl9LRVkpIHtcbiAgICAgICAgdGhpcy5nbyhjbGVhcmluZywgJ3ByZXYnKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLndoaWNoID09PSBFU0NfS0VZKSB7XG4gICAgICAgIHRoaXMuUygnYS5jbGVhcmluZy1jbG9zZScpLnRyaWdnZXIoJ2NsaWNrLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIG5hdiA6IGZ1bmN0aW9uIChlLCBkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBjbGVhcmluZyA9ICQoJ3VsWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCAnLmNsZWFyaW5nLWJsYWNrb3V0Jyk7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuZ28oY2xlYXJpbmcsIGRpcmVjdGlvbik7XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpbWFnZSA9ICQoJ2ltZycsICcuY2xlYXJpbmctYmxhY2tvdXQgLnZpc2libGUtaW1nJyksXG4gICAgICAgICAgbGFiZWwgPSAkKCcuY2xlYXJpbmctdG91Y2gtbGFiZWwnLCAnLmNsZWFyaW5nLWJsYWNrb3V0Jyk7XG5cbiAgICAgIGlmIChpbWFnZS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5jZW50ZXJfYW5kX2xhYmVsKGltYWdlLCBsYWJlbCk7XG4gICAgICAgIGltYWdlLnRyaWdnZXIoJ3Jlc2l6ZWQuZm5kdG4uY2xlYXJpbmcnKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB2aXN1YWwgYWRqdXN0bWVudHNcbiAgICBmaXhfaGVpZ2h0IDogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgdmFyIGxpcyA9IHRhcmdldC5wYXJlbnQoKS5jaGlsZHJlbigpLFxuICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICBsaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaSA9IHNlbGYuUyh0aGlzKSxcbiAgICAgICAgICAgIGltYWdlID0gbGkuZmluZCgnaW1nJyk7XG5cbiAgICAgICAgaWYgKGxpLmhlaWdodCgpID4gaW1hZ2Uub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgIGxpLmFkZENsYXNzKCdmaXgtaGVpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2xvc2VzdCgndWwnKVxuICAgICAgLndpZHRoKGxpcy5sZW5ndGggKiAxMDAgKyAnJScpO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgdXBkYXRlX3BhZGRsZXMgOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgPSB0YXJnZXQuY2xvc2VzdCgnbGknKTtcbiAgICAgIHZhciB2aXNpYmxlX2ltYWdlID0gdGFyZ2V0XG4gICAgICAgIC5jbG9zZXN0KCcuY2Fyb3VzZWwnKVxuICAgICAgICAuc2libGluZ3MoJy52aXNpYmxlLWltZycpO1xuXG4gICAgICBpZiAodGFyZ2V0Lm5leHQoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuUygnLmNsZWFyaW5nLW1haW4tbmV4dCcsIHZpc2libGVfaW1hZ2UpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5TKCcuY2xlYXJpbmctbWFpbi1uZXh0JywgdmlzaWJsZV9pbWFnZSkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQucHJldigpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5TKCcuY2xlYXJpbmctbWFpbi1wcmV2JywgdmlzaWJsZV9pbWFnZSkucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLlMoJy5jbGVhcmluZy1tYWluLXByZXYnLCB2aXNpYmxlX2ltYWdlKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY2VudGVyX2FuZF9sYWJlbCA6IGZ1bmN0aW9uICh0YXJnZXQsIGxhYmVsKSB7XG4gICAgICBpZiAoIXRoaXMucnRsICYmIGxhYmVsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGFiZWwuY3NzKHtcbiAgICAgICAgICBtYXJnaW5MZWZ0IDogLShsYWJlbC5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBtYXJnaW5Ub3AgOiAtKHRhcmdldC5vdXRlckhlaWdodCgpIC8gMiktbGFiZWwub3V0ZXJIZWlnaHQoKS0xMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhYmVsLmNzcyh7XG4gICAgICAgICAgbWFyZ2luUmlnaHQgOiAtKGxhYmVsLm91dGVyV2lkdGgoKSAvIDIpLFxuICAgICAgICAgIG1hcmdpblRvcCA6IC0odGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKS1sYWJlbC5vdXRlckhlaWdodCgpLTEwLFxuICAgICAgICAgIGxlZnQ6ICdhdXRvJyxcbiAgICAgICAgICByaWdodDogJzUwJSdcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLy8gaW1hZ2UgbG9hZGluZyBhbmQgcHJlbG9hZGluZ1xuXG4gICAgbG9hZCA6IGZ1bmN0aW9uICgkaW1hZ2UpIHtcbiAgICAgIHZhciBocmVmLFxuICAgICAgICAgIGludGVyY2hhbmdlLFxuICAgICAgICAgIGNsb3Nlc3RfYTtcblxuICAgICAgaWYgKCRpbWFnZVswXS5ub2RlTmFtZSA9PT0gJ0EnKSB7XG4gICAgICAgIGhyZWYgPSAkaW1hZ2UuYXR0cignaHJlZicpO1xuICAgICAgICBpbnRlcmNoYW5nZSA9ICRpbWFnZS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xvc2VzdF9hID0gJGltYWdlLmNsb3Nlc3QoJ2EnKTtcbiAgICAgICAgaHJlZiA9IGNsb3Nlc3RfYS5hdHRyKCdocmVmJyk7XG4gICAgICAgIGludGVyY2hhbmdlID0gY2xvc2VzdF9hLmRhdGEoJ2NsZWFyaW5nLWludGVyY2hhbmdlJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJlbG9hZCgkaW1hZ2UpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAnc3JjJzogaHJlZiA/IGhyZWYgOiAkaW1hZ2UuYXR0cignc3JjJyksXG4gICAgICAgICdpbnRlcmNoYW5nZSc6IGhyZWYgPyBpbnRlcmNoYW5nZSA6ICRpbWFnZS5kYXRhKCdjbGVhcmluZy1pbnRlcmNoYW5nZScpXG4gICAgICB9XG4gICAgfSxcblxuICAgIHByZWxvYWQgOiBmdW5jdGlvbiAoJGltYWdlKSB7XG4gICAgICB0aGlzXG4gICAgICAgIC5pbWcoJGltYWdlLmNsb3Nlc3QoJ2xpJykubmV4dCgpLCAnbmV4dCcpXG4gICAgICAgIC5pbWcoJGltYWdlLmNsb3Nlc3QoJ2xpJykucHJldigpLCAncHJldicpO1xuICAgIH0sXG5cbiAgICBpbWcgOiBmdW5jdGlvbiAoaW1nLCBzaWJsaW5nX3R5cGUpIHtcbiAgICAgIGlmIChpbWcubGVuZ3RoKSB7XG4gICAgICAgIHZhciBwcmVsb2FkX2ltZyA9ICQoJy5jbGVhcmluZy1wcmVsb2FkLScgKyBzaWJsaW5nX3R5cGUpLFxuICAgICAgICAgICAgbmV3X2EgPSB0aGlzLlMoJ2EnLCBpbWcpLFxuICAgICAgICAgICAgc3JjLFxuICAgICAgICAgICAgaW50ZXJjaGFuZ2UsXG4gICAgICAgICAgICBpbWFnZTtcblxuICAgICAgICBpZiAobmV3X2EubGVuZ3RoKSB7XG4gICAgICAgICAgc3JjID0gbmV3X2EuYXR0cignaHJlZicpO1xuICAgICAgICAgIGludGVyY2hhbmdlID0gbmV3X2EuZGF0YSgnY2xlYXJpbmctaW50ZXJjaGFuZ2UnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbWFnZSA9IHRoaXMuUygnaW1nJywgaW1nKTtcbiAgICAgICAgICBzcmMgPSBpbWFnZS5hdHRyKCdzcmMnKTtcbiAgICAgICAgICBpbnRlcmNoYW5nZSA9IGltYWdlLmRhdGEoJ2NsZWFyaW5nLWludGVyY2hhbmdlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW50ZXJjaGFuZ2UpIHtcbiAgICAgICAgICBwcmVsb2FkX2ltZy5hdHRyKCdkYXRhLWludGVyY2hhbmdlJywgaW50ZXJjaGFuZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByZWxvYWRfaW1nLmF0dHIoJ3NyYycsIHNyYyk7XG4gICAgICAgICAgcHJlbG9hZF9pbWcuYXR0cignZGF0YS1pbnRlcmNoYW5nZScsICcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGltYWdlIGNhcHRpb25cblxuICAgIGNhcHRpb24gOiBmdW5jdGlvbiAoY29udGFpbmVyLCAkaW1hZ2UpIHtcbiAgICAgIHZhciBjYXB0aW9uID0gJGltYWdlLmF0dHIoJ2RhdGEtY2FwdGlvbicpO1xuXG4gICAgICBpZiAoY2FwdGlvbikge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAuaHRtbChjYXB0aW9uKVxuICAgICAgICAgIC5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXJcbiAgICAgICAgICAudGV4dCgnJylcbiAgICAgICAgICAuaGlkZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIGRpcmVjdGlvbmFsIG1ldGhvZHNcblxuICAgIGdvIDogZnVuY3Rpb24gKCR1bCwgZGlyZWN0aW9uKSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuUygnLnZpc2libGUnLCAkdWwpLFxuICAgICAgICAgIHRhcmdldCA9IGN1cnJlbnRbZGlyZWN0aW9uXSgpO1xuXG4gICAgICAvLyBDaGVjayBmb3Igc2tpcCBzZWxlY3Rvci5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnNraXBfc2VsZWN0b3IgJiYgdGFyZ2V0LmZpbmQodGhpcy5zZXR0aW5ncy5za2lwX3NlbGVjdG9yKS5sZW5ndGggIT0gMCkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbZGlyZWN0aW9uXSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLlMoJ2ltZycsIHRhcmdldClcbiAgICAgICAgICAudHJpZ2dlcignY2xpY2suZm5kdG4uY2xlYXJpbmcnLCBbY3VycmVudCwgdGFyZ2V0XSlcbiAgICAgICAgICAudHJpZ2dlcignY2hhbmdlLmZuZHRuLmNsZWFyaW5nJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNoaWZ0IDogZnVuY3Rpb24gKGN1cnJlbnQsIHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBjbGVhcmluZyA9IHRhcmdldC5wYXJlbnQoKSxcbiAgICAgICAgICBvbGRfaW5kZXggPSB0aGlzLnNldHRpbmdzLnByZXZfaW5kZXggfHwgdGFyZ2V0LmluZGV4KCksXG4gICAgICAgICAgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb24oY2xlYXJpbmcsIGN1cnJlbnQsIHRhcmdldCksXG4gICAgICAgICAgZGlyID0gdGhpcy5ydGwgPyAncmlnaHQnIDogJ2xlZnQnLFxuICAgICAgICAgIGxlZnQgPSBwYXJzZUludChjbGVhcmluZy5jc3MoJ2xlZnQnKSwgMTApLFxuICAgICAgICAgIHdpZHRoID0gdGFyZ2V0Lm91dGVyV2lkdGgoKSxcbiAgICAgICAgICBza2lwX3NoaWZ0O1xuXG4gICAgICB2YXIgZGlyX29iaiA9IHt9O1xuXG4gICAgICAvLyB3ZSB1c2UgalF1ZXJ5IGFuaW1hdGUgaW5zdGVhZCBvZiBDU1MgdHJhbnNpdGlvbnMgYmVjYXVzZSB3ZVxuICAgICAgLy8gbmVlZCBhIGNhbGxiYWNrIHRvIHVubG9jayB0aGUgbmV4dCBhbmltYXRpb25cbiAgICAgIC8vIG5lZWRzIHN1cHBvcnQgZm9yIFJUTCAqKlxuICAgICAgaWYgKHRhcmdldC5pbmRleCgpICE9PSBvbGRfaW5kZXggJiYgIS9za2lwLy50ZXN0KGRpcmVjdGlvbikpIHtcbiAgICAgICAgaWYgKC9sZWZ0Ly50ZXN0KGRpcmVjdGlvbikpIHtcbiAgICAgICAgICB0aGlzLmxvY2soKTtcbiAgICAgICAgICBkaXJfb2JqW2Rpcl0gPSBsZWZ0ICsgd2lkdGg7XG4gICAgICAgICAgY2xlYXJpbmcuYW5pbWF0ZShkaXJfb2JqLCAzMDAsIHRoaXMudW5sb2NrKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgICAgdGhpcy5sb2NrKCk7XG4gICAgICAgICAgZGlyX29ialtkaXJdID0gbGVmdCAtIHdpZHRoO1xuICAgICAgICAgIGNsZWFyaW5nLmFuaW1hdGUoZGlyX29iaiwgMzAwLCB0aGlzLnVubG9jaygpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvc2tpcC8udGVzdChkaXJlY3Rpb24pKSB7XG4gICAgICAgIC8vIHRoZSB0YXJnZXQgaW1hZ2UgaXMgbm90IGFkamFjZW50IHRvIHRoZSBjdXJyZW50IGltYWdlLCBzb1xuICAgICAgICAvLyBkbyB3ZSBzY3JvbGwgcmlnaHQgb3Igbm90XG4gICAgICAgIHNraXBfc2hpZnQgPSB0YXJnZXQuaW5kZXgoKSAtIHRoaXMuc2V0dGluZ3MudXBfY291bnQ7XG4gICAgICAgIHRoaXMubG9jaygpO1xuXG4gICAgICAgIGlmIChza2lwX3NoaWZ0ID4gMCkge1xuICAgICAgICAgIGRpcl9vYmpbZGlyXSA9IC0oc2tpcF9zaGlmdCAqIHdpZHRoKTtcbiAgICAgICAgICBjbGVhcmluZy5hbmltYXRlKGRpcl9vYmosIDMwMCwgdGhpcy51bmxvY2soKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGlyX29ialtkaXJdID0gMDtcbiAgICAgICAgICBjbGVhcmluZy5hbmltYXRlKGRpcl9vYmosIDMwMCwgdGhpcy51bmxvY2soKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9LFxuXG4gICAgZGlyZWN0aW9uIDogZnVuY3Rpb24gKCRlbCwgY3VycmVudCwgdGFyZ2V0KSB7XG4gICAgICB2YXIgbGlzID0gdGhpcy5TKCdsaScsICRlbCksXG4gICAgICAgICAgbGlfd2lkdGggPSBsaXMub3V0ZXJXaWR0aCgpICsgKGxpcy5vdXRlcldpZHRoKCkgLyA0KSxcbiAgICAgICAgICB1cF9jb3VudCA9IE1hdGguZmxvb3IodGhpcy5TKCcuY2xlYXJpbmctY29udGFpbmVyJykub3V0ZXJXaWR0aCgpIC8gbGlfd2lkdGgpIC0gMSxcbiAgICAgICAgICB0YXJnZXRfaW5kZXggPSBsaXMuaW5kZXgodGFyZ2V0KSxcbiAgICAgICAgICByZXNwb25zZTtcblxuICAgICAgdGhpcy5zZXR0aW5ncy51cF9jb3VudCA9IHVwX2NvdW50O1xuXG4gICAgICBpZiAodGhpcy5hZGphY2VudCh0aGlzLnNldHRpbmdzLnByZXZfaW5kZXgsIHRhcmdldF9pbmRleCkpIHtcbiAgICAgICAgaWYgKCh0YXJnZXRfaW5kZXggPiB1cF9jb3VudCkgJiYgdGFyZ2V0X2luZGV4ID4gdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4KSB7XG4gICAgICAgICAgcmVzcG9uc2UgPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKCh0YXJnZXRfaW5kZXggPiB1cF9jb3VudCAtIDEpICYmIHRhcmdldF9pbmRleCA8PSB0aGlzLnNldHRpbmdzLnByZXZfaW5kZXgpIHtcbiAgICAgICAgICByZXNwb25zZSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNwb25zZSA9ICdza2lwJztcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXR0aW5ncy5wcmV2X2luZGV4ID0gdGFyZ2V0X2luZGV4O1xuXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSxcblxuICAgIGFkamFjZW50IDogZnVuY3Rpb24gKGN1cnJlbnRfaW5kZXgsIHRhcmdldF9pbmRleCkge1xuICAgICAgZm9yICh2YXIgaSA9IHRhcmdldF9pbmRleCArIDE7IGkgPj0gdGFyZ2V0X2luZGV4IC0gMTsgaS0tKSB7XG4gICAgICAgIGlmIChpID09PSBjdXJyZW50X2luZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gbG9jayBtYW5hZ2VtZW50XG5cbiAgICBsb2NrIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXR0aW5ncy5sb2NrZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICB1bmxvY2sgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmxvY2tlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBsb2NrZWQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXR0aW5ncy5sb2NrZWQ7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi5jbGVhcmluZycpO1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcuZm5kdG4uY2xlYXJpbmcnKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24gPSB7XG4gICAgbmFtZSA6ICdkcm9wZG93bicsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYWN0aXZlX2NsYXNzIDogJ29wZW4nLFxuICAgICAgZGlzYWJsZWRfY2xhc3MgOiAnZGlzYWJsZWQnLFxuICAgICAgbWVnYV9jbGFzcyA6ICdtZWdhJyxcbiAgICAgIGFsaWduIDogJ2JvdHRvbScsXG4gICAgICBpc19ob3ZlciA6IGZhbHNlLFxuICAgICAgaG92ZXJfdGltZW91dCA6IDE1MCxcbiAgICAgIG9wZW5lZCA6IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgY2xvc2VkIDogZnVuY3Rpb24gKCkge31cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlJyk7XG5cbiAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMuc2V0dGluZ3MsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmRyb3Bkb3duJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5kcm9wZG93bicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmlzX2hvdmVyIHx8IE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKFModGhpcykucGFyZW50KCdbZGF0YS1yZXZlYWwtaWRdJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZSgkKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VlbnRlci5mbmR0bi5kcm9wZG93bicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSwgWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgZHJvcGRvd24sXG4gICAgICAgICAgICAgIHRhcmdldDtcblxuICAgICAgICAgIGNsZWFyVGltZW91dChzZWxmLnRpbWVvdXQpO1xuXG4gICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgIGRyb3Bkb3duID0gUygnIycgKyAkdGhpcy5kYXRhKHNlbGYuZGF0YV9hdHRyKCkpKTtcbiAgICAgICAgICAgIHRhcmdldCA9ICR0aGlzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkcm9wZG93biA9ICR0aGlzO1xuICAgICAgICAgICAgdGFyZ2V0ID0gUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJz1cIicgKyBkcm9wZG93bi5hdHRyKCdpZCcpICsgJ1wiXScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHRhcmdldC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcblxuICAgICAgICAgIGlmIChTKGUuY3VycmVudFRhcmdldCkuZGF0YShzZWxmLmRhdGFfYXR0cigpKSAmJiBzZXR0aW5ncy5pc19ob3Zlcikge1xuICAgICAgICAgICAgc2VsZi5jbG9zZWFsbC5jYWxsKHNlbGYpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZXR0aW5ncy5pc19ob3Zlcikge1xuICAgICAgICAgICAgc2VsZi5vcGVuLmFwcGx5KHNlbGYsIFtkcm9wZG93biwgdGFyZ2V0XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlbGVhdmUuZm5kdG4uZHJvcGRvd24nLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10sIFsnICsgdGhpcy5hdHRyX25hbWUoKSArICctY29udGVudF0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciAkdGhpcyA9IFModGhpcyk7XG4gICAgICAgICAgdmFyIHNldHRpbmdzO1xuXG4gICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSAkdGhpcy5kYXRhKHNlbGYuZGF0YV9hdHRyKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgdGFyZ2V0ICAgPSBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnPVwiJyArIFModGhpcykuYXR0cignaWQnKSArICdcIl0nKSxcbiAgICAgICAgICAgICAgICAgIHNldHRpbmdzID0gdGFyZ2V0LmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCBzZWxmLnNldHRpbmdzO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbGYudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCR0aGlzLmRhdGEoc2VsZi5kYXRhX2F0dHIoKSkpIHtcbiAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jbG9zZS5jYWxsKHNlbGYsIFMoJyMnICsgJHRoaXMuZGF0YShzZWxmLmRhdGFfYXR0cigpKSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgJHRoaXMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpLCBzZXR0aW5ncy5ob3Zlcl90aW1lb3V0KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5kcm9wZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHBhcmVudCA9IFMoZS50YXJnZXQpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nKTtcbiAgICAgICAgICB2YXIgbGlua3MgID0gcGFyZW50LmZpbmQoJ2EnKTtcblxuICAgICAgICAgIGlmIChsaW5rcy5sZW5ndGggPiAwICYmIHBhcmVudC5hdHRyKCdhcmlhLWF1dG9jbG9zZScpICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gZG9jdW1lbnQgJiYgISQuY29udGFpbnMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBlLnRhcmdldCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoUyhlLnRhcmdldCkuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoUyhlLnRhcmdldCkuZGF0YSgncmV2ZWFsSWQnKSkgJiZcbiAgICAgICAgICAgIChwYXJlbnQubGVuZ3RoID4gMCAmJiAoUyhlLnRhcmdldCkuaXMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctY29udGVudF0nKSB8fFxuICAgICAgICAgICAgICAkLmNvbnRhaW5zKHBhcmVudC5maXJzdCgpWzBdLCBlLnRhcmdldCkpKSkge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4uZHJvcGRvd24nLCAnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLm9wZW5lZC5jYWxsKHRoaXMpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5kcm9wZG93bicsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnLWNvbnRlbnRdJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuc2V0dGluZ3MuY2xvc2VkLmNhbGwodGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICBTKHdpbmRvdylcbiAgICAgICAgLm9mZignLmRyb3Bkb3duJylcbiAgICAgICAgLm9uKCdyZXNpemUuZm5kdG4uZHJvcGRvd24nLCBzZWxmLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlc2l6ZS5jYWxsKHNlbGYpO1xuICAgICAgICB9LCA1MCkpO1xuXG4gICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH0sXG5cbiAgICBjbG9zZSA6IGZ1bmN0aW9uIChkcm9wZG93bikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgZHJvcGRvd24uZWFjaChmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgIHZhciBvcmlnaW5hbF90YXJnZXQgPSAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnPScgKyBkcm9wZG93bltpZHhdLmlkICsgJ10nKSB8fCAkKCdhcmlhLWNvbnRyb2xzPScgKyBkcm9wZG93bltpZHhdLmlkICsgJ10nKTtcbiAgICAgICAgb3JpZ2luYWxfdGFyZ2V0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgaWYgKHNlbGYuUyh0aGlzKS5oYXNDbGFzcyhzZWxmLnNldHRpbmdzLmFjdGl2ZV9jbGFzcykpIHtcbiAgICAgICAgICBzZWxmLlModGhpcylcbiAgICAgICAgICAgIC5jc3MoRm91bmRhdGlvbi5ydGwgPyAncmlnaHQnIDogJ2xlZnQnLCAnLTk5OTk5cHgnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKHNlbGYuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKVxuICAgICAgICAgICAgLnByZXYoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhzZWxmLnNldHRpbmdzLmFjdGl2ZV9jbGFzcylcbiAgICAgICAgICAgIC5yZW1vdmVEYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICAgIHNlbGYuUyh0aGlzKS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4uZHJvcGRvd24nLCBbZHJvcGRvd25dKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkcm9wZG93bi5yZW1vdmVDbGFzcygnZi1vcGVuLScgKyB0aGlzLmF0dHJfbmFtZSh0cnVlKSk7XG4gICAgfSxcblxuICAgIGNsb3NlYWxsIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJC5lYWNoKHNlbGYuUygnLmYtb3Blbi0nICsgdGhpcy5hdHRyX25hbWUodHJ1ZSkpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuY2xvc2UuY2FsbChzZWxmLCBzZWxmLlModGhpcykpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9wZW4gOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCkge1xuICAgICAgdGhpc1xuICAgICAgICAuY3NzKGRyb3Bkb3duXG4gICAgICAgIC5hZGRDbGFzcyh0aGlzLnNldHRpbmdzLmFjdGl2ZV9jbGFzcyksIHRhcmdldCk7XG4gICAgICBkcm9wZG93bi5wcmV2KCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScpLmFkZENsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgIGRyb3Bkb3duLmRhdGEoJ3RhcmdldCcsIHRhcmdldC5nZXQoMCkpLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5kcm9wZG93bicsIFtkcm9wZG93biwgdGFyZ2V0XSk7XG4gICAgICBkcm9wZG93bi5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgICAgdGFyZ2V0LmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgZHJvcGRvd24uZm9jdXMoKTtcbiAgICAgIGRyb3Bkb3duLmFkZENsYXNzKCdmLW9wZW4tJyArIHRoaXMuYXR0cl9uYW1lKHRydWUpKTtcbiAgICB9LFxuXG4gICAgZGF0YV9hdHRyIDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMubmFtZXNwYWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXNwYWNlICsgJy0nICsgdGhpcy5uYW1lO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5uYW1lO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKHRoaXMuc2V0dGluZ3MuZGlzYWJsZWRfY2xhc3MpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciBkcm9wZG93biA9IHRoaXMuUygnIycgKyB0YXJnZXQuZGF0YSh0aGlzLmRhdGFfYXR0cigpKSk7XG4gICAgICBpZiAoZHJvcGRvd24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIE5vIGRyb3Bkb3duIGZvdW5kLCBub3QgY29udGludWluZ1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2xvc2UuY2FsbCh0aGlzLCB0aGlzLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICctY29udGVudF0nKS5ub3QoZHJvcGRvd24pKTtcblxuICAgICAgaWYgKGRyb3Bkb3duLmhhc0NsYXNzKHRoaXMuc2V0dGluZ3MuYWN0aXZlX2NsYXNzKSkge1xuICAgICAgICB0aGlzLmNsb3NlLmNhbGwodGhpcywgZHJvcGRvd24pO1xuICAgICAgICBpZiAoZHJvcGRvd24uZGF0YSgndGFyZ2V0JykgIT09IHRhcmdldC5nZXQoMCkpIHtcbiAgICAgICAgICB0aGlzLm9wZW4uY2FsbCh0aGlzLCBkcm9wZG93biwgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcGVuLmNhbGwodGhpcywgZHJvcGRvd24sIHRhcmdldCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkcm9wZG93biA9IHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJy1jb250ZW50XS5vcGVuJyk7XG4gICAgICB2YXIgdGFyZ2V0ID0gJChkcm9wZG93bi5kYXRhKFwidGFyZ2V0XCIpKTtcblxuICAgICAgaWYgKGRyb3Bkb3duLmxlbmd0aCAmJiB0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuY3NzKGRyb3Bkb3duLCB0YXJnZXQpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjc3MgOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCkge1xuICAgICAgdmFyIGxlZnRfb2Zmc2V0ID0gTWF0aC5tYXgoKHRhcmdldC53aWR0aCgpIC0gZHJvcGRvd24ud2lkdGgoKSkgLyAyLCA4KSxcbiAgICAgICAgICBzZXR0aW5ncyA9IHRhcmdldC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgICBwYXJlbnRPdmVyZmxvdyA9IGRyb3Bkb3duLnBhcmVudCgpLmNzcygnb3ZlcmZsb3cteScpIHx8IGRyb3Bkb3duLnBhcmVudCgpLmNzcygnb3ZlcmZsb3cnKTtcblxuICAgICAgdGhpcy5jbGVhcl9pZHgoKTtcblxuXG5cbiAgICAgIGlmICh0aGlzLnNtYWxsKCkpIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLmRpcnMuYm90dG9tLmNhbGwoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MpO1xuXG4gICAgICAgIGRyb3Bkb3duLmF0dHIoJ3N0eWxlJywgJycpLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQgZHJvcC1yaWdodCBkcm9wLXRvcCcpLmNzcyh7XG4gICAgICAgICAgcG9zaXRpb24gOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoIDogJzk1JScsXG4gICAgICAgICAgJ21heC13aWR0aCcgOiAnbm9uZScsXG4gICAgICAgICAgdG9wIDogcC50b3BcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJvcGRvd24uY3NzKEZvdW5kYXRpb24ucnRsID8gJ3JpZ2h0JyA6ICdsZWZ0JywgbGVmdF9vZmZzZXQpO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IGlmIGRyb3Bkb3duIGlzIGluIGFuIG92ZXJmbG93IGNvbnRhaW5lclxuICAgICAgZWxzZSBpZiAocGFyZW50T3ZlcmZsb3cgIT09ICd2aXNpYmxlJykge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gdGFyZ2V0WzBdLm9mZnNldFRvcCArIHRhcmdldFswXS5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgZHJvcGRvd24uYXR0cignc3R5bGUnLCAnJykuY3NzKHtcbiAgICAgICAgICBwb3NpdGlvbiA6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wIDogb2Zmc2V0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyb3Bkb3duLmNzcyhGb3VuZGF0aW9uLnJ0bCA/ICdyaWdodCcgOiAnbGVmdCcsIGxlZnRfb2Zmc2V0KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuXG4gICAgICAgIHRoaXMuc3R5bGUoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZHJvcGRvd247XG4gICAgfSxcblxuICAgIHN0eWxlIDogZnVuY3Rpb24gKGRyb3Bkb3duLCB0YXJnZXQsIHNldHRpbmdzKSB7XG4gICAgICB2YXIgY3NzID0gJC5leHRlbmQoe3Bvc2l0aW9uIDogJ2Fic29sdXRlJ30sXG4gICAgICAgIHRoaXMuZGlyc1tzZXR0aW5ncy5hbGlnbl0uY2FsbChkcm9wZG93biwgdGFyZ2V0LCBzZXR0aW5ncykpO1xuXG4gICAgICBkcm9wZG93bi5hdHRyKCdzdHlsZScsICcnKS5jc3MoY3NzKTtcbiAgICB9LFxuXG4gICAgLy8gcmV0dXJuIENTUyBwcm9wZXJ0eSBvYmplY3RcbiAgICAvLyBgdGhpc2AgaXMgdGhlIGRyb3Bkb3duXG4gICAgZGlycyA6IHtcbiAgICAgIC8vIENhbGN1bGF0ZSB0YXJnZXQgb2Zmc2V0XG4gICAgICBfYmFzZSA6IGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBvX3AgPSB0aGlzLm9mZnNldFBhcmVudCgpLFxuICAgICAgICAgICAgbyA9IG9fcC5vZmZzZXQoKSxcbiAgICAgICAgICAgIHAgPSB0Lm9mZnNldCgpO1xuXG4gICAgICAgIHAudG9wIC09IG8udG9wO1xuICAgICAgICBwLmxlZnQgLT0gby5sZWZ0O1xuXG4gICAgICAgIC8vc2V0IHNvbWUgZmxhZ3Mgb24gdGhlIHAgb2JqZWN0IHRvIHBhc3MgYWxvbmdcbiAgICAgICAgcC5taXNzUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgcC5taXNzVG9wID0gZmFsc2U7XG4gICAgICAgIHAubWlzc0xlZnQgPSBmYWxzZTtcbiAgICAgICAgcC5sZWZ0UmlnaHRGbGFnID0gZmFsc2U7XG5cbiAgICAgICAgLy9sZXRzIHNlZSBpZiB0aGUgcGFuZWwgd2lsbCBiZSBvZmYgdGhlIHNjcmVlblxuICAgICAgICAvL2dldCB0aGUgYWN0dWFsIHdpZHRoIG9mIHRoZSBwYWdlIGFuZCBzdG9yZSBpdFxuICAgICAgICB2YXIgYWN0dWFsQm9keVdpZHRoO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncm93JylbMF0pIHtcbiAgICAgICAgICBhY3R1YWxCb2R5V2lkdGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyb3cnKVswXS5jbGllbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3R1YWxCb2R5V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3R1YWxNYXJnaW5XaWR0aCA9ICh3aW5kb3cuaW5uZXJXaWR0aCAtIGFjdHVhbEJvZHlXaWR0aCkgLyAyO1xuICAgICAgICB2YXIgYWN0dWFsQm91bmRhcnkgPSBhY3R1YWxCb2R5V2lkdGg7XG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc0NsYXNzKCdtZWdhJykpIHtcbiAgICAgICAgICAvL21pc3MgdG9wXG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkudG9wIDw9IHRoaXMub3V0ZXJIZWlnaHQoKSkge1xuICAgICAgICAgICAgcC5taXNzVG9wID0gdHJ1ZTtcbiAgICAgICAgICAgIGFjdHVhbEJvdW5kYXJ5ID0gd2luZG93LmlubmVyV2lkdGggLSBhY3R1YWxNYXJnaW5XaWR0aDtcbiAgICAgICAgICAgIHAubGVmdFJpZ2h0RmxhZyA9IHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9taXNzIHJpZ2h0XG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkubGVmdCArIHRoaXMub3V0ZXJXaWR0aCgpID4gdC5vZmZzZXQoKS5sZWZ0ICsgYWN0dWFsTWFyZ2luV2lkdGggJiYgdC5vZmZzZXQoKS5sZWZ0IC0gYWN0dWFsTWFyZ2luV2lkdGggPiB0aGlzLm91dGVyV2lkdGgoKSkge1xuICAgICAgICAgICAgcC5taXNzUmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgcC5taXNzTGVmdCA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vbWlzcyBsZWZ0XG4gICAgICAgICAgaWYgKHQub2Zmc2V0KCkubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpIDw9IDApIHtcbiAgICAgICAgICAgIHAubWlzc0xlZnQgPSB0cnVlO1xuICAgICAgICAgICAgcC5taXNzUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0sXG5cbiAgICAgIHRvcCA6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgIHZhciBzZWxmID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duLFxuICAgICAgICAgICAgcCA9IHNlbGYuZGlycy5fYmFzZS5jYWxsKHRoaXMsIHQpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2Ryb3AtdG9wJyk7XG5cbiAgICAgICAgaWYgKHAubWlzc1RvcCA9PSB0cnVlKSB7XG4gICAgICAgICAgcC50b3AgPSBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKSArIHRoaXMub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkcm9wLXRvcCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHQub3V0ZXJXaWR0aCgpIDwgdGhpcy5vdXRlcldpZHRoKCkgfHwgc2VsZi5zbWFsbCgpIHx8IHRoaXMuaGFzQ2xhc3Mocy5tZWdhX21lbnUpKSB7XG4gICAgICAgICAgc2VsZi5hZGp1c3RfcGlwKHRoaXMsIHQsIHMsIHApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCkgKyB0Lm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgIHRvcCA6IHAudG9wIC0gdGhpcy5vdXRlckhlaWdodCgpfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCwgdG9wIDogcC50b3AgLSB0aGlzLm91dGVySGVpZ2h0KCl9O1xuICAgICAgfSxcblxuICAgICAgYm90dG9tIDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24sXG4gICAgICAgICAgICBwID0gc2VsZi5kaXJzLl9iYXNlLmNhbGwodGhpcywgdCk7XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKSArIHQub3V0ZXJXaWR0aCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHQub3V0ZXJXaWR0aCgpIDwgdGhpcy5vdXRlcldpZHRoKCkgfHwgc2VsZi5zbWFsbCgpIHx8IHRoaXMuaGFzQ2xhc3Mocy5tZWdhX21lbnUpKSB7XG4gICAgICAgICAgc2VsZi5hZGp1c3RfcGlwKHRoaXMsIHQsIHMsIHApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYucnRsKSB7XG4gICAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0IC0gdGhpcy5vdXRlcldpZHRoKCkgKyB0Lm91dGVyV2lkdGgoKSwgdG9wIDogcC50b3AgKyB0Lm91dGVySGVpZ2h0KCl9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtsZWZ0IDogcC5sZWZ0LCB0b3AgOiBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKX07XG4gICAgICB9LFxuXG4gICAgICBsZWZ0IDogZnVuY3Rpb24gKHQsIHMpIHtcbiAgICAgICAgdmFyIHAgPSBGb3VuZGF0aW9uLmxpYnMuZHJvcGRvd24uZGlycy5fYmFzZS5jYWxsKHRoaXMsIHQpO1xuXG4gICAgICAgIHRoaXMuYWRkQ2xhc3MoJ2Ryb3AtbGVmdCcpO1xuXG4gICAgICAgIGlmIChwLm1pc3NMZWZ0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSAgcC5sZWZ0ICsgdGhpcy5vdXRlcldpZHRoKCk7XG4gICAgICAgICAgcC50b3AgPSBwLnRvcCArIHQub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkcm9wLWxlZnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCAtIHRoaXMub3V0ZXJXaWR0aCgpLCB0b3AgOiBwLnRvcH07XG4gICAgICB9LFxuXG4gICAgICByaWdodCA6IGZ1bmN0aW9uICh0LCBzKSB7XG4gICAgICAgIHZhciBwID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duLmRpcnMuX2Jhc2UuY2FsbCh0aGlzLCB0KTtcblxuICAgICAgICB0aGlzLmFkZENsYXNzKCdkcm9wLXJpZ2h0Jyk7XG5cbiAgICAgICAgaWYgKHAubWlzc1JpZ2h0ID09IHRydWUpIHtcbiAgICAgICAgICBwLmxlZnQgPSBwLmxlZnQgLSB0aGlzLm91dGVyV2lkdGgoKTtcbiAgICAgICAgICBwLnRvcCA9IHAudG9wICsgdC5vdXRlckhlaWdodCgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2Ryb3AtcmlnaHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwLnRyaWdnZXJlZFJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxmID0gRm91bmRhdGlvbi5saWJzLmRyb3Bkb3duO1xuXG4gICAgICAgIGlmICh0Lm91dGVyV2lkdGgoKSA8IHRoaXMub3V0ZXJXaWR0aCgpIHx8IHNlbGYuc21hbGwoKSB8fCB0aGlzLmhhc0NsYXNzKHMubWVnYV9tZW51KSkge1xuICAgICAgICAgIHNlbGYuYWRqdXN0X3BpcCh0aGlzLCB0LCBzLCBwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7bGVmdCA6IHAubGVmdCArIHQub3V0ZXJXaWR0aCgpLCB0b3AgOiBwLnRvcH07XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIEluc2VydCBydWxlIHRvIHN0eWxlIHBzdWVkbyBlbGVtZW50c1xuICAgIGFkanVzdF9waXAgOiBmdW5jdGlvbiAoZHJvcGRvd24sIHRhcmdldCwgc2V0dGluZ3MsIHBvc2l0aW9uKSB7XG4gICAgICB2YXIgc2hlZXQgPSBGb3VuZGF0aW9uLnN0eWxlc2hlZXQsXG4gICAgICAgICAgcGlwX29mZnNldF9iYXNlID0gODtcblxuICAgICAgaWYgKGRyb3Bkb3duLmhhc0NsYXNzKHNldHRpbmdzLm1lZ2FfY2xhc3MpKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSA9IHBvc2l0aW9uLmxlZnQgKyAodGFyZ2V0Lm91dGVyV2lkdGgoKSAvIDIpIC0gODtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zbWFsbCgpKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSArPSBwb3NpdGlvbi5sZWZ0IC0gODtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ydWxlX2lkeCA9IHNoZWV0LmNzc1J1bGVzLmxlbmd0aDtcblxuICAgICAgLy9kZWZhdWx0XG4gICAgICB2YXIgc2VsX2JlZm9yZSA9ICcuZi1kcm9wZG93bi5vcGVuOmJlZm9yZScsXG4gICAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgICBjc3NfYmVmb3JlID0gJ2xlZnQ6ICcgKyBwaXBfb2Zmc2V0X2Jhc2UgKyAncHg7JyxcbiAgICAgICAgICBjc3NfYWZ0ZXIgID0gJ2xlZnQ6ICcgKyAocGlwX29mZnNldF9iYXNlIC0gMSkgKyAncHg7JztcblxuICAgICAgaWYgKHBvc2l0aW9uLm1pc3NSaWdodCA9PSB0cnVlKSB7XG4gICAgICAgIHBpcF9vZmZzZXRfYmFzZSA9IGRyb3Bkb3duLm91dGVyV2lkdGgoKSAtIDIzO1xuICAgICAgICBzZWxfYmVmb3JlID0gJy5mLWRyb3Bkb3duLm9wZW46YmVmb3JlJyxcbiAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgY3NzX2JlZm9yZSA9ICdsZWZ0OiAnICsgcGlwX29mZnNldF9iYXNlICsgJ3B4OycsXG4gICAgICAgIGNzc19hZnRlciAgPSAnbGVmdDogJyArIChwaXBfb2Zmc2V0X2Jhc2UgLSAxKSArICdweDsnO1xuICAgICAgfVxuXG4gICAgICAvL2p1c3QgYSBjYXNlIHdoZXJlIHJpZ2h0IGlzIGZpcmVkLCBidXQgaXRzIG5vdCBtaXNzaW5nIHJpZ2h0XG4gICAgICBpZiAocG9zaXRpb24udHJpZ2dlcmVkUmlnaHQgPT0gdHJ1ZSkge1xuICAgICAgICBzZWxfYmVmb3JlID0gJy5mLWRyb3Bkb3duLm9wZW46YmVmb3JlJyxcbiAgICAgICAgc2VsX2FmdGVyICA9ICcuZi1kcm9wZG93bi5vcGVuOmFmdGVyJyxcbiAgICAgICAgY3NzX2JlZm9yZSA9ICdsZWZ0Oi0xMnB4OycsXG4gICAgICAgIGNzc19hZnRlciAgPSAnbGVmdDotMTRweDsnO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2hlZXQuaW5zZXJ0UnVsZSkge1xuICAgICAgICBzaGVldC5pbnNlcnRSdWxlKFtzZWxfYmVmb3JlLCAneycsIGNzc19iZWZvcmUsICd9J10uam9pbignICcpLCB0aGlzLnJ1bGVfaWR4KTtcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShbc2VsX2FmdGVyLCAneycsIGNzc19hZnRlciwgJ30nXS5qb2luKCcgJyksIHRoaXMucnVsZV9pZHggKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsX2JlZm9yZSwgY3NzX2JlZm9yZSwgdGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsX2FmdGVyLCBjc3NfYWZ0ZXIsIHRoaXMucnVsZV9pZHggKyAxKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUmVtb3ZlIG9sZCBkcm9wZG93biBydWxlIGluZGV4XG4gICAgY2xlYXJfaWR4IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNoZWV0ID0gRm91bmRhdGlvbi5zdHlsZXNoZWV0O1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMucnVsZV9pZHggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUodGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUodGhpcy5ydWxlX2lkeCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnJ1bGVfaWR4O1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzbWFsbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllcy5zbWFsbCkubWF0Y2hlcyAmJlxuICAgICAgICAhbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubWVkaXVtKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLlModGhpcy5zY29wZSkub2ZmKCcuZm5kdG4uZHJvcGRvd24nKTtcbiAgICAgIHRoaXMuUygnaHRtbCwgYm9keScpLm9mZignLmZuZHRuLmRyb3Bkb3duJyk7XG4gICAgICB0aGlzLlMod2luZG93KS5vZmYoJy5mbmR0bi5kcm9wZG93bicpO1xuICAgICAgdGhpcy5TKCdbZGF0YS1kcm9wZG93bi1jb250ZW50XScpLm9mZignLmZuZHRuLmRyb3Bkb3duJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuZXF1YWxpemVyID0ge1xuICAgIG5hbWUgOiAnZXF1YWxpemVyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICB1c2VfdGFsbGVzdCA6IHRydWUsXG4gICAgICBiZWZvcmVfaGVpZ2h0X2NoYW5nZSA6ICQubm9vcCxcbiAgICAgIGFmdGVyX2hlaWdodF9jaGFuZ2UgOiAkLm5vb3AsXG4gICAgICBlcXVhbGl6ZV9vbl9zdGFjayA6IGZhbHNlLFxuICAgICAgYWN0X29uX2hpZGRlbl9lbDogZmFsc2VcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ2ltYWdlX2xvYWRlZCcpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5TKHdpbmRvdykub2ZmKCcuZXF1YWxpemVyJykub24oJ3Jlc2l6ZS5mbmR0bi5lcXVhbGl6ZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLnJlZmxvdygpO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgZXF1YWxpemUgOiBmdW5jdGlvbiAoZXF1YWxpemVyKSB7XG4gICAgICB2YXIgaXNTdGFja2VkID0gZmFsc2UsXG4gICAgICAgICAgZ3JvdXAgPSBlcXVhbGl6ZXIuZGF0YSgnZXF1YWxpemVyJyksXG4gICAgICAgICAgc2V0dGluZ3MgPSBlcXVhbGl6ZXIuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSsnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzLFxuICAgICAgICAgIHZhbHMsXG4gICAgICAgICAgZmlyc3RUb3BPZmZzZXQ7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5hY3Rfb25faGlkZGVuX2VsKSB7XG4gICAgICAgIHZhbHMgPSBncm91cCA/IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2g9XCInK2dyb3VwKydcIl0nKSA6IGVxdWFsaXplci5maW5kKCdbJyt0aGlzLmF0dHJfbmFtZSgpKyctd2F0Y2hdJyk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdmFscyA9IGdyb3VwID8gZXF1YWxpemVyLmZpbmQoJ1snK3RoaXMuYXR0cl9uYW1lKCkrJy13YXRjaD1cIicrZ3JvdXArJ1wiXTp2aXNpYmxlJykgOiBlcXVhbGl6ZXIuZmluZCgnWycrdGhpcy5hdHRyX25hbWUoKSsnLXdhdGNoXTp2aXNpYmxlJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICh2YWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNldHRpbmdzLmJlZm9yZV9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYmVmb3JlLWhlaWdodC1jaGFuZ2UuZm5kdGguZXF1YWxpemVyJyk7XG4gICAgICB2YWxzLmhlaWdodCgnaW5oZXJpdCcpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MuZXF1YWxpemVfb25fc3RhY2sgPT09IGZhbHNlKSB7XG4gICAgICAgIGZpcnN0VG9wT2Zmc2V0ID0gdmFscy5maXJzdCgpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdmFscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5vZmZzZXQoKS50b3AgIT09IGZpcnN0VG9wT2Zmc2V0KSB7XG4gICAgICAgICAgICBpc1N0YWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc1N0YWNrZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGhlaWdodHMgPSB2YWxzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKSB9KS5nZXQoKTtcblxuICAgICAgaWYgKHNldHRpbmdzLnVzZV90YWxsZXN0KSB7XG4gICAgICAgIHZhciBtYXggPSBNYXRoLm1heC5hcHBseShudWxsLCBoZWlnaHRzKTtcbiAgICAgICAgdmFscy5jc3MoJ2hlaWdodCcsIG1heCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbWluID0gTWF0aC5taW4uYXBwbHkobnVsbCwgaGVpZ2h0cyk7XG4gICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCBtaW4pO1xuICAgICAgfVxuXG4gICAgICBzZXR0aW5ncy5hZnRlcl9oZWlnaHRfY2hhbmdlKCk7XG4gICAgICBlcXVhbGl6ZXIudHJpZ2dlcignYWZ0ZXItaGVpZ2h0LWNoYW5nZS5mbmR0bi5lcXVhbGl6ZXInKTtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZXFfdGFyZ2V0ID0gJCh0aGlzKSxcbiAgICAgICAgICAgIG1lZGlhX3F1ZXJ5ID0gJGVxX3RhcmdldC5kYXRhKCdlcXVhbGl6ZXItbXEnKSxcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IHRydWU7XG5cbiAgICAgICAgaWYgKG1lZGlhX3F1ZXJ5KSB7XG4gICAgICAgICAgbWVkaWFfcXVlcnkgPSAnaXNfJyArIG1lZGlhX3F1ZXJ5LnJlcGxhY2UoLy0vZywgJ18nKTtcbiAgICAgICAgICBpZiAoRm91bmRhdGlvbi51dGlscy5oYXNPd25Qcm9wZXJ0eShtZWRpYV9xdWVyeSkpIHtcbiAgICAgICAgICAgIGlnbm9yZV9tZWRpYV9xdWVyeSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaW1hZ2VfbG9hZGVkKHNlbGYuUygnaW1nJywgdGhpcyksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoaWdub3JlX21lZGlhX3F1ZXJ5IHx8IEZvdW5kYXRpb24udXRpbHNbbWVkaWFfcXVlcnldKCkpIHtcbiAgICAgICAgICAgIHNlbGYuZXF1YWxpemUoJGVxX3RhcmdldClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbHMgPSAkZXFfdGFyZ2V0LmZpbmQoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICctd2F0Y2hdOnZpc2libGUnKTtcbiAgICAgICAgICAgIHZhbHMuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMuaW50ZXJjaGFuZ2UgPSB7XG4gICAgbmFtZSA6ICdpbnRlcmNoYW5nZScsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbWFnZXNfbG9hZGVkIDogZmFsc2UsXG4gICAgbm9kZXNfbG9hZGVkIDogZmFsc2UsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGxvYWRfYXR0ciA6ICdpbnRlcmNoYW5nZScsXG5cbiAgICAgIG5hbWVkX3F1ZXJpZXMgOiB7XG4gICAgICAgICdkZWZhdWx0JyAgICAgOiAnb25seSBzY3JlZW4nLFxuICAgICAgICAnc21hbGwnICAgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydzbWFsbCddLFxuICAgICAgICAnc21hbGwtb25seScgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydzbWFsbC1vbmx5J10sXG4gICAgICAgICdtZWRpdW0nICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ21lZGl1bSddLFxuICAgICAgICAnbWVkaXVtLW9ubHknIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydtZWRpdW0tb25seSddLFxuICAgICAgICAnbGFyZ2UnICAgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZSddLFxuICAgICAgICAnbGFyZ2Utb25seScgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZS1vbmx5J10sXG4gICAgICAgICd4bGFyZ2UnICAgICAgOiBGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3hsYXJnZSddLFxuICAgICAgICAneGxhcmdlLW9ubHknIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd4bGFyZ2Utb25seSddLFxuICAgICAgICAneHhsYXJnZScgICAgIDogRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd4eGxhcmdlJ10sXG4gICAgICAgICdsYW5kc2NhcGUnICAgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogbGFuZHNjYXBlKScsXG4gICAgICAgICdwb3J0cmFpdCcgICAgOiAnb25seSBzY3JlZW4gYW5kIChvcmllbnRhdGlvbjogcG9ydHJhaXQpJyxcbiAgICAgICAgJ3JldGluYScgICAgICA6ICdvbmx5IHNjcmVlbiBhbmQgKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksJyArXG4gICAgICAgICAgJ29ubHkgc2NyZWVuIGFuZCAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSwnICtcbiAgICAgICAgICAnb25seSBzY3JlZW4gYW5kICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAxOTJkcGkpLCcgK1xuICAgICAgICAgICdvbmx5IHNjcmVlbiBhbmQgKG1pbi1yZXNvbHV0aW9uOiAyZHBweCknXG4gICAgICB9LFxuXG4gICAgICBkaXJlY3RpdmVzIDoge1xuICAgICAgICByZXBsYWNlIDogZnVuY3Rpb24gKGVsLCBwYXRoLCB0cmlnZ2VyKSB7XG4gICAgICAgICAgLy8gVGhlIHRyaWdnZXIgYXJndW1lbnQsIGlmIGNhbGxlZCB3aXRoaW4gdGhlIGRpcmVjdGl2ZSwgZmlyZXNcbiAgICAgICAgICAvLyBhbiBldmVudCBuYW1lZCBhZnRlciB0aGUgZGlyZWN0aXZlIG9uIHRoZSBlbGVtZW50LCBwYXNzaW5nXG4gICAgICAgICAgLy8gYW55IHBhcmFtZXRlcnMgYWxvbmcgdG8gdGhlIGV2ZW50IHRoYXQgeW91IHBhc3MgdG8gdHJpZ2dlci5cbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIGV4LiB0cmlnZ2VyKCksIHRyaWdnZXIoW2EsIGIsIGNdKSwgb3IgdHJpZ2dlcihhLCBiLCBjKVxuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gVGhpcyBhbGxvd3MgeW91IHRvIGJpbmQgYSBjYWxsYmFjayBsaWtlIHNvOlxuICAgICAgICAgIC8vICQoJyNpbnRlcmNoYW5nZUNvbnRhaW5lcicpLm9uKCdyZXBsYWNlJywgZnVuY3Rpb24gKGUsIGEsIGIsIGMpIHtcbiAgICAgICAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpLCBhLCBiLCBjKTtcbiAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgIGlmIChlbCAhPT0gbnVsbCAmJiAvSU1HLy50ZXN0KGVsWzBdLm5vZGVOYW1lKSkge1xuICAgICAgICAgICAgdmFyIG9yaWdfcGF0aCA9IGVsWzBdLnNyYztcblxuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAocGF0aCwgJ2knKS50ZXN0KG9yaWdfcGF0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbC5hdHRyKFwic3JjXCIsIHBhdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlcihlbFswXS5zcmMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbGFzdF9wYXRoID0gZWwuZGF0YSh0aGlzLmRhdGFfYXR0ciArICctbGFzdC1wYXRoJyksXG4gICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICAgaWYgKGxhc3RfcGF0aCA9PSBwYXRoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9cXC4oZ2lmfGpwZ3xqcGVnfHRpZmZ8cG5nKShbPyNdLiopPy9pLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICQoZWwpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArIHBhdGggKyAnKScpO1xuICAgICAgICAgICAgZWwuZGF0YSgnaW50ZXJjaGFuZ2UtbGFzdC1wYXRoJywgcGF0aCk7XG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlcihwYXRoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJC5nZXQocGF0aCwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBlbC5odG1sKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGVsLmRhdGEoc2VsZi5kYXRhX2F0dHIgKyAnLWxhc3QtcGF0aCcsIHBhdGgpO1xuICAgICAgICAgICAgdHJpZ2dlcigpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIHJhbmRvbV9zdHInKTtcblxuICAgICAgdGhpcy5kYXRhX2F0dHIgPSB0aGlzLnNldF9kYXRhX2F0dHIoKTtcbiAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMuc2V0dGluZ3MsIG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0sXG5cbiAgICBnZXRfbWVkaWFfaGFzaCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG1lZGlhSGFzaCA9ICcnO1xuICAgICAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzICkge1xuICAgICAgICAgICAgbWVkaWFIYXNoICs9IG1hdGNoTWVkaWEodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzW3F1ZXJ5TmFtZV0pLm1hdGNoZXMudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWVkaWFIYXNoO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsIHByZXZNZWRpYUhhc2g7XG5cbiAgICAgICQod2luZG93KVxuICAgICAgICAub2ZmKCcuaW50ZXJjaGFuZ2UnKVxuICAgICAgICAub24oJ3Jlc2l6ZS5mbmR0bi5pbnRlcmNoYW5nZScsIHNlbGYudGhyb3R0bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJNZWRpYUhhc2ggPSBzZWxmLmdldF9tZWRpYV9oYXNoKCk7XG4gICAgICAgICAgICBpZiAoY3Vyck1lZGlhSGFzaCAhPT0gcHJldk1lZGlhSGFzaCkge1xuICAgICAgICAgICAgICAgIHNlbGYucmVzaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmV2TWVkaWFIYXNoID0gY3Vyck1lZGlhSGFzaDtcbiAgICAgICAgfSwgNTApKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIHJlc2l6ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG5cbiAgICAgIGlmICghdGhpcy5pbWFnZXNfbG9hZGVkIHx8ICF0aGlzLm5vZGVzX2xvYWRlZCkge1xuICAgICAgICBzZXRUaW1lb3V0KCQucHJveHkodGhpcy5yZXNpemUsIHRoaXMpLCA1MCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgdXVpZCBpbiBjYWNoZSkge1xuICAgICAgICBpZiAoY2FjaGUuaGFzT3duUHJvcGVydHkodXVpZCkpIHtcbiAgICAgICAgICB2YXIgcGFzc2VkID0gdGhpcy5yZXN1bHRzKHV1aWQsIGNhY2hlW3V1aWRdKTtcbiAgICAgICAgICBpZiAocGFzc2VkKSB7XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmRpcmVjdGl2ZXNbcGFzc2VkXG4gICAgICAgICAgICAgIC5zY2VuYXJpb1sxXV0uY2FsbCh0aGlzLCBwYXNzZWQuZWwsIHBhc3NlZC5zY2VuYXJpb1swXSwgKGZ1bmN0aW9uIChwYXNzZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzWzBdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcGFzc2VkLmVsLnRyaWdnZXIocGFzc2VkLnNjZW5hcmlvWzFdLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0ocGFzc2VkKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJlc3VsdHMgOiBmdW5jdGlvbiAodXVpZCwgc2NlbmFyaW9zKSB7XG4gICAgICB2YXIgY291bnQgPSBzY2VuYXJpb3MubGVuZ3RoO1xuXG4gICAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuUygnWycgKyB0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtdXVpZCcpICsgJz1cIicgKyB1dWlkICsgJ1wiXScpO1xuXG4gICAgICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgICAgdmFyIG1xLCBydWxlID0gc2NlbmFyaW9zW2NvdW50XVsyXTtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzLmhhc093blByb3BlcnR5KHJ1bGUpKSB7XG4gICAgICAgICAgICBtcSA9IG1hdGNoTWVkaWEodGhpcy5zZXR0aW5ncy5uYW1lZF9xdWVyaWVzW3J1bGVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXEgPSBtYXRjaE1lZGlhKHJ1bGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobXEubWF0Y2hlcykge1xuICAgICAgICAgICAgcmV0dXJuIHtlbCA6IGVsLCBzY2VuYXJpbyA6IHNjZW5hcmlvc1tjb3VudF19O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIGxvYWQgOiBmdW5jdGlvbiAodHlwZSwgZm9yY2VfdXBkYXRlKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXNbJ2NhY2hlZF8nICsgdHlwZV0gPT09ICd1bmRlZmluZWQnIHx8IGZvcmNlX3VwZGF0ZSkge1xuICAgICAgICB0aGlzWyd1cGRhdGVfJyArIHR5cGVdKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzWydjYWNoZWRfJyArIHR5cGVdO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfaW1hZ2VzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGltYWdlcyA9IHRoaXMuUygnaW1nWycgKyB0aGlzLmRhdGFfYXR0ciArICddJyksXG4gICAgICAgICAgY291bnQgPSBpbWFnZXMubGVuZ3RoLFxuICAgICAgICAgIGkgPSBjb3VudCxcbiAgICAgICAgICBsb2FkZWRfY291bnQgPSAwLFxuICAgICAgICAgIGRhdGFfYXR0ciA9IHRoaXMuZGF0YV9hdHRyO1xuXG4gICAgICB0aGlzLmNhY2hlID0ge307XG4gICAgICB0aGlzLmNhY2hlZF9pbWFnZXMgPSBbXTtcbiAgICAgIHRoaXMuaW1hZ2VzX2xvYWRlZCA9IChjb3VudCA9PT0gMCk7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgbG9hZGVkX2NvdW50Kys7XG4gICAgICAgIGlmIChpbWFnZXNbaV0pIHtcbiAgICAgICAgICB2YXIgc3RyID0gaW1hZ2VzW2ldLmdldEF0dHJpYnV0ZShkYXRhX2F0dHIpIHx8ICcnO1xuXG4gICAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlZF9pbWFnZXMucHVzaChpbWFnZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2FkZWRfY291bnQgPT09IGNvdW50KSB7XG4gICAgICAgICAgdGhpcy5pbWFnZXNfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmVuaGFuY2UoJ2ltYWdlcycpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfbm9kZXMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLlMoJ1snICsgdGhpcy5kYXRhX2F0dHIgKyAnXScpLm5vdCgnaW1nJyksXG4gICAgICAgICAgY291bnQgPSBub2Rlcy5sZW5ndGgsXG4gICAgICAgICAgaSA9IGNvdW50LFxuICAgICAgICAgIGxvYWRlZF9jb3VudCA9IDAsXG4gICAgICAgICAgZGF0YV9hdHRyID0gdGhpcy5kYXRhX2F0dHI7XG5cbiAgICAgIHRoaXMuY2FjaGVkX25vZGVzID0gW107XG4gICAgICB0aGlzLm5vZGVzX2xvYWRlZCA9IChjb3VudCA9PT0gMCk7XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgbG9hZGVkX2NvdW50Kys7XG4gICAgICAgIHZhciBzdHIgPSBub2Rlc1tpXS5nZXRBdHRyaWJ1dGUoZGF0YV9hdHRyKSB8fCAnJztcblxuICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZF9ub2Rlcy5wdXNoKG5vZGVzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsb2FkZWRfY291bnQgPT09IGNvdW50KSB7XG4gICAgICAgICAgdGhpcy5ub2Rlc19sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZW5oYW5jZSgnbm9kZXMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgZW5oYW5jZSA6IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICB2YXIgaSA9IHRoaXNbJ2NhY2hlZF8nICsgdHlwZV0ubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHRoaXMub2JqZWN0KCQodGhpc1snY2FjaGVkXycgKyB0eXBlXVtpXSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJCh3aW5kb3cpLnRyaWdnZXIoJ3Jlc2l6ZS5mbmR0bi5pbnRlcmNoYW5nZScpO1xuICAgIH0sXG5cbiAgICBjb252ZXJ0X2RpcmVjdGl2ZSA6IGZ1bmN0aW9uIChkaXJlY3RpdmUpIHtcblxuICAgICAgdmFyIHRyaW1tZWQgPSB0aGlzLnRyaW0oZGlyZWN0aXZlKTtcblxuICAgICAgaWYgKHRyaW1tZWQubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdHJpbW1lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICdyZXBsYWNlJztcbiAgICB9LFxuXG4gICAgcGFyc2Vfc2NlbmFyaW8gOiBmdW5jdGlvbiAoc2NlbmFyaW8pIHtcbiAgICAgIC8vIFRoaXMgbG9naWMgaGFkIHRvIGJlIG1hZGUgbW9yZSBjb21wbGV4IHNpbmNlIHNvbWUgdXNlcnMgd2VyZSB1c2luZyBjb21tYXMgaW4gdGhlIHVybCBwYXRoXG4gICAgICAvLyBTbyB3ZSBjYW5ub3Qgc2ltcGx5IGp1c3Qgc3BsaXQgb24gYSBjb21tYVxuXG4gICAgICB2YXIgZGlyZWN0aXZlX21hdGNoID0gc2NlbmFyaW9bMF0ubWF0Y2goLyguKyksXFxzKihcXHcrKVxccyokLyksXG4gICAgICAvLyBnZXR0aW5nIHRoZSBtcSBoYXMgZ290dGVuIGEgYml0IGNvbXBsaWNhdGVkIHNpbmNlIHdlIHN0YXJ0ZWQgYWNjb3VudGluZyBmb3Igc2V2ZXJhbCB1c2UgY2FzZXNcbiAgICAgIC8vIG9mIFVSTHMuIEZvciBub3cgd2UnbGwgY29udGludWUgdG8gbWF0Y2ggdGhlc2Ugc2NlbmFyaW9zLCBidXQgd2UgbWF5IGNvbnNpZGVyIGhhdmluZyB0aGVzZSBzY2VuYXJpb3NcbiAgICAgIC8vIGFzIG5lc3RlZCBvYmplY3RzIG9yIGFycmF5cyBpbiBGNi5cbiAgICAgIC8vIHJlZ2V4OiBtYXRjaCBldmVyeXRoaW5nIGJlZm9yZSBjbG9zZSBwYXJlbnRoZXNpcyBmb3IgbXFcbiAgICAgIG1lZGlhX3F1ZXJ5ICAgICAgICAgPSBzY2VuYXJpb1sxXS5tYXRjaCgvKC4qKVxcKS8pO1xuXG4gICAgICBpZiAoZGlyZWN0aXZlX21hdGNoKSB7XG4gICAgICAgIHZhciBwYXRoICA9IGRpcmVjdGl2ZV9tYXRjaFsxXSxcbiAgICAgICAgZGlyZWN0aXZlID0gZGlyZWN0aXZlX21hdGNoWzJdO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2FjaGVkX3NwbGl0ID0gc2NlbmFyaW9bMF0uc3BsaXQoLyxcXHMqJC8pLFxuICAgICAgICBwYXRoICAgICAgICAgICAgID0gY2FjaGVkX3NwbGl0WzBdLFxuICAgICAgICBkaXJlY3RpdmUgICAgICAgID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbdGhpcy50cmltKHBhdGgpLCB0aGlzLmNvbnZlcnRfZGlyZWN0aXZlKGRpcmVjdGl2ZSksIHRoaXMudHJpbShtZWRpYV9xdWVyeVsxXSldO1xuICAgIH0sXG5cbiAgICBvYmplY3QgOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciByYXdfYXJyID0gdGhpcy5wYXJzZV9kYXRhX2F0dHIoZWwpLFxuICAgICAgICAgIHNjZW5hcmlvcyA9IFtdLFxuICAgICAgICAgIGkgPSByYXdfYXJyLmxlbmd0aDtcblxuICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAvLyBzcGxpdCBhcnJheSBiZXR3ZWVuIGNvbW1hIGRlbGltaXRlZCBjb250ZW50IGFuZCBtcVxuICAgICAgICAgIC8vIHJlZ2V4OiBjb21tYSwgb3B0aW9uYWwgc3BhY2UsIG9wZW4gcGFyZW50aGVzaXNcbiAgICAgICAgICB2YXIgc2NlbmFyaW8gPSByYXdfYXJyW2ldLnNwbGl0KC8sXFxzP1xcKC8pO1xuXG4gICAgICAgICAgaWYgKHNjZW5hcmlvLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB0aGlzLnBhcnNlX3NjZW5hcmlvKHNjZW5hcmlvKTtcbiAgICAgICAgICAgIHNjZW5hcmlvcy5wdXNoKHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnN0b3JlKGVsLCBzY2VuYXJpb3MpO1xuICAgIH0sXG5cbiAgICBzdG9yZSA6IGZ1bmN0aW9uIChlbCwgc2NlbmFyaW9zKSB7XG4gICAgICB2YXIgdXVpZCA9IHRoaXMucmFuZG9tX3N0cigpLFxuICAgICAgICAgIGN1cnJlbnRfdXVpZCA9IGVsLmRhdGEodGhpcy5hZGRfbmFtZXNwYWNlKCd1dWlkJywgdHJ1ZSkpO1xuXG4gICAgICBpZiAodGhpcy5jYWNoZVtjdXJyZW50X3V1aWRdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlW2N1cnJlbnRfdXVpZF07XG4gICAgICB9XG5cbiAgICAgIGVsLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXV1aWQnKSwgdXVpZCk7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVt1dWlkXSA9IHNjZW5hcmlvcztcbiAgICB9LFxuXG4gICAgdHJpbSA6IGZ1bmN0aW9uIChzdHIpIHtcblxuICAgICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiAkLnRyaW0oc3RyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgc2V0X2RhdGFfYXR0ciA6IGZ1bmN0aW9uIChpbml0KSB7XG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHRoaXMuc2V0dGluZ3MubG9hZF9hdHRyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0dGluZ3MubG9hZF9hdHRyO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gJ2RhdGEtJyArIHRoaXMubmFtZXNwYWNlICsgJy0nICsgdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnZGF0YS0nICsgdGhpcy5zZXR0aW5ncy5sb2FkX2F0dHI7XG4gICAgfSxcblxuICAgIHBhcnNlX2RhdGFfYXR0ciA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHJhdyA9IGVsLmF0dHIodGhpcy5hdHRyX25hbWUoKSkuc3BsaXQoL1xcWyguKj8pXFxdLyksXG4gICAgICAgICAgaSA9IHJhdy5sZW5ndGgsXG4gICAgICAgICAgb3V0cHV0ID0gW107XG5cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHJhd1tpXS5yZXBsYWNlKC9bXFxXXFxkXSsvLCAnJykubGVuZ3RoID4gNCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHJhd1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5sb2FkKCdpbWFnZXMnLCB0cnVlKTtcbiAgICAgIHRoaXMubG9hZCgnbm9kZXMnLCB0cnVlKTtcbiAgICB9XG5cbiAgfTtcblxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIE1vZGVybml6ciA9IE1vZGVybml6ciB8fCBmYWxzZTtcblxuICBGb3VuZGF0aW9uLmxpYnMuam95cmlkZSA9IHtcbiAgICBuYW1lIDogJ2pveXJpZGUnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBkZWZhdWx0cyA6IHtcbiAgICAgIGV4cG9zZSAgICAgICAgICAgICAgICAgICA6IGZhbHNlLCAgICAgLy8gdHVybiBvbiBvciBvZmYgdGhlIGV4cG9zZSBmZWF0dXJlXG4gICAgICBtb2RhbCAgICAgICAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZXRoZXIgdG8gY292ZXIgcGFnZSB3aXRoIG1vZGFsIGR1cmluZyB0aGUgdG91clxuICAgICAga2V5Ym9hcmQgICAgICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyBlbmFibGUgbGVmdCwgcmlnaHQgYW5kIGVzYyBrZXlzdHJva2VzXG4gICAgICB0aXBfbG9jYXRpb24gICAgICAgICAgICAgOiAnYm90dG9tJywgIC8vICd0b3AnIG9yICdib3R0b20nIGluIHJlbGF0aW9uIHRvIHBhcmVudFxuICAgICAgbnViX3Bvc2l0aW9uICAgICAgICAgICAgIDogJ2F1dG8nLCAgICAvLyBvdmVycmlkZSBvbiBhIHBlciB0b29sdGlwIGJhc2VzXG4gICAgICBzY3JvbGxfc3BlZWQgICAgICAgICAgICAgOiAxNTAwLCAgICAgIC8vIFBhZ2Ugc2Nyb2xsaW5nIHNwZWVkIGluIG1pbGxpc2Vjb25kcywgMCA9IG5vIHNjcm9sbCBhbmltYXRpb25cbiAgICAgIHNjcm9sbF9hbmltYXRpb24gICAgICAgICA6ICdsaW5lYXInLCAgLy8gc3VwcG9ydHMgJ3N3aW5nJyBhbmQgJ2xpbmVhcicsIGV4dGVuZCB3aXRoIGpRdWVyeSBVSS5cbiAgICAgIHRpbWVyICAgICAgICAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gMCA9IG5vIHRpbWVyICwgYWxsIG90aGVyIG51bWJlcnMgPSB0aW1lciBpbiBtaWxsaXNlY29uZHNcbiAgICAgIHN0YXJ0X3RpbWVyX29uX2NsaWNrICAgICA6IHRydWUsICAgICAgLy8gdHJ1ZSBvciBmYWxzZSAtIHRydWUgcmVxdWlyZXMgY2xpY2tpbmcgdGhlIGZpcnN0IGJ1dHRvbiBzdGFydCB0aGUgdGltZXJcbiAgICAgIHN0YXJ0X29mZnNldCAgICAgICAgICAgICA6IDAsICAgICAgICAgLy8gdGhlIGluZGV4IG9mIHRoZSB0b29sdGlwIHlvdSB3YW50IHRvIHN0YXJ0IG9uIChpbmRleCBvZiB0aGUgbGkpXG4gICAgICBuZXh0X2J1dHRvbiAgICAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIHRydWUgb3IgZmFsc2UgdG8gY29udHJvbCB3aGV0aGVyIGEgbmV4dCBidXR0b24gaXMgdXNlZFxuICAgICAgcHJldl9idXR0b24gICAgICAgICAgICAgIDogdHJ1ZSwgICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBhIHByZXYgYnV0dG9uIGlzIHVzZWRcbiAgICAgIHRpcF9hbmltYXRpb24gICAgICAgICAgICA6ICdmYWRlJywgICAgLy8gJ3BvcCcgb3IgJ2ZhZGUnIGluIGVhY2ggdGlwXG4gICAgICBwYXVzZV9hZnRlciAgICAgICAgICAgICAgOiBbXSwgICAgICAgIC8vIGFycmF5IG9mIGluZGV4ZXMgd2hlcmUgdG8gcGF1c2UgdGhlIHRvdXIgYWZ0ZXJcbiAgICAgIGV4cG9zZWQgICAgICAgICAgICAgICAgICA6IFtdLCAgICAgICAgLy8gYXJyYXkgb2YgZXhwb3NlIGVsZW1lbnRzXG4gICAgICB0aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQgOiAzMDAsICAgICAgIC8vIHdoZW4gdGlwQW5pbWF0aW9uID0gJ2ZhZGUnIHRoaXMgaXMgc3BlZWQgaW4gbWlsbGlzZWNvbmRzIGZvciB0aGUgdHJhbnNpdGlvblxuICAgICAgY29va2llX21vbnN0ZXIgICAgICAgICAgIDogZmFsc2UsICAgICAvLyB0cnVlIG9yIGZhbHNlIHRvIGNvbnRyb2wgd2hldGhlciBjb29raWVzIGFyZSB1c2VkXG4gICAgICBjb29raWVfbmFtZSAgICAgICAgICAgICAgOiAnam95cmlkZScsIC8vIE5hbWUgdGhlIGNvb2tpZSB5b3UnbGwgdXNlXG4gICAgICBjb29raWVfZG9tYWluICAgICAgICAgICAgOiBmYWxzZSwgICAgIC8vIFdpbGwgdGhpcyBjb29raWUgYmUgYXR0YWNoZWQgdG8gYSBkb21haW4sIGllLiAnLm5vdGFibGVhcHAuY29tJ1xuICAgICAgY29va2llX2V4cGlyZXMgICAgICAgICAgIDogMzY1LCAgICAgICAvLyBzZXQgd2hlbiB5b3Ugd291bGQgbGlrZSB0aGUgY29va2llIHRvIGV4cGlyZS5cbiAgICAgIHRpcF9jb250YWluZXIgICAgICAgICAgICA6ICdib2R5JywgICAgLy8gV2hlcmUgd2lsbCB0aGUgdGlwIGJlIGF0dGFjaGVkXG4gICAgICBhYm9ydF9vbl9jbG9zZSAgICAgICAgICAgOiB0cnVlLCAgICAgIC8vIFdoZW4gdHJ1ZSwgdGhlIGNsb3NlIGV2ZW50IHdpbGwgbm90IGZpcmUgYW55IGNhbGxiYWNrXG4gICAgICB0aXBfbG9jYXRpb25fcGF0dGVybnMgICAgOiB7XG4gICAgICAgIHRvcCA6IFsnYm90dG9tJ10sXG4gICAgICAgIGJvdHRvbSA6IFtdLCAvLyBib3R0b20gc2hvdWxkIG5vdCBuZWVkIHRvIGJlIHJlcG9zaXRpb25lZFxuICAgICAgICBsZWZ0IDogWydyaWdodCcsICd0b3AnLCAnYm90dG9tJ10sXG4gICAgICAgIHJpZ2h0IDogWydsZWZ0JywgJ3RvcCcsICdib3R0b20nXVxuICAgICAgfSxcbiAgICAgIHBvc3RfcmlkZV9jYWxsYmFjayAgICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBvbmNlIHRoZSB0b3VyIGNsb3NlcyAoY2FuY2VsZWQgb3IgY29tcGxldGUpXG4gICAgICBwb3N0X3N0ZXBfY2FsbGJhY2sgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYWZ0ZXIgZWFjaCBzdGVwXG4gICAgICBwcmVfc3RlcF9jYWxsYmFjayAgICAgIDogZnVuY3Rpb24gKCkge30sICAgIC8vIEEgbWV0aG9kIHRvIGNhbGwgYmVmb3JlIGVhY2ggc3RlcFxuICAgICAgcHJlX3JpZGVfY2FsbGJhY2sgICAgICA6IGZ1bmN0aW9uICgpIHt9LCAgICAvLyBBIG1ldGhvZCB0byBjYWxsIGJlZm9yZSB0aGUgdG91ciBzdGFydHMgKHBhc3NlZCBpbmRleCwgdGlwLCBhbmQgY2xvbmVkIGV4cG9zZWQgZWxlbWVudClcbiAgICAgIHBvc3RfZXhwb3NlX2NhbGxiYWNrICAgOiBmdW5jdGlvbiAoKSB7fSwgICAgLy8gQSBtZXRob2QgdG8gY2FsbCBhZnRlciBhbiBlbGVtZW50IGhhcyBiZWVuIGV4cG9zZWRcbiAgICAgIHRlbXBsYXRlIDogeyAvLyBIVE1MIHNlZ21lbnRzIGZvciB0aXAgbGF5b3V0XG4gICAgICAgIGxpbmsgICAgICAgICAgOiAnPGEgaHJlZj1cIiNjbG9zZVwiIGNsYXNzPVwiam95cmlkZS1jbG9zZS10aXBcIj4mdGltZXM7PC9hPicsXG4gICAgICAgIHRpbWVyICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yLXdyYXBcIj48c3BhbiBjbGFzcz1cImpveXJpZGUtdGltZXItaW5kaWNhdG9yXCI+PC9zcGFuPjwvZGl2PicsXG4gICAgICAgIHRpcCAgICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtdGlwLWd1aWRlXCI+PHNwYW4gY2xhc3M9XCJqb3lyaWRlLW51YlwiPjwvc3Bhbj48L2Rpdj4nLFxuICAgICAgICB3cmFwcGVyICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWNvbnRlbnQtd3JhcHBlclwiPjwvZGl2PicsXG4gICAgICAgIGJ1dHRvbiAgICAgICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLW5leHQtdGlwXCI+PC9hPicsXG4gICAgICAgIHByZXZfYnV0dG9uICAgOiAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cInNtYWxsIGJ1dHRvbiBqb3lyaWRlLXByZXYtdGlwXCI+PC9hPicsXG4gICAgICAgIG1vZGFsICAgICAgICAgOiAnPGRpdiBjbGFzcz1cImpveXJpZGUtbW9kYWwtYmdcIj48L2Rpdj4nLFxuICAgICAgICBleHBvc2UgICAgICAgIDogJzxkaXYgY2xhc3M9XCJqb3lyaWRlLWV4cG9zZS13cmFwcGVyXCI+PC9kaXY+JyxcbiAgICAgICAgZXhwb3NlX2NvdmVyICA6ICc8ZGl2IGNsYXNzPVwiam95cmlkZS1leHBvc2UtY292ZXJcIj48L2Rpdj4nXG4gICAgICB9LFxuICAgICAgZXhwb3NlX2FkZF9jbGFzcyA6ICcnIC8vIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBjbGFzcyBuYW1lcyB0byBiZSBhZGRlZCB0byBleHBvc2VkIGVsZW1lbnRcbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICBGb3VuZGF0aW9uLmluaGVyaXQodGhpcywgJ3Rocm90dGxlIHJhbmRvbV9zdHInKTtcblxuICAgICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwgJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIChvcHRpb25zIHx8IG1ldGhvZCkpO1xuXG4gICAgICB0aGlzLmJpbmRpbmdzKG1ldGhvZCwgb3B0aW9ucylcbiAgICB9LFxuXG4gICAgZ29fbmV4dCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCkubGVuZ3RoIDwgMSkge1xuICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdvX3ByZXYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy4kbGkucHJldigpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGVyZSBhcmUgbm8gcHJldiBlbGVtZW50XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNldHRpbmdzLmF1dG9tYXRlKTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuc2hvdyhudWxsLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zaG93KG51bGwsIHRydWUpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICQodGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLmpveXJpZGUnKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5nb19uZXh0KClcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLmpveXJpZGUnLCAnLmpveXJpZGUtcHJldi10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4uam95cmlkZScsICcuam95cmlkZS1jbG9zZS10aXAnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKVxuXG4gICAgICAgIC5vbigna2V5dXAuZm5kdG4uam95cmlkZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYga2V5c3Ryb2tlcyBhcmUgZGlzYWJsZWRcbiAgICAgICAgICAvLyBvciBpZiB0aGUgam95cmlkZSBpcyBub3QgYmVpbmcgc2hvd25cbiAgICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3Mua2V5Ym9hcmQgfHwgIXRoaXMuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc3dpdGNoIChlLndoaWNoKSB7XG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodCBhcnJvd1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgIHRoaXMuZ29fbmV4dCgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnQgYXJyb3dcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmdvX3ByZXYoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB0aGlzLmVuZCh0aGlzLnNldHRpbmdzLmFib3J0X29uX2Nsb3NlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICQod2luZG93KVxuICAgICAgICAub2ZmKCcuam95cmlkZScpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLmpveXJpZGUnLCBzZWxmLnRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwICYmIHNlbGYuc2V0dGluZ3MuJG5leHRfdGlwICYmIHNlbGYuc2V0dGluZ3MucmlkaW5nKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgdmFyICRlbHMgPSAkKHNlbGYuc2V0dGluZ3MuZXhwb3NlZCk7XG5cbiAgICAgICAgICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIHNlbGYudW5fZXhwb3NlKCR0aGlzKTtcbiAgICAgICAgICAgICAgICBzZWxmLmV4cG9zZSgkdGhpcyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICAgIHNlbGYucG9zX3Bob25lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnBvc19kZWZhdWx0KGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCkpO1xuICAgIH0sXG5cbiAgICBzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAkdGhpcyA9ICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJywgdGhpcy5zY29wZSksXG4gICAgICAgICAgaW50ZWdlcl9zZXR0aW5ncyA9IFsndGltZXInLCAnc2Nyb2xsU3BlZWQnLCAnc3RhcnRPZmZzZXQnLCAndGlwQW5pbWF0aW9uRmFkZVNwZWVkJywgJ2Nvb2tpZUV4cGlyZXMnXSxcbiAgICAgICAgICBpbnRfc2V0dGluZ3NfY291bnQgPSBpbnRlZ2VyX3NldHRpbmdzLmxlbmd0aDtcblxuICAgICAgaWYgKCEkdGhpcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLmluaXQpIHtcbiAgICAgICAgdGhpcy5ldmVudHMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXR0aW5ncyA9ICR0aGlzLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcblxuICAgICAgLy8gbm9uIGNvbmZpZ3VyZWFibGUgc2V0dGluZ3NcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwgPSAkdGhpcztcbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkgPSAkKHRoaXMuc2V0dGluZ3MudGlwX2NvbnRhaW5lcik7XG4gICAgICB0aGlzLnNldHRpbmdzLmJvZHlfb2Zmc2V0ID0gJCh0aGlzLnNldHRpbmdzLnRpcF9jb250YWluZXIpLnBvc2l0aW9uKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudCA9IHRoaXMuc2V0dGluZ3MuJGNvbnRlbnRfZWwuZmluZCgnPiBsaScpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSB0cnVlO1xuXG4gICAgICAvLyBjYW4gd2UgY3JlYXRlIGNvb2tpZXM/XG4gICAgICBpZiAodHlwZW9mICQuY29va2llICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2VuZXJhdGUgdGhlIHRpcHMgYW5kIGluc2VydCBpbnRvIGRvbS5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5jb29raWVfbW9uc3RlciB8fCB0aGlzLnNldHRpbmdzLmNvb2tpZV9tb25zdGVyICYmICEkLmNvb2tpZSh0aGlzLnNldHRpbmdzLmNvb2tpZV9uYW1lKSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiR0aXBfY29udGVudC5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBzZWxmLmRlZmF1bHRzLCBzZWxmLmRhdGFfb3B0aW9ucygkdGhpcykpO1xuXG4gICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgc2V0dGluZ3MgcGFyc2VkIGZyb20gZGF0YV9vcHRpb25zIGFyZSBpbnRlZ2VycyB3aGVyZSBuZWNlc3NhcnlcbiAgICAgICAgICB2YXIgaSA9IGludF9zZXR0aW5nc19jb3VudDtcbiAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBzZWxmLnNldHRpbmdzW2ludGVnZXJfc2V0dGluZ3NbaV1dID0gcGFyc2VJbnQoc2VsZi5zZXR0aW5nc1tpbnRlZ2VyX3NldHRpbmdzW2ldXSwgMTApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxmLmNyZWF0ZSh7JGxpIDogJHRoaXMsIGluZGV4IDogaW5kZXh9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2hvdyBmaXJzdCB0aXBcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnN0YXJ0X3RpbWVyX29uX2NsaWNrICYmIHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93KCdpbml0Jyk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH0sXG5cbiAgICByZXN1bWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldF9saSgpO1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfSxcblxuICAgIHRpcF90ZW1wbGF0ZSA6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICB2YXIgJGJsYW5rLCBjb250ZW50O1xuXG4gICAgICBvcHRzLnRpcF9jbGFzcyA9IG9wdHMudGlwX2NsYXNzIHx8ICcnO1xuXG4gICAgICAkYmxhbmsgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGlwKS5hZGRDbGFzcyhvcHRzLnRpcF9jbGFzcyk7XG4gICAgICBjb250ZW50ID0gJC50cmltKCQob3B0cy5saSkuaHRtbCgpKSArXG4gICAgICAgIHRoaXMucHJldl9idXR0b25fdGV4dChvcHRzLnByZXZfYnV0dG9uX3RleHQsIG9wdHMuaW5kZXgpICtcbiAgICAgICAgdGhpcy5idXR0b25fdGV4dChvcHRzLmJ1dHRvbl90ZXh0KSArXG4gICAgICAgIHRoaXMuc2V0dGluZ3MudGVtcGxhdGUubGluayArXG4gICAgICAgIHRoaXMudGltZXJfaW5zdGFuY2Uob3B0cy5pbmRleCk7XG5cbiAgICAgICRibGFuay5hcHBlbmQoJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLndyYXBwZXIpKTtcbiAgICAgICRibGFuay5maXJzdCgpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWluZGV4JyksIG9wdHMuaW5kZXgpO1xuICAgICAgJCgnLmpveXJpZGUtY29udGVudC13cmFwcGVyJywgJGJsYW5rKS5hcHBlbmQoY29udGVudCk7XG5cbiAgICAgIHJldHVybiAkYmxhbmtbMF07XG4gICAgfSxcblxuICAgIHRpbWVyX2luc3RhbmNlIDogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgdHh0O1xuXG4gICAgICBpZiAoKGluZGV4ID09PSAwICYmIHRoaXMuc2V0dGluZ3Muc3RhcnRfdGltZXJfb25fY2xpY2sgJiYgdGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHx8IHRoaXMuc2V0dGluZ3MudGltZXIgPT09IDApIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUudGltZXIpWzBdLm91dGVySFRNTDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eHQ7XG4gICAgfSxcblxuICAgIGJ1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm5leHRfYnV0dG9uKSB7XG4gICAgICAgIHR4dCA9ICQudHJpbSh0eHQpIHx8ICdOZXh0JztcbiAgICAgICAgdHh0ID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmJ1dHRvbikuYXBwZW5kKHR4dClbMF0ub3V0ZXJIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBwcmV2X2J1dHRvbl90ZXh0IDogZnVuY3Rpb24gKHR4dCwgaWR4KSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MucHJldl9idXR0b24pIHtcbiAgICAgICAgdHh0ID0gJC50cmltKHR4dCkgfHwgJ1ByZXZpb3VzJztcblxuICAgICAgICAvLyBBZGQgdGhlIGRpc2FibGVkIGNsYXNzIHRvIHRoZSBidXR0b24gaWYgaXQncyB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgICBpZiAoaWR4ID09IDApIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpLmFkZENsYXNzKCdkaXNhYmxlZCcpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0eHQgPSAkKHRoaXMuc2V0dGluZ3MudGVtcGxhdGUucHJldl9idXR0b24pLmFwcGVuZCh0eHQpWzBdLm91dGVySFRNTDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHh0ID0gJyc7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHh0O1xuICAgIH0sXG5cbiAgICBjcmVhdGUgOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMob3B0cy4kbGkpKTtcbiAgICAgIHZhciBidXR0b25UZXh0ID0gb3B0cy4kbGkuYXR0cih0aGlzLmFkZF9uYW1lc3BhY2UoJ2RhdGEtYnV0dG9uJykpIHx8IG9wdHMuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLXRleHQnKSksXG4gICAgICAgICAgcHJldkJ1dHRvblRleHQgPSBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1idXR0b24tcHJldicpKSB8fCBvcHRzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1wcmV2LXRleHQnKSksXG4gICAgICAgIHRpcENsYXNzID0gb3B0cy4kbGkuYXR0cignY2xhc3MnKSxcbiAgICAgICAgJHRpcF9jb250ZW50ID0gJCh0aGlzLnRpcF90ZW1wbGF0ZSh7XG4gICAgICAgICAgdGlwX2NsYXNzIDogdGlwQ2xhc3MsXG4gICAgICAgICAgaW5kZXggOiBvcHRzLmluZGV4LFxuICAgICAgICAgIGJ1dHRvbl90ZXh0IDogYnV0dG9uVGV4dCxcbiAgICAgICAgICBwcmV2X2J1dHRvbl90ZXh0IDogcHJldkJ1dHRvblRleHQsXG4gICAgICAgICAgbGkgOiBvcHRzLiRsaVxuICAgICAgICB9KSk7XG5cbiAgICAgICQodGhpcy5zZXR0aW5ncy50aXBfY29udGFpbmVyKS5hcHBlbmQoJHRpcF9jb250ZW50KTtcbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICB2YXIgJHRpbWVyID0gbnVsbDtcblxuICAgICAgLy8gYXJlIHdlIHBhdXNlZD9cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaSA9PT0gdW5kZWZpbmVkIHx8ICgkLmluQXJyYXkodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKSkge1xuXG4gICAgICAgIC8vIGRvbid0IGdvIHRvIHRoZSBuZXh0IGxpIGlmIHRoZSB0b3VyIHdhcyBwYXVzZWRcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MucGF1c2VkKSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldF9saShpbml0LCBpc19wcmV2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGggJiYgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoaW5pdCkgeyAvL3J1biB3aGVuIHdlIGZpcnN0IHN0YXJ0XG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLnByZV9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2hvd19tb2RhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MucHJlX3N0ZXBfY2FsbGJhY2sodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSwgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXApO1xuXG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwgJiYgdGhpcy5zZXR0aW5ncy5leHBvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwb3NlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnModGhpcy5zZXR0aW5ncy4kbGkpKTtcblxuICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGltZXIgPSBwYXJzZUludCh0aGlzLnNldHRpbmdzLnRpbWVyLCAxMCk7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybiA9IHRoaXMuc2V0dGluZ3MudGlwX2xvY2F0aW9uX3BhdHRlcm5zW3RoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl07XG5cbiAgICAgICAgICAvLyBzY3JvbGwgYW5kIGhpZGUgYmcgaWYgbm90IG1vZGFsXG4gICAgICAgICAgaWYgKCEvYm9keS9pLnRlc3QodGhpcy5zZXR0aW5ncy4kdGFyZ2V0LnNlbGVjdG9yKSkge1xuICAgICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCgnLmpveXJpZGUtbW9kYWwtYmcnKTtcbiAgICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcEFuaW1hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5oaWRlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVPdXQodGhpcy5zZXR0aW5ncy50aXBBbmltYXRpb25GYWRlU3BlZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zY3JvbGxfdG8oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodGhpcy5pc19waG9uZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvc19waG9uZSh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb3NfZGVmYXVsdCh0cnVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkdGltZXIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS10aW1lci1pbmRpY2F0b3InKTtcblxuICAgICAgICAgIGlmICgvcG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb24pKSB7XG5cbiAgICAgICAgICAgICR0aW1lci53aWR0aCgwKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MudGltZXIgPiAwKSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICR0aW1lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgIHdpZHRoIDogJHRpbWVyLnBhcmVudCgpLndpZHRoKClcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnNldHRpbmdzLnRpbWVyLCAnbGluZWFyJyk7XG4gICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoL2ZhZGUvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcblxuICAgICAgICAgICAgJHRpbWVyLndpZHRoKDApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy50aW1lciA+IDApIHtcblxuICAgICAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcFxuICAgICAgICAgICAgICAgIC5mYWRlSW4odGhpcy5zZXR0aW5ncy50aXBfYW5pbWF0aW9uX2ZhZGVfc3BlZWQpXG4gICAgICAgICAgICAgICAgLnNob3coKTtcblxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkdGltZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICB3aWR0aCA6ICR0aW1lci5wYXJlbnQoKS53aWR0aCgpXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5zZXR0aW5ncy50aW1lciwgJ2xpbmVhcicpO1xuICAgICAgICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZmFkZUluKHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbl9mYWRlX3NwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCA9IHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwO1xuXG4gICAgICAgIC8vIHNraXAgbm9uLWV4aXN0YW50IHRhcmdldHNcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaSAmJiB0aGlzLnNldHRpbmdzLiR0YXJnZXQubGVuZ3RoIDwgMSkge1xuXG4gICAgICAgICAgdGhpcy5zaG93KGluaXQsIGlzX3ByZXYpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmVuZCgpO1xuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXR0aW5ncy5wYXVzZWQgPSB0cnVlO1xuXG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgaXNfcGhvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXMgJiZcbiAgICAgICAgIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5tb2RhbCkge1xuICAgICAgICAkKCcuam95cmlkZS1tb2RhbC1iZycpLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gUHJldmVudCBzY3JvbGwgYm91bmNpbmcuLi53YWl0IHRvIHJlbW92ZSBmcm9tIGxheW91dFxuICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgc2V0VGltZW91dCgkLnByb3h5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIHRoaXMuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH0sIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKSwgMCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLFxuICAgICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgfSxcblxuICAgIHNldF9saSA6IGZ1bmN0aW9uIChpbml0LCBpc19wcmV2KSB7XG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRsaSA9IHRoaXMuc2V0dGluZ3MuJHRpcF9jb250ZW50LmVxKHRoaXMuc2V0dGluZ3Muc3RhcnRfb2Zmc2V0KTtcbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kY3VycmVudF90aXAgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpc19wcmV2KSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5wcmV2KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB0aGlzLnNldHRpbmdzLiRsaS5uZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRfbmV4dF90aXAoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRfdGFyZ2V0KCk7XG4gICAgfSxcblxuICAgIHNldF9uZXh0X3RpcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwID0gJCgnLmpveXJpZGUtdGlwLWd1aWRlJykuZXEodGhpcy5zZXR0aW5ncy4kbGkuaW5kZXgoKSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5kYXRhKCdjbG9zZWQnLCAnJyk7XG4gICAgfSxcblxuICAgIHNldF90YXJnZXQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2wgPSB0aGlzLnNldHRpbmdzLiRsaS5hdHRyKHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1jbGFzcycpKSxcbiAgICAgICAgICBpZCA9IHRoaXMuc2V0dGluZ3MuJGxpLmF0dHIodGhpcy5hZGRfbmFtZXNwYWNlKCdkYXRhLWlkJykpLFxuICAgICAgICAgICRzZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2wpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICQoJy4nICsgY2wpLmZpcnN0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gJCgnYm9keScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJHRhcmdldCA9ICRzZWwoKTtcbiAgICB9LFxuXG4gICAgc2Nyb2xsX3RvIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHdpbmRvd19oYWxmLCB0aXBPZmZzZXQ7XG5cbiAgICAgIHdpbmRvd19oYWxmID0gJCh3aW5kb3cpLmhlaWdodCgpIC8gMjtcbiAgICAgIHRpcE9mZnNldCA9IE1hdGguY2VpbCh0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gd2luZG93X2hhbGYgKyB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKTtcblxuICAgICAgaWYgKHRpcE9mZnNldCAhPSAwKSB7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XG4gICAgICAgICAgc2Nyb2xsVG9wIDogdGlwT2Zmc2V0XG4gICAgICAgIH0sIHRoaXMuc2V0dGluZ3Muc2Nyb2xsX3NwZWVkLCAnc3dpbmcnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcGF1c2VkIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICgkLmluQXJyYXkoKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCkgKyAxKSwgdGhpcy5zZXR0aW5ncy5wYXVzZV9hZnRlcikgPT09IC0xKTtcbiAgICB9LFxuXG4gICAgcmVzdGFydCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgdGhpcy5zZXR0aW5ncy4kbGkgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLnNob3coJ2luaXQnKTtcbiAgICB9LFxuXG4gICAgcG9zX2RlZmF1bHQgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyICRudWIgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5maW5kKCcuam95cmlkZS1udWInKSxcbiAgICAgICAgICBudWJfd2lkdGggPSBNYXRoLmNlaWwoJG51Yi5vdXRlcldpZHRoKCkgLyAyKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgIC8vIHRpcCBtdXN0IG5vdCBiZSBcImRpc3BsYXk6IG5vbmVcIiB0byBjYWxjdWxhdGUgcG9zaXRpb25cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgICB2YXIgdG9wQWRqdXN0bWVudCA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRZID8gcGFyc2VJbnQodGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MudGlwQWRqdXN0bWVudFkpIDogMCxcbiAgICAgICAgICAgICAgbGVmdEFkanVzdG1lbnQgPSB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBBZGp1c3RtZW50WCA/IHBhcnNlSW50KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcEFkanVzdG1lbnRYKSA6IDA7XG5cbiAgICAgICAgICBpZiAodGhpcy5ib3R0b20oKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyB0aGlzLnNldHRpbmdzLiR0YXJnZXQub3V0ZXJXaWR0aCgpIC0gdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJXaWR0aCgpICsgbGVmdEFkanVzdG1lbnR9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyBudWJfaGVpZ2h0ICsgdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyB0b3BBZGp1c3RtZW50KSxcbiAgICAgICAgICAgICAgICBsZWZ0IDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyBsZWZ0QWRqdXN0bWVudH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm51Yl9wb3NpdGlvbigkbnViLCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy5udWJfcG9zaXRpb24sICd0b3AnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy50b3AoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnRsKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vdXRlcldpZHRoKCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCl9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wIDogKHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpIC0gbnViX2hlaWdodCArIHRvcEFkanVzdG1lbnQpLFxuICAgICAgICAgICAgICAgIGxlZnQgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkubGVmdCArIGxlZnRBZGp1c3RtZW50fSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2JvdHRvbScpO1xuXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJpZ2h0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVyV2lkdGgoKSArIHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgbnViX3dpZHRoICsgbGVmdEFkanVzdG1lbnQpfSk7XG5cbiAgICAgICAgICAgIHRoaXMubnViX3Bvc2l0aW9uKCRudWIsIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLm51Yl9wb3NpdGlvbiwgJ2xlZnQnKTtcblxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZWZ0KCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgICAgICAgdG9wIDogdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRvcEFkanVzdG1lbnQsXG4gICAgICAgICAgICAgIGxlZnQgOiAodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLmxlZnQgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlcldpZHRoKCkgLSBudWJfd2lkdGggKyBsZWZ0QWRqdXN0bWVudCl9KTtcblxuICAgICAgICAgICAgdGhpcy5udWJfcG9zaXRpb24oJG51YiwgdGhpcy5zZXR0aW5ncy50aXBfc2V0dGluZ3MubnViX3Bvc2l0aW9uLCAncmlnaHQnKTtcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKHRoaXMuY29ybmVycyh0aGlzLnNldHRpbmdzLiRuZXh0X3RpcCkpICYmIHRoaXMuc2V0dGluZ3MuYXR0ZW1wdHMgPCB0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb25fcGF0dGVybi5sZW5ndGgpIHtcblxuICAgICAgICAgICAgJG51Yi5yZW1vdmVDbGFzcygnYm90dG9tJylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0b3AnKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3JpZ2h0JylcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdsZWZ0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbiA9IHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbl9wYXR0ZXJuW3RoaXMuc2V0dGluZ3MuYXR0ZW1wdHNdO1xuXG4gICAgICAgICAgICB0aGlzLnNldHRpbmdzLmF0dGVtcHRzKys7XG5cbiAgICAgICAgICAgIHRoaXMucG9zX2RlZmF1bHQoKTtcblxuICAgICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcblxuICAgICAgICB0aGlzLnBvc19tb2RhbCgkbnViKTtcblxuICAgICAgfVxuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmhpZGUoKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBwb3NfcGhvbmUgOiBmdW5jdGlvbiAoaW5pdCkge1xuICAgICAgdmFyIHRpcF9oZWlnaHQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgIHRpcF9vZmZzZXQgPSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoKSxcbiAgICAgICAgICB0YXJnZXRfaGVpZ2h0ID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgJG51YiA9ICQoJy5qb3lyaWRlLW51YicsIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwKSxcbiAgICAgICAgICBudWJfaGVpZ2h0ID0gTWF0aC5jZWlsKCRudWIub3V0ZXJIZWlnaHQoKSAvIDIpLFxuICAgICAgICAgIHRvZ2dsZSA9IGluaXQgfHwgZmFsc2U7XG5cbiAgICAgICRudWIucmVtb3ZlQ2xhc3MoJ2JvdHRvbScpXG4gICAgICAgIC5yZW1vdmVDbGFzcygndG9wJylcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdyaWdodCcpXG4gICAgICAgIC5yZW1vdmVDbGFzcygnbGVmdCcpO1xuXG4gICAgICBpZiAodG9nZ2xlKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMudG9wKCkpIHtcblxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub2Zmc2V0KHt0b3AgOiB0aGlzLnNldHRpbmdzLiR0YXJnZXQub2Zmc2V0KCkudG9wIC0gdGlwX2hlaWdodCAtIG51Yl9oZWlnaHR9KTtcbiAgICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ2JvdHRvbScpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vZmZzZXQoe3RvcCA6IHRoaXMuc2V0dGluZ3MuJHRhcmdldC5vZmZzZXQoKS50b3AgKyB0YXJnZXRfaGVpZ2h0ICsgbnViX2hlaWdodH0pO1xuICAgICAgICAgICRudWIuYWRkQ2xhc3MoJ3RvcCcpO1xuXG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiRsaS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5wb3NfbW9kYWwoJG51Yik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2dnbGUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuaGlkZSgpO1xuICAgICAgICB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBwb3NfbW9kYWwgOiBmdW5jdGlvbiAoJG51Yikge1xuICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICRudWIuaGlkZSgpO1xuXG4gICAgICB0aGlzLnNob3dfbW9kYWwoKTtcbiAgICB9LFxuXG4gICAgc2hvd19tb2RhbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuZGF0YSgnY2xvc2VkJykpIHtcbiAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gICQoJy5qb3lyaWRlLW1vZGFsLWJnJyk7XG4gICAgICAgIGlmIChqb3lyaWRlbW9kYWxiZy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdmFyIGpveXJpZGVtb2RhbGJnID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLm1vZGFsKTtcbiAgICAgICAgICBqb3lyaWRlbW9kYWxiZy5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKC9wb3AvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX2FuaW1hdGlvbikpIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGpveXJpZGVtb2RhbGJnLmZhZGVJbih0aGlzLnNldHRpbmdzLnRpcF9hbmltYXRpb25fZmFkZV9zcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZSxcbiAgICAgICAgICBleHBvc2VDb3ZlcixcbiAgICAgICAgICBlbCxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIHJhbmRJZCA9ICdleHBvc2UtJyArIHRoaXMucmFuZG9tX3N0cig2KTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgZWwgPSBhcmd1bWVudHNbMF07XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuJHRhcmdldCAmJiAhL2JvZHkvaS50ZXN0KHRoaXMuc2V0dGluZ3MuJHRhcmdldC5zZWxlY3RvcikpIHtcbiAgICAgICAgZWwgPSB0aGlzLnNldHRpbmdzLiR0YXJnZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbC5sZW5ndGggPCAxKSB7XG4gICAgICAgIGlmICh3aW5kb3cuY29uc29sZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2VsZW1lbnQgbm90IHZhbGlkJywgZWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZXhwb3NlID0gJCh0aGlzLnNldHRpbmdzLnRlbXBsYXRlLmV4cG9zZSk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRib2R5LmFwcGVuZChleHBvc2UpO1xuICAgICAgZXhwb3NlLmNzcyh7XG4gICAgICAgIHRvcCA6IGVsLm9mZnNldCgpLnRvcCxcbiAgICAgICAgbGVmdCA6IGVsLm9mZnNldCgpLmxlZnQsXG4gICAgICAgIHdpZHRoIDogZWwub3V0ZXJXaWR0aCh0cnVlKSxcbiAgICAgICAgaGVpZ2h0IDogZWwub3V0ZXJIZWlnaHQodHJ1ZSlcbiAgICAgIH0pO1xuXG4gICAgICBleHBvc2VDb3ZlciA9ICQodGhpcy5zZXR0aW5ncy50ZW1wbGF0ZS5leHBvc2VfY292ZXIpO1xuXG4gICAgICBvcmlnQ1NTID0ge1xuICAgICAgICB6SW5kZXggOiBlbC5jc3MoJ3otaW5kZXgnKSxcbiAgICAgICAgcG9zaXRpb24gOiBlbC5jc3MoJ3Bvc2l0aW9uJylcbiAgICAgIH07XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuYXR0cignY2xhc3MnKSA9PSBudWxsID8gJycgOiBlbC5hdHRyKCdjbGFzcycpO1xuXG4gICAgICBlbC5jc3MoJ3otaW5kZXgnLCBwYXJzZUludChleHBvc2UuY3NzKCd6LWluZGV4JykpICsgMSk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnBvc2l0aW9uID09ICdzdGF0aWMnKSB7XG4gICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgIH1cblxuICAgICAgZWwuZGF0YSgnZXhwb3NlLWNzcycsIG9yaWdDU1MpO1xuICAgICAgZWwuZGF0YSgnb3JpZy1jbGFzcycsIG9yaWdDbGFzc2VzKTtcbiAgICAgIGVsLmF0dHIoJ2NsYXNzJywgb3JpZ0NsYXNzZXMgKyAnICcgKyB0aGlzLnNldHRpbmdzLmV4cG9zZV9hZGRfY2xhc3MpO1xuXG4gICAgICBleHBvc2VDb3Zlci5jc3Moe1xuICAgICAgICB0b3AgOiBlbC5vZmZzZXQoKS50b3AsXG4gICAgICAgIGxlZnQgOiBlbC5vZmZzZXQoKS5sZWZ0LFxuICAgICAgICB3aWR0aCA6IGVsLm91dGVyV2lkdGgodHJ1ZSksXG4gICAgICAgIGhlaWdodCA6IGVsLm91dGVySGVpZ2h0KHRydWUpXG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubW9kYWwpIHtcbiAgICAgICAgdGhpcy5zaG93X21vZGFsKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJGJvZHkuYXBwZW5kKGV4cG9zZUNvdmVyKTtcbiAgICAgIGV4cG9zZS5hZGRDbGFzcyhyYW5kSWQpO1xuICAgICAgZXhwb3NlQ292ZXIuYWRkQ2xhc3MocmFuZElkKTtcbiAgICAgIGVsLmRhdGEoJ2V4cG9zZScsIHJhbmRJZCk7XG4gICAgICB0aGlzLnNldHRpbmdzLnBvc3RfZXhwb3NlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLCBlbCk7XG4gICAgICB0aGlzLmFkZF9leHBvc2VkKGVsKTtcbiAgICB9LFxuXG4gICAgdW5fZXhwb3NlIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV4cG9zZUlkLFxuICAgICAgICAgIGVsLFxuICAgICAgICAgIGV4cG9zZSxcbiAgICAgICAgICBvcmlnQ1NTLFxuICAgICAgICAgIG9yaWdDbGFzc2VzLFxuICAgICAgICAgIGNsZWFyQWxsID0gZmFsc2U7XG5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gaW5zdGFuY2VvZiAkKSB7XG4gICAgICAgIGVsID0gYXJndW1lbnRzWzBdO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLiR0YXJnZXQgJiYgIS9ib2R5L2kudGVzdCh0aGlzLnNldHRpbmdzLiR0YXJnZXQuc2VsZWN0b3IpKSB7XG4gICAgICAgIGVsID0gdGhpcy5zZXR0aW5ncy4kdGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwubGVuZ3RoIDwgMSkge1xuICAgICAgICBpZiAod2luZG93LmNvbnNvbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdlbGVtZW50IG5vdCB2YWxpZCcsIGVsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGV4cG9zZUlkID0gZWwuZGF0YSgnZXhwb3NlJyk7XG4gICAgICBleHBvc2UgPSAkKCcuJyArIGV4cG9zZUlkKTtcblxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNsZWFyQWxsID0gYXJndW1lbnRzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2xlYXJBbGwgPT09IHRydWUpIHtcbiAgICAgICAgJCgnLmpveXJpZGUtZXhwb3NlLXdyYXBwZXIsLmpveXJpZGUtZXhwb3NlLWNvdmVyJykucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBvc2UucmVtb3ZlKCk7XG4gICAgICB9XG5cbiAgICAgIG9yaWdDU1MgPSBlbC5kYXRhKCdleHBvc2UtY3NzJyk7XG5cbiAgICAgIGlmIChvcmlnQ1NTLnpJbmRleCA9PSAnYXV0bycpIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4JywgJycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwuY3NzKCd6LWluZGV4Jywgb3JpZ0NTUy56SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3JpZ0NTUy5wb3NpdGlvbiAhPSBlbC5jc3MoJ3Bvc2l0aW9uJykpIHtcbiAgICAgICAgaWYgKG9yaWdDU1MucG9zaXRpb24gPT0gJ3N0YXRpYycpIHsvLyB0aGlzIGlzIGRlZmF1bHQsIG5vIG5lZWQgdG8gc2V0IGl0LlxuICAgICAgICAgIGVsLmNzcygncG9zaXRpb24nLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwuY3NzKCdwb3NpdGlvbicsIG9yaWdDU1MucG9zaXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9yaWdDbGFzc2VzID0gZWwuZGF0YSgnb3JpZy1jbGFzcycpO1xuICAgICAgZWwuYXR0cignY2xhc3MnLCBvcmlnQ2xhc3Nlcyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdvcmlnLWNsYXNzZXMnKTtcblxuICAgICAgZWwucmVtb3ZlRGF0YSgnZXhwb3NlJyk7XG4gICAgICBlbC5yZW1vdmVEYXRhKCdleHBvc2Utei1pbmRleCcpO1xuICAgICAgdGhpcy5yZW1vdmVfZXhwb3NlZChlbCk7XG4gICAgfSxcblxuICAgIGFkZF9leHBvc2VkIDogZnVuY3Rpb24gKGVsKSB7XG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpZiAoZWwgaW5zdGFuY2VvZiAkIHx8IHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWxbMF0pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZWwgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5leHBvc2VkLnB1c2goZWwpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICByZW1vdmVfZXhwb3NlZCA6IGZ1bmN0aW9uIChlbCkge1xuICAgICAgdmFyIHNlYXJjaCwgaTtcbiAgICAgIGlmIChlbCBpbnN0YW5jZW9mICQpIHtcbiAgICAgICAgc2VhcmNoID0gZWxbMF1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsID09ICdzdHJpbmcnKSB7XG4gICAgICAgIHNlYXJjaCA9IGVsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNldHRpbmdzLmV4cG9zZWQgPSB0aGlzLnNldHRpbmdzLmV4cG9zZWQgfHwgW107XG4gICAgICBpID0gdGhpcy5zZXR0aW5ncy5leHBvc2VkLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5leHBvc2VkW2ldID09IHNlYXJjaCkge1xuICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZXhwb3NlZC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNlbnRlciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdyA9ICQod2luZG93KTtcblxuICAgICAgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAuY3NzKHtcbiAgICAgICAgdG9wIDogKCgoJHcuaGVpZ2h0KCkgLSB0aGlzLnNldHRpbmdzLiRuZXh0X3RpcC5vdXRlckhlaWdodCgpKSAvIDIpICsgJHcuc2Nyb2xsVG9wKCkpLFxuICAgICAgICBsZWZ0IDogKCgoJHcud2lkdGgoKSAtIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLm91dGVyV2lkdGgoKSkgLyAyKSArICR3LnNjcm9sbExlZnQoKSlcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgYm90dG9tIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIC9ib3R0b20vaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIHRvcCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvdG9wL2kudGVzdCh0aGlzLnNldHRpbmdzLnRpcF9zZXR0aW5ncy50aXBfbG9jYXRpb24pO1xuICAgIH0sXG5cbiAgICByaWdodCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAvcmlnaHQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGxlZnQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gL2xlZnQvaS50ZXN0KHRoaXMuc2V0dGluZ3MudGlwX3NldHRpbmdzLnRpcF9sb2NhdGlvbik7XG4gICAgfSxcblxuICAgIGNvcm5lcnMgOiBmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHZhciB3ID0gJCh3aW5kb3cpLFxuICAgICAgICAgIHdpbmRvd19oYWxmID0gdy5oZWlnaHQoKSAvIDIsXG4gICAgICAgICAgLy91c2luZyB0aGlzIHRvIGNhbGN1bGF0ZSBzaW5jZSBzY3JvbGwgbWF5IG5vdCBoYXZlIGZpbmlzaGVkIHlldC5cbiAgICAgICAgICB0aXBPZmZzZXQgPSBNYXRoLmNlaWwodGhpcy5zZXR0aW5ncy4kdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIHdpbmRvd19oYWxmICsgdGhpcy5zZXR0aW5ncy4kbmV4dF90aXAub3V0ZXJIZWlnaHQoKSksXG4gICAgICAgICAgcmlnaHQgPSB3LndpZHRoKCkgKyB3LnNjcm9sbExlZnQoKSxcbiAgICAgICAgICBvZmZzZXRCb3R0b20gPSAgdy5oZWlnaHQoKSArIHRpcE9mZnNldCxcbiAgICAgICAgICBib3R0b20gPSB3LmhlaWdodCgpICsgdy5zY3JvbGxUb3AoKSxcbiAgICAgICAgICB0b3AgPSB3LnNjcm9sbFRvcCgpO1xuXG4gICAgICBpZiAodGlwT2Zmc2V0IDwgdG9wKSB7XG4gICAgICAgIGlmICh0aXBPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgdG9wID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0b3AgPSB0aXBPZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9mZnNldEJvdHRvbSA+IGJvdHRvbSkge1xuICAgICAgICBib3R0b20gPSBvZmZzZXRCb3R0b207XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIGVsLm9mZnNldCgpLnRvcCA8IHRvcCxcbiAgICAgICAgcmlnaHQgPCBlbC5vZmZzZXQoKS5sZWZ0ICsgZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICBib3R0b20gPCBlbC5vZmZzZXQoKS50b3AgKyBlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICB3LnNjcm9sbExlZnQoKSA+IGVsLm9mZnNldCgpLmxlZnRcbiAgICAgIF07XG4gICAgfSxcblxuICAgIHZpc2libGUgOiBmdW5jdGlvbiAoaGlkZGVuX2Nvcm5lcnMpIHtcbiAgICAgIHZhciBpID0gaGlkZGVuX2Nvcm5lcnMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGlmIChoaWRkZW5fY29ybmVyc1tpXSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgbnViX3Bvc2l0aW9uIDogZnVuY3Rpb24gKG51YiwgcG9zLCBkZWYpIHtcbiAgICAgIGlmIChwb3MgPT09ICdhdXRvJykge1xuICAgICAgICBudWIuYWRkQ2xhc3MoZGVmKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG51Yi5hZGRDbGFzcyhwb3MpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydFRpbWVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuJGxpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmF1dG9tYXRlID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgdGhpcy5zdGFydFRpbWVyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5zZXR0aW5ncy50aW1lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGVuZCA6IGZ1bmN0aW9uIChhYm9ydCkge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuY29va2llX21vbnN0ZXIpIHtcbiAgICAgICAgJC5jb29raWUodGhpcy5zZXR0aW5ncy5jb29raWVfbmFtZSwgJ3JpZGRlbicsIHtleHBpcmVzIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZXhwaXJlcywgZG9tYWluIDogdGhpcy5zZXR0aW5ncy5jb29raWVfZG9tYWlufSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLnRpbWVyID4gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zZXR0aW5ncy5hdXRvbWF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1vZGFsICYmIHRoaXMuc2V0dGluZ3MuZXhwb3NlKSB7XG4gICAgICAgIHRoaXMudW5fZXhwb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFVucGx1ZyBrZXlzdHJva2VzIGxpc3RlbmVyXG4gICAgICAkKHRoaXMuc2NvcGUpLm9mZigna2V5dXAuam95cmlkZScpXG5cbiAgICAgIHRoaXMuc2V0dGluZ3MuJG5leHRfdGlwLmRhdGEoJ2Nsb3NlZCcsIHRydWUpO1xuICAgICAgdGhpcy5zZXR0aW5ncy5yaWRpbmcgPSBmYWxzZTtcblxuICAgICAgJCgnLmpveXJpZGUtbW9kYWwtYmcnKS5oaWRlKCk7XG4gICAgICB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcC5oaWRlKCk7XG5cbiAgICAgIGlmICh0eXBlb2YgYWJvcnQgPT09ICd1bmRlZmluZWQnIHx8IGFib3J0ID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLnBvc3Rfc3RlcF9jYWxsYmFjayh0aGlzLnNldHRpbmdzLiRsaS5pbmRleCgpLCB0aGlzLnNldHRpbmdzLiRjdXJyZW50X3RpcCk7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MucG9zdF9yaWRlX2NhbGxiYWNrKHRoaXMuc2V0dGluZ3MuJGxpLmluZGV4KCksIHRoaXMuc2V0dGluZ3MuJGN1cnJlbnRfdGlwKTtcbiAgICAgIH1cblxuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlJykucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcy5zY29wZSkub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCh3aW5kb3cpLm9mZignLmpveXJpZGUnKTtcbiAgICAgICQoJy5qb3lyaWRlLWNsb3NlLXRpcCwgLmpveXJpZGUtbmV4dC10aXAsIC5qb3lyaWRlLW1vZGFsLWJnJykub2ZmKCcuam95cmlkZScpO1xuICAgICAgJCgnLmpveXJpZGUtdGlwLWd1aWRlLCAuam95cmlkZS1tb2RhbC1iZycpLnJlbW92ZSgpO1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2V0dGluZ3MuYXV0b21hdGUpO1xuICAgICAgdGhpcy5zZXR0aW5ncyA9IHt9O1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzWydtYWdlbGxhbi1leHBlZGl0aW9uJ10gPSB7XG4gICAgbmFtZSA6ICdtYWdlbGxhbi1leHBlZGl0aW9uJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIHRocmVzaG9sZCA6IDAsIC8vIHBpeGVscyBmcm9tIHRoZSB0b3Agb2YgdGhlIGV4cGVkaXRpb24gZm9yIGl0IHRvIGJlY29tZSBmaXhlc1xuICAgICAgZGVzdGluYXRpb25fdGhyZXNob2xkIDogMjAsIC8vIHBpeGVscyBmcm9tIHRoZSB0b3Agb2YgZGVzdGluYXRpb24gZm9yIGl0IHRvIGJlIGNvbnNpZGVyZWQgYWN0aXZlXG4gICAgICB0aHJvdHRsZV9kZWxheSA6IDMwLCAvLyBjYWxjdWxhdGlvbiB0aHJvdHRsaW5nIHRvIGluY3JlYXNlIGZyYW1lcmF0ZVxuICAgICAgZml4ZWRfdG9wIDogMCwgLy8gdG9wIGRpc3RhbmNlIGluIHBpeGVscyBhc3NpZ2VuZCB0byB0aGUgZml4ZWQgZWxlbWVudCBvbiBzY3JvbGxcbiAgICAgIG9mZnNldF9ieV9oZWlnaHQgOiB0cnVlLCAgLy8gd2hldGhlciB0byBvZmZzZXQgdGhlIGRlc3RpbmF0aW9uIGJ5IHRoZSBleHBlZGl0aW9uIGhlaWdodC4gVXN1YWxseSB5b3Ugd2FudCB0aGlzIHRvIGJlIHRydWUsIHVubGVzcyB5b3VyIGV4cGVkaXRpb24gaXMgb24gdGhlIHNpZGUuXG4gICAgICBkdXJhdGlvbiA6IDcwMCwgLy8gYW5pbWF0aW9uIGR1cmF0aW9uIHRpbWVcbiAgICAgIGVhc2luZyA6ICdzd2luZycgLy8gYW5pbWF0aW9uIGVhc2luZ1xuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUnKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlMsXG4gICAgICAgICAgc2V0dGluZ3MgPSBzZWxmLnNldHRpbmdzO1xuXG4gICAgICAvLyBpbml0aWFsaXplIGV4cGVkaXRpb24gb2Zmc2V0XG4gICAgICBzZWxmLnNldF9leHBlZGl0aW9uX3Bvc2l0aW9uKCk7XG5cbiAgICAgIFMoc2VsZi5zY29wZSlcbiAgICAgICAgLm9mZignLm1hZ2VsbGFuJylcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5tYWdlbGxhbicsICdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1hcnJpdmFsJykgKyAnXSBhW2hyZWYqPSNdJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgc2FtZUhvc3QgPSAoKHRoaXMuaG9zdG5hbWUgPT09IGxvY2F0aW9uLmhvc3RuYW1lKSB8fCAhdGhpcy5ob3N0bmFtZSksXG4gICAgICAgICAgICAgIHNhbWVQYXRoID0gc2VsZi5maWx0ZXJQYXRobmFtZShsb2NhdGlvbi5wYXRobmFtZSkgPT09IHNlbGYuZmlsdGVyUGF0aG5hbWUodGhpcy5wYXRobmFtZSksXG4gICAgICAgICAgICAgIHRlc3RIYXNoID0gdGhpcy5oYXNoLnJlcGxhY2UoLyg6fFxcLnxcXC8pL2csICdcXFxcJDEnKSxcbiAgICAgICAgICAgICAgYW5jaG9yID0gdGhpcztcblxuICAgICAgICAgIGlmIChzYW1lSG9zdCAmJiBzYW1lUGF0aCAmJiB0ZXN0SGFzaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIGV4cGVkaXRpb24gPSAkKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBleHBlZGl0aW9uLmRhdGEoJ21hZ2VsbGFuLWV4cGVkaXRpb24taW5pdCcpLFxuICAgICAgICAgICAgICAgIGhhc2ggPSB0aGlzLmhhc2guc3BsaXQoJyMnKS5qb2luKCcnKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSAkKCdhW25hbWU9XCInICsgaGFzaCArICdcIl0nKTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgdGFyZ2V0ID0gJCgnIycgKyBoYXNoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBY2NvdW50IGZvciBleHBlZGl0aW9uIGhlaWdodCBpZiBmaXhlZCBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIHNjcm9sbF90b3AgPSB0YXJnZXQub2Zmc2V0KCkudG9wIC0gc2V0dGluZ3MuZGVzdGluYXRpb25fdGhyZXNob2xkICsgMTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5vZmZzZXRfYnlfaGVpZ2h0KSB7XG4gICAgICAgICAgICAgIHNjcm9sbF90b3AgPSBzY3JvbGxfdG9wIC0gZXhwZWRpdGlvbi5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgJ3Njcm9sbFRvcCcgOiBzY3JvbGxfdG9wXG4gICAgICAgICAgICB9LCBzZXR0aW5ncy5kdXJhdGlvbiwgc2V0dGluZ3MuZWFzaW5nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmIChoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgYW5jaG9yLnBhdGhuYW1lICsgJyMnICsgaGFzaCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5oYXNoID0gYW5jaG9yLnBhdGhuYW1lICsgJyMnICsgaGFzaDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ3Njcm9sbC5mbmR0bi5tYWdlbGxhbicsIHNlbGYudGhyb3R0bGUodGhpcy5jaGVja19mb3JfYXJyaXZhbHMuYmluZCh0aGlzKSwgc2V0dGluZ3MudGhyb3R0bGVfZGVsYXkpKTtcbiAgICB9LFxuXG4gICAgY2hlY2tfZm9yX2Fycml2YWxzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgc2VsZi51cGRhdGVfYXJyaXZhbHMoKTtcbiAgICAgIHNlbGYudXBkYXRlX2V4cGVkaXRpb25fcG9zaXRpb25zKCk7XG4gICAgfSxcblxuICAgIHNldF9leHBlZGl0aW9uX3Bvc2l0aW9uIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgJCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJz1maXhlZF0nLCBzZWxmLnNjb3BlKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgIHZhciBleHBlZGl0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1leHBlZGl0aW9uLWluaXQnKSxcbiAgICAgICAgICAgIHN0eWxlcyA9IGV4cGVkaXRpb24uYXR0cignc3R5bGVzJyksIC8vIHNhdmUgc3R5bGVzXG4gICAgICAgICAgICB0b3Bfb2Zmc2V0LCBmaXhlZF90b3A7XG5cbiAgICAgICAgZXhwZWRpdGlvbi5hdHRyKCdzdHlsZScsICcnKTtcbiAgICAgICAgdG9wX29mZnNldCA9IGV4cGVkaXRpb24ub2Zmc2V0KCkudG9wICsgc2V0dGluZ3MudGhyZXNob2xkO1xuXG4gICAgICAgIC8vc2V0IGZpeGVkLXRvcCBieSBhdHRyaWJ1dGVcbiAgICAgICAgZml4ZWRfdG9wID0gcGFyc2VJbnQoZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1maXhlZC10b3AnKSk7XG4gICAgICAgIGlmICghaXNOYU4oZml4ZWRfdG9wKSkge1xuICAgICAgICAgIHNlbGYuc2V0dGluZ3MuZml4ZWRfdG9wID0gZml4ZWRfdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgZXhwZWRpdGlvbi5kYXRhKHNlbGYuZGF0YV9hdHRyKCdtYWdlbGxhbi10b3Atb2Zmc2V0JyksIHRvcF9vZmZzZXQpO1xuICAgICAgICBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlJywgc3R5bGVzKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB1cGRhdGVfZXhwZWRpdGlvbl9wb3NpdGlvbnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgd2luZG93X3RvcF9vZmZzZXQgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgICQoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICc9Zml4ZWRdJywgc2VsZi5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBleHBlZGl0aW9uID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKCdtYWdlbGxhbi1leHBlZGl0aW9uLWluaXQnKSxcbiAgICAgICAgICAgIHN0eWxlcyA9IGV4cGVkaXRpb24uYXR0cignc3R5bGUnKSwgLy8gc2F2ZSBzdHlsZXNcbiAgICAgICAgICAgIHRvcF9vZmZzZXQgPSBleHBlZGl0aW9uLmRhdGEoJ21hZ2VsbGFuLXRvcC1vZmZzZXQnKTtcblxuICAgICAgICAvL3Njcm9sbCB0byB0aGUgdG9wIGRpc3RhbmNlXG4gICAgICAgIGlmICh3aW5kb3dfdG9wX29mZnNldCArIHNlbGYuc2V0dGluZ3MuZml4ZWRfdG9wID49IHRvcF9vZmZzZXQpIHtcbiAgICAgICAgICAvLyBQbGFjZWhvbGRlciBhbGxvd3MgaGVpZ2h0IGNhbGN1bGF0aW9ucyB0byBiZSBjb25zaXN0ZW50IGV2ZW4gd2hlblxuICAgICAgICAgIC8vIGFwcGVhcmluZyB0byBzd2l0Y2ggYmV0d2VlbiBmaXhlZC9ub24tZml4ZWQgcGxhY2VtZW50XG4gICAgICAgICAgdmFyIHBsYWNlaG9sZGVyID0gZXhwZWRpdGlvbi5wcmV2KCdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1leHBlZGl0aW9uLWNsb25lJykgKyAnXScpO1xuICAgICAgICAgIGlmIChwbGFjZWhvbGRlci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyID0gZXhwZWRpdGlvbi5jbG9uZSgpO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXIucmVtb3ZlQXR0cihzZWxmLmF0dHJfbmFtZSgpKTtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLmF0dHIoc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWV4cGVkaXRpb24tY2xvbmUnKSwgJycpO1xuICAgICAgICAgICAgZXhwZWRpdGlvbi5iZWZvcmUocGxhY2Vob2xkZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBleHBlZGl0aW9uLmNzcyh7cG9zaXRpb24gOidmaXhlZCcsIHRvcCA6IHNldHRpbmdzLmZpeGVkX3RvcH0pLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVkaXRpb24ucHJldignWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tZXhwZWRpdGlvbi1jbG9uZScpICsgJ10nKS5yZW1vdmUoKTtcbiAgICAgICAgICBleHBlZGl0aW9uLmF0dHIoJ3N0eWxlJywgc3R5bGVzKS5jc3MoJ3Bvc2l0aW9uJywgJycpLmNzcygndG9wJywgJycpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgdXBkYXRlX2Fycml2YWxzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHdpbmRvd190b3Bfb2Zmc2V0ID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgICAkKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHNlbGYuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXhwZWRpdGlvbiA9ICQodGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGV4cGVkaXRpb24uZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgb2Zmc2V0cyA9IHNlbGYub2Zmc2V0cyhleHBlZGl0aW9uLCB3aW5kb3dfdG9wX29mZnNldCksXG4gICAgICAgICAgICBhcnJpdmFscyA9IGV4cGVkaXRpb24uZmluZCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10nKSxcbiAgICAgICAgICAgIGFjdGl2ZV9pdGVtID0gZmFsc2U7XG4gICAgICAgIG9mZnNldHMuZWFjaChmdW5jdGlvbiAoaWR4LCBpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0udmlld3BvcnRfb2Zmc2V0ID49IGl0ZW0udG9wX29mZnNldCkge1xuICAgICAgICAgICAgdmFyIGFycml2YWxzID0gZXhwZWRpdGlvbi5maW5kKCdbJyArIHNlbGYuYWRkX25hbWVzcGFjZSgnZGF0YS1tYWdlbGxhbi1hcnJpdmFsJykgKyAnXScpO1xuICAgICAgICAgICAgYXJyaXZhbHMubm90KGl0ZW0uYXJyaXZhbCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgICAgIGl0ZW0uYXJyaXZhbC5hZGRDbGFzcyhzZXR0aW5ncy5hY3RpdmVfY2xhc3MpO1xuICAgICAgICAgICAgYWN0aXZlX2l0ZW0gPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWFjdGl2ZV9pdGVtKSB7XG4gICAgICAgICAgYXJyaXZhbHMucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIG9mZnNldHMgOiBmdW5jdGlvbiAoZXhwZWRpdGlvbiwgd2luZG93X29mZnNldCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIHNldHRpbmdzID0gZXhwZWRpdGlvbi5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgdmlld3BvcnRfb2Zmc2V0ID0gd2luZG93X29mZnNldDtcblxuICAgICAgcmV0dXJuIGV4cGVkaXRpb24uZmluZCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tYXJyaXZhbCcpICsgJ10nKS5tYXAoZnVuY3Rpb24gKGlkeCwgZWwpIHtcbiAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmRhdGEoc2VsZi5kYXRhX2F0dHIoJ21hZ2VsbGFuLWFycml2YWwnKSksXG4gICAgICAgICAgICBkZXN0ID0gJCgnWycgKyBzZWxmLmFkZF9uYW1lc3BhY2UoJ2RhdGEtbWFnZWxsYW4tZGVzdGluYXRpb24nKSArICc9JyArIG5hbWUgKyAnXScpO1xuICAgICAgICBpZiAoZGVzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIHRvcF9vZmZzZXQgPSBkZXN0Lm9mZnNldCgpLnRvcCAtIHNldHRpbmdzLmRlc3RpbmF0aW9uX3RocmVzaG9sZDtcbiAgICAgICAgICBpZiAoc2V0dGluZ3Mub2Zmc2V0X2J5X2hlaWdodCkge1xuICAgICAgICAgICAgdG9wX29mZnNldCA9IHRvcF9vZmZzZXQgLSBleHBlZGl0aW9uLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvcF9vZmZzZXQgPSBNYXRoLmZsb29yKHRvcF9vZmZzZXQpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbiA6IGRlc3QsXG4gICAgICAgICAgICBhcnJpdmFsIDogJCh0aGlzKSxcbiAgICAgICAgICAgIHRvcF9vZmZzZXQgOiB0b3Bfb2Zmc2V0LFxuICAgICAgICAgICAgdmlld3BvcnRfb2Zmc2V0IDogdmlld3BvcnRfb2Zmc2V0XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmIChhLnRvcF9vZmZzZXQgPCBiLnRvcF9vZmZzZXQpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGEudG9wX29mZnNldCA+IGIudG9wX29mZnNldCkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRhdGFfYXR0ciA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgb2ZmIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5TKHRoaXMuc2NvcGUpLm9mZignLm1hZ2VsbGFuJyk7XG4gICAgICB0aGlzLlMod2luZG93KS5vZmYoJy5tYWdlbGxhbicpO1xuICAgIH0sXG5cbiAgICBmaWx0ZXJQYXRobmFtZSA6IGZ1bmN0aW9uIChwYXRobmFtZSkge1xuICAgICAgcGF0aG5hbWUgPSBwYXRobmFtZSB8fCAnJztcbiAgICAgIHJldHVybiBwYXRobmFtZVxuICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywnJylcbiAgICAgICAgICAucmVwbGFjZSgvKD86aW5kZXh8ZGVmYXVsdCkuW2EtekEtWl17Myw0fSQvLCcnKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywnJyk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIC8vIHJlbW92ZSBwbGFjZWhvbGRlciBleHBlZGl0aW9ucyB1c2VkIGZvciBoZWlnaHQgY2FsY3VsYXRpb24gcHVycG9zZXNcbiAgICAgICQoJ1snICsgc2VsZi5hZGRfbmFtZXNwYWNlKCdkYXRhLW1hZ2VsbGFuLWV4cGVkaXRpb24tY2xvbmUnKSArICddJywgc2VsZi5zY29wZSkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLm9mZmNhbnZhcyA9IHtcbiAgICBuYW1lIDogJ29mZmNhbnZhcycsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgb3Blbl9tZXRob2QgOiAnbW92ZScsXG4gICAgICBjbG9zZV9vbl9jbGljayA6IGZhbHNlXG4gICAgfSxcblxuICAgIGluaXQgOiBmdW5jdGlvbiAoc2NvcGUsIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHNlbGYuUyxcbiAgICAgICAgICBtb3ZlX2NsYXNzID0gJycsXG4gICAgICAgICAgcmlnaHRfcG9zdGZpeCA9ICcnLFxuICAgICAgICAgIGxlZnRfcG9zdGZpeCA9ICcnO1xuXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5vcGVuX21ldGhvZCA9PT0gJ21vdmUnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnbW92ZS0nO1xuICAgICAgICByaWdodF9wb3N0Zml4ID0gJ3JpZ2h0JztcbiAgICAgICAgbGVmdF9wb3N0Zml4ID0gJ2xlZnQnO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLm9wZW5fbWV0aG9kID09PSAnb3ZlcmxhcF9zaW5nbGUnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnb2ZmY2FudmFzLW92ZXJsYXAtJztcbiAgICAgICAgcmlnaHRfcG9zdGZpeCA9ICdyaWdodCc7XG4gICAgICAgIGxlZnRfcG9zdGZpeCA9ICdsZWZ0JztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5vcGVuX21ldGhvZCA9PT0gJ292ZXJsYXAnKSB7XG4gICAgICAgIG1vdmVfY2xhc3MgPSAnb2ZmY2FudmFzLW92ZXJsYXAnO1xuICAgICAgfVxuXG4gICAgICBTKHRoaXMuc2NvcGUpLm9mZignLm9mZmNhbnZhcycpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4ub2ZmY2FudmFzJywgJy5sZWZ0LW9mZi1jYW52YXMtdG9nZ2xlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmNsaWNrX3RvZ2dsZV9jbGFzcyhlLCBtb3ZlX2NsYXNzICsgcmlnaHRfcG9zdGZpeCk7XG4gICAgICAgICAgaWYgKHNlbGYuc2V0dGluZ3Mub3Blbl9tZXRob2QgIT09ICdvdmVybGFwJykge1xuICAgICAgICAgICAgUygnLmxlZnQtc3VibWVudScpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJCgnLmxlZnQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmxlZnQtb2ZmLWNhbnZhcy1tZW51IGEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHNlbGYuZ2V0X3NldHRpbmdzKGUpO1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBTKHRoaXMpLnBhcmVudCgpO1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2NsaWNrICYmICFwYXJlbnQuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykgJiYgIXBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBzZWxmLmhpZGUuY2FsbChzZWxmLCBtb3ZlX2NsYXNzICsgcmlnaHRfcG9zdGZpeCwgc2VsZi5nZXRfd3JhcHBlcihlKSk7XG4gICAgICAgICAgICBwYXJlbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoUyh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcygnaGFzLXN1Ym1lbnUnKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgUyh0aGlzKS5zaWJsaW5ncygnLmxlZnQtc3VibWVudScpLnRvZ2dsZUNsYXNzKG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBwYXJlbnQucGFyZW50KCkucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcubGVmdC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLm9mZmNhbnZhcycsICcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHNlbGYuY2xpY2tfdG9nZ2xlX2NsYXNzKGUsIG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIGlmIChzZWxmLnNldHRpbmdzLm9wZW5fbWV0aG9kICE9PSAnb3ZlcmxhcCcpIHtcbiAgICAgICAgICAgIFMoJy5yaWdodC1zdWJtZW51JykucmVtb3ZlQ2xhc3MobW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgfVxuICAgICAgICAgICQoJy5yaWdodC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLm9mZmNhbnZhcycsICcucmlnaHQtb2ZmLWNhbnZhcy1tZW51IGEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IHNlbGYuZ2V0X3NldHRpbmdzKGUpO1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBTKHRoaXMpLnBhcmVudCgpO1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2NsaWNrICYmICFwYXJlbnQuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykgJiYgIXBhcmVudC5oYXNDbGFzcygnYmFjaycpKSB7XG4gICAgICAgICAgICBzZWxmLmhpZGUuY2FsbChzZWxmLCBtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4LCBzZWxmLmdldF93cmFwcGVyKGUpKTtcbiAgICAgICAgICAgIHBhcmVudC5wYXJlbnQoKS5yZW1vdmVDbGFzcyhtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKFModGhpcykucGFyZW50KCkuaGFzQ2xhc3MoJ2hhcy1zdWJtZW51JykpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFModGhpcykuc2libGluZ3MoJy5yaWdodC1zdWJtZW51JykudG9nZ2xlQ2xhc3MobW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJlbnQuaGFzQ2xhc3MoJ2JhY2snKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcGFyZW50LnBhcmVudCgpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmV4aXQtb2ZmLWNhbnZhcycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgUygnLnJpZ2h0LXN1Ym1lbnUnKS5yZW1vdmVDbGFzcyhtb3ZlX2NsYXNzICsgbGVmdF9wb3N0Zml4KTtcbiAgICAgICAgICBpZiAocmlnaHRfcG9zdGZpeCkge1xuICAgICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIHJpZ2h0X3Bvc3RmaXgpO1xuICAgICAgICAgICAgUygnLmxlZnQtc3VibWVudScpLnJlbW92ZUNsYXNzKG1vdmVfY2xhc3MgKyBsZWZ0X3Bvc3RmaXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkKCcucmlnaHQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi5vZmZjYW52YXMnLCAnLmV4aXQtb2ZmLWNhbnZhcycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5jbGlja19yZW1vdmVfY2xhc3MoZSwgbW92ZV9jbGFzcyArIGxlZnRfcG9zdGZpeCk7XG4gICAgICAgICAgJCgnLmxlZnQtb2ZmLWNhbnZhcy10b2dnbGUnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgaWYgKHJpZ2h0X3Bvc3RmaXgpIHtcbiAgICAgICAgICAgIHNlbGYuY2xpY2tfcmVtb3ZlX2NsYXNzKGUsIG1vdmVfY2xhc3MgKyByaWdodF9wb3N0Zml4KTtcbiAgICAgICAgICAgICQoJy5yaWdodC1vZmYtY2FudmFzLXRvZ2dsZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAoY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpIHtcbiAgICAgICRvZmZfY2FudmFzID0gJG9mZl9jYW52YXMgfHwgdGhpcy5nZXRfd3JhcHBlcigpO1xuICAgICAgaWYgKCRvZmZfY2FudmFzLmlzKCcuJyArIGNsYXNzX25hbWUpKSB7XG4gICAgICAgIHRoaXMuaGlkZShjbGFzc19uYW1lLCAkb2ZmX2NhbnZhcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNob3coY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzaG93IDogZnVuY3Rpb24gKGNsYXNzX25hbWUsICRvZmZfY2FudmFzKSB7XG4gICAgICAkb2ZmX2NhbnZhcyA9ICRvZmZfY2FudmFzIHx8IHRoaXMuZ2V0X3dyYXBwZXIoKTtcbiAgICAgICRvZmZfY2FudmFzLnRyaWdnZXIoJ29wZW4uZm5kdG4ub2ZmY2FudmFzJyk7XG4gICAgICAkb2ZmX2NhbnZhcy5hZGRDbGFzcyhjbGFzc19uYW1lKTtcbiAgICB9LFxuXG4gICAgaGlkZSA6IGZ1bmN0aW9uIChjbGFzc19uYW1lLCAkb2ZmX2NhbnZhcykge1xuICAgICAgJG9mZl9jYW52YXMgPSAkb2ZmX2NhbnZhcyB8fCB0aGlzLmdldF93cmFwcGVyKCk7XG4gICAgICAkb2ZmX2NhbnZhcy50cmlnZ2VyKCdjbG9zZS5mbmR0bi5vZmZjYW52YXMnKTtcbiAgICAgICRvZmZfY2FudmFzLnJlbW92ZUNsYXNzKGNsYXNzX25hbWUpO1xuICAgIH0sXG5cbiAgICBjbGlja190b2dnbGVfY2xhc3MgOiBmdW5jdGlvbiAoZSwgY2xhc3NfbmFtZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyICRvZmZfY2FudmFzID0gdGhpcy5nZXRfd3JhcHBlcihlKTtcbiAgICAgIHRoaXMudG9nZ2xlKGNsYXNzX25hbWUsICRvZmZfY2FudmFzKTtcbiAgICB9LFxuXG4gICAgY2xpY2tfcmVtb3ZlX2NsYXNzIDogZnVuY3Rpb24gKGUsIGNsYXNzX25hbWUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciAkb2ZmX2NhbnZhcyA9IHRoaXMuZ2V0X3dyYXBwZXIoZSk7XG4gICAgICB0aGlzLmhpZGUoY2xhc3NfbmFtZSwgJG9mZl9jYW52YXMpO1xuICAgIH0sXG5cbiAgICBnZXRfc2V0dGluZ3MgOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIG9mZmNhbnZhcyAgPSB0aGlzLlMoZS50YXJnZXQpLmNsb3Nlc3QoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICByZXR1cm4gb2ZmY2FudmFzLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSB8fCB0aGlzLnNldHRpbmdzO1xuICAgIH0sXG5cbiAgICBnZXRfd3JhcHBlciA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJG9mZl9jYW52YXMgPSB0aGlzLlMoZSA/IGUudGFyZ2V0IDogdGhpcy5zY29wZSkuY2xvc2VzdCgnLm9mZi1jYW52YXMtd3JhcCcpO1xuXG4gICAgICBpZiAoJG9mZl9jYW52YXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICRvZmZfY2FudmFzID0gdGhpcy5TKCcub2ZmLWNhbnZhcy13cmFwJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJG9mZl9jYW52YXM7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBPcmJpdCA9IGZ1bmN0aW9uIChlbCwgc2V0dGluZ3MpIHtcbiAgICAvLyBEb24ndCByZWluaXRpYWxpemUgcGx1Z2luXG4gICAgaWYgKGVsLmhhc0NsYXNzKHNldHRpbmdzLnNsaWRlc19jb250YWluZXJfY2xhc3MpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgc2xpZGVzX2NvbnRhaW5lciA9IGVsLFxuICAgICAgICBudW1iZXJfY29udGFpbmVyLFxuICAgICAgICBidWxsZXRzX2NvbnRhaW5lcixcbiAgICAgICAgdGltZXJfY29udGFpbmVyLFxuICAgICAgICBpZHggPSAwLFxuICAgICAgICBhbmltYXRlLFxuICAgICAgICB0aW1lcixcbiAgICAgICAgbG9ja2VkID0gZmFsc2UsXG4gICAgICAgIGFkanVzdF9oZWlnaHRfYWZ0ZXIgPSBmYWxzZTtcblxuICAgIHNlbGYuc2xpZGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNsaWRlc19jb250YWluZXIuY2hpbGRyZW4oc2V0dGluZ3Muc2xpZGVfc2VsZWN0b3IpO1xuICAgIH07XG5cbiAgICBzZWxmLnNsaWRlcygpLmZpcnN0KCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX3NsaWRlX2NsYXNzKTtcblxuICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlciA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgaWYgKHNldHRpbmdzLnNsaWRlX251bWJlcikge1xuICAgICAgICBudW1iZXJfY29udGFpbmVyLmZpbmQoJ3NwYW46Zmlyc3QnKS50ZXh0KHBhcnNlSW50KGluZGV4KSArIDEpO1xuICAgICAgICBudW1iZXJfY29udGFpbmVyLmZpbmQoJ3NwYW46bGFzdCcpLnRleHQoc2VsZi5zbGlkZXMoKS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgaWYgKHNldHRpbmdzLmJ1bGxldHMpIHtcbiAgICAgICAgYnVsbGV0c19jb250YWluZXIuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2FjdGl2ZV9jbGFzcyk7XG4gICAgICAgICQoYnVsbGV0c19jb250YWluZXIuY2hpbGRyZW4oKS5nZXQoaW5kZXgpKS5hZGRDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2FjdGl2ZV9jbGFzcyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYudXBkYXRlX2FjdGl2ZV9saW5rID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgbGluayA9ICQoJ1tkYXRhLW9yYml0LWxpbms9XCInICsgc2VsZi5zbGlkZXMoKS5lcShpbmRleCkuYXR0cignZGF0YS1vcmJpdC1zbGlkZScpICsgJ1wiXScpO1xuICAgICAgbGluay5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKHNldHRpbmdzLmJ1bGxldHNfYWN0aXZlX2NsYXNzKTtcbiAgICAgIGxpbmsuYWRkQ2xhc3Moc2V0dGluZ3MuYnVsbGV0c19hY3RpdmVfY2xhc3MpO1xuICAgIH07XG5cbiAgICBzZWxmLmJ1aWxkX21hcmt1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlc19jb250YWluZXIud3JhcCgnPGRpdiBjbGFzcz1cIicgKyBzZXR0aW5ncy5jb250YWluZXJfY2xhc3MgKyAnXCI+PC9kaXY+Jyk7XG4gICAgICBjb250YWluZXIgPSBzbGlkZXNfY29udGFpbmVyLnBhcmVudCgpO1xuICAgICAgc2xpZGVzX2NvbnRhaW5lci5hZGRDbGFzcyhzZXR0aW5ncy5zbGlkZXNfY29udGFpbmVyX2NsYXNzKTtcblxuICAgICAgaWYgKHNldHRpbmdzLnN0YWNrX29uX3NtYWxsKSB7XG4gICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhzZXR0aW5ncy5zdGFja19vbl9zbWFsbF9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5uYXZpZ2F0aW9uX2Fycm93cykge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKCQoJzxhIGhyZWY9XCIjXCI+PHNwYW4+PC9zcGFuPjwvYT4nKS5hZGRDbGFzcyhzZXR0aW5ncy5wcmV2X2NsYXNzKSk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoJCgnPGEgaHJlZj1cIiNcIj48c3Bhbj48L3NwYW4+PC9hPicpLmFkZENsYXNzKHNldHRpbmdzLm5leHRfY2xhc3MpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNldHRpbmdzLnRpbWVyKSB7XG4gICAgICAgIHRpbWVyX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfY29udGFpbmVyX2NsYXNzKTtcbiAgICAgICAgdGltZXJfY29udGFpbmVyLmFwcGVuZCgnPHNwYW4+Jyk7XG4gICAgICAgIHRpbWVyX2NvbnRhaW5lci5hcHBlbmQoJCgnPGRpdj4nKS5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wcm9ncmVzc19jbGFzcykpO1xuICAgICAgICB0aW1lcl9jb250YWluZXIuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZCh0aW1lcl9jb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3Muc2xpZGVfbnVtYmVyKSB7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFkZENsYXNzKHNldHRpbmdzLnNsaWRlX251bWJlcl9jbGFzcyk7XG4gICAgICAgIG51bWJlcl9jb250YWluZXIuYXBwZW5kKCc8c3Bhbj48L3NwYW4+ICcgKyBzZXR0aW5ncy5zbGlkZV9udW1iZXJfdGV4dCArICcgPHNwYW4+PC9zcGFuPicpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKG51bWJlcl9jb250YWluZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuYnVsbGV0cykge1xuICAgICAgICBidWxsZXRzX2NvbnRhaW5lciA9ICQoJzxvbD4nKS5hZGRDbGFzcyhzZXR0aW5ncy5idWxsZXRzX2NvbnRhaW5lcl9jbGFzcyk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoYnVsbGV0c19jb250YWluZXIpO1xuICAgICAgICBidWxsZXRzX2NvbnRhaW5lci53cmFwKCc8ZGl2IGNsYXNzPVwib3JiaXQtYnVsbGV0cy1jb250YWluZXJcIj48L2Rpdj4nKTtcbiAgICAgICAgc2VsZi5zbGlkZXMoKS5lYWNoKGZ1bmN0aW9uIChpZHgsIGVsKSB7XG4gICAgICAgICAgdmFyIGJ1bGxldCA9ICQoJzxsaT4nKS5hdHRyKCdkYXRhLW9yYml0LXNsaWRlJywgaWR4KS5vbignY2xpY2snLCBzZWxmLmxpbmtfYnVsbGV0KTs7XG4gICAgICAgICAgYnVsbGV0c19jb250YWluZXIuYXBwZW5kKGJ1bGxldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIHNlbGYuX2dvdG8gPSBmdW5jdGlvbiAobmV4dF9pZHgsIHN0YXJ0X3RpbWVyKSB7XG4gICAgICAvLyBpZiAobG9ja2VkKSB7cmV0dXJuIGZhbHNlO31cbiAgICAgIGlmIChuZXh0X2lkeCA9PT0gaWR4KSB7cmV0dXJuIGZhbHNlO31cbiAgICAgIGlmICh0eXBlb2YgdGltZXIgPT09ICdvYmplY3QnKSB7dGltZXIucmVzdGFydCgpO31cbiAgICAgIHZhciBzbGlkZXMgPSBzZWxmLnNsaWRlcygpO1xuXG4gICAgICB2YXIgZGlyID0gJ25leHQnO1xuICAgICAgbG9ja2VkID0gdHJ1ZTtcbiAgICAgIGlmIChuZXh0X2lkeCA8IGlkeCkge2RpciA9ICdwcmV2Jzt9XG4gICAgICBpZiAobmV4dF9pZHggPj0gc2xpZGVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIXNldHRpbmdzLmNpcmN1bGFyKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIG5leHRfaWR4ID0gMDtcbiAgICAgIH0gZWxzZSBpZiAobmV4dF9pZHggPCAwKSB7XG4gICAgICAgIGlmICghc2V0dGluZ3MuY2lyY3VsYXIpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dF9pZHggPSBzbGlkZXMubGVuZ3RoIC0gMTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnQgPSAkKHNsaWRlcy5nZXQoaWR4KSk7XG4gICAgICB2YXIgbmV4dCA9ICQoc2xpZGVzLmdldChuZXh0X2lkeCkpO1xuXG4gICAgICBjdXJyZW50LmNzcygnekluZGV4JywgMik7XG4gICAgICBjdXJyZW50LnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9zbGlkZV9jbGFzcyk7XG4gICAgICBuZXh0LmNzcygnekluZGV4JywgNCkuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX3NsaWRlX2NsYXNzKTtcblxuICAgICAgc2xpZGVzX2NvbnRhaW5lci50cmlnZ2VyKCdiZWZvcmUtc2xpZGUtY2hhbmdlLmZuZHRuLm9yYml0Jyk7XG4gICAgICBzZXR0aW5ncy5iZWZvcmVfc2xpZGVfY2hhbmdlKCk7XG4gICAgICBzZWxmLnVwZGF0ZV9hY3RpdmVfbGluayhuZXh0X2lkeCk7XG5cbiAgICAgIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZHggPSBuZXh0X2lkeDtcbiAgICAgICAgICBsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoc3RhcnRfdGltZXIgPT09IHRydWUpIHt0aW1lciA9IHNlbGYuY3JlYXRlX3RpbWVyKCk7IHRpbWVyLnN0YXJ0KCk7fVxuICAgICAgICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlcihpZHgpO1xuICAgICAgICAgIHNsaWRlc19jb250YWluZXIudHJpZ2dlcignYWZ0ZXItc2xpZGUtY2hhbmdlLmZuZHRuLm9yYml0JywgW3tzbGlkZV9udW1iZXIgOiBpZHgsIHRvdGFsX3NsaWRlcyA6IHNsaWRlcy5sZW5ndGh9XSk7XG4gICAgICAgICAgc2V0dGluZ3MuYWZ0ZXJfc2xpZGVfY2hhbmdlKGlkeCwgc2xpZGVzLmxlbmd0aCk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChzbGlkZXNfY29udGFpbmVyLm91dGVySGVpZ2h0KCkgIT0gbmV4dC5vdXRlckhlaWdodCgpICYmIHNldHRpbmdzLnZhcmlhYmxlX2hlaWdodCkge1xuICAgICAgICAgIHNsaWRlc19jb250YWluZXIuYW5pbWF0ZSh7J2hlaWdodCc6IG5leHQub3V0ZXJIZWlnaHQoKX0sIDI1MCwgJ2xpbmVhcicsIHVubG9jayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5sb2NrKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChzbGlkZXMubGVuZ3RoID09PSAxKSB7Y2FsbGJhY2soKTsgcmV0dXJuIGZhbHNlO31cblxuICAgICAgdmFyIHN0YXJ0X2FuaW1hdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGRpciA9PT0gJ25leHQnKSB7YW5pbWF0ZS5uZXh0KGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKTt9XG4gICAgICAgIGlmIChkaXIgPT09ICdwcmV2Jykge2FuaW1hdGUucHJldihjdXJyZW50LCBuZXh0LCBjYWxsYmFjayk7fVxuICAgICAgfTtcblxuICAgICAgaWYgKG5leHQub3V0ZXJIZWlnaHQoKSA+IHNsaWRlc19jb250YWluZXIub3V0ZXJIZWlnaHQoKSAmJiBzZXR0aW5ncy52YXJpYWJsZV9oZWlnaHQpIHtcbiAgICAgICAgc2xpZGVzX2NvbnRhaW5lci5hbmltYXRlKHsnaGVpZ2h0JzogbmV4dC5vdXRlckhlaWdodCgpfSwgMjUwLCAnbGluZWFyJywgc3RhcnRfYW5pbWF0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0X2FuaW1hdGlvbigpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBzZWxmLm5leHQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHNlbGYuX2dvdG8oaWR4ICsgMSk7XG4gICAgfTtcblxuICAgIHNlbGYucHJldiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgc2VsZi5fZ290byhpZHggLSAxKTtcbiAgICB9O1xuXG4gICAgc2VsZi5saW5rX2N1c3RvbSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgbGluayA9ICQodGhpcykuYXR0cignZGF0YS1vcmJpdC1saW5rJyk7XG4gICAgICBpZiAoKHR5cGVvZiBsaW5rID09PSAnc3RyaW5nJykgJiYgKGxpbmsgPSAkLnRyaW0obGluaykpICE9ICcnKSB7XG4gICAgICAgIHZhciBzbGlkZSA9IGNvbnRhaW5lci5maW5kKCdbZGF0YS1vcmJpdC1zbGlkZT0nICsgbGluayArICddJyk7XG4gICAgICAgIGlmIChzbGlkZS5pbmRleCgpICE9IC0xKSB7c2VsZi5fZ290byhzbGlkZS5pbmRleCgpKTt9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYubGlua19idWxsZXQgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGluZGV4ID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9yYml0LXNsaWRlJyk7XG4gICAgICBpZiAoKHR5cGVvZiBpbmRleCA9PT0gJ3N0cmluZycpICYmIChpbmRleCA9ICQudHJpbShpbmRleCkpICE9ICcnKSB7XG4gICAgICAgIGlmIChpc05hTihwYXJzZUludChpbmRleCkpKSB7XG4gICAgICAgICAgdmFyIHNsaWRlID0gY29udGFpbmVyLmZpbmQoJ1tkYXRhLW9yYml0LXNsaWRlPScgKyBpbmRleCArICddJyk7XG4gICAgICAgICAgaWYgKHNsaWRlLmluZGV4KCkgIT0gLTEpIHtzZWxmLl9nb3RvKHNsaWRlLmluZGV4KCkgKyAxKTt9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5fZ290byhwYXJzZUludChpbmRleCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBzZWxmLnRpbWVyX2NhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fZ290byhpZHggKyAxLCB0cnVlKTtcbiAgICB9XG5cbiAgICBzZWxmLmNvbXB1dGVfZGltZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gJChzZWxmLnNsaWRlcygpLmdldChpZHgpKTtcbiAgICAgIHZhciBoID0gY3VycmVudC5vdXRlckhlaWdodCgpO1xuICAgICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZV9oZWlnaHQpIHtcbiAgICAgICAgc2VsZi5zbGlkZXMoKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaWYgKCQodGhpcykub3V0ZXJIZWlnaHQoKSA+IGgpIHsgaCA9ICQodGhpcykub3V0ZXJIZWlnaHQoKTsgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHNsaWRlc19jb250YWluZXIuaGVpZ2h0KGgpO1xuICAgIH07XG5cbiAgICBzZWxmLmNyZWF0ZV90aW1lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ID0gbmV3IFRpbWVyKFxuICAgICAgICBjb250YWluZXIuZmluZCgnLicgKyBzZXR0aW5ncy50aW1lcl9jb250YWluZXJfY2xhc3MpLFxuICAgICAgICBzZXR0aW5ncyxcbiAgICAgICAgc2VsZi50aW1lcl9jYWxsYmFja1xuICAgICAgKTtcbiAgICAgIHJldHVybiB0O1xuICAgIH07XG5cbiAgICBzZWxmLnN0b3BfdGltZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aW1lci5zdG9wKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYudG9nZ2xlX3RpbWVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHQgPSBjb250YWluZXIuZmluZCgnLicgKyBzZXR0aW5ncy50aW1lcl9jb250YWluZXJfY2xhc3MpO1xuICAgICAgaWYgKHQuaGFzQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKSkge1xuICAgICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAndW5kZWZpbmVkJykge3RpbWVyID0gc2VsZi5jcmVhdGVfdGltZXIoKTt9XG4gICAgICAgIHRpbWVyLnN0YXJ0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHRpbWVyID09PSAnb2JqZWN0Jykge3RpbWVyLnN0b3AoKTt9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHNlbGYuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuYnVpbGRfbWFya3VwKCk7XG4gICAgICBpZiAoc2V0dGluZ3MudGltZXIpIHtcbiAgICAgICAgdGltZXIgPSBzZWxmLmNyZWF0ZV90aW1lcigpO1xuICAgICAgICBGb3VuZGF0aW9uLnV0aWxzLmltYWdlX2xvYWRlZCh0aGlzLnNsaWRlcygpLmNoaWxkcmVuKCdpbWcnKSwgdGltZXIuc3RhcnQpO1xuICAgICAgfVxuICAgICAgYW5pbWF0ZSA9IG5ldyBGYWRlQW5pbWF0aW9uKHNldHRpbmdzLCBzbGlkZXNfY29udGFpbmVyKTtcbiAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRpb24gPT09ICdzbGlkZScpIHtcbiAgICAgICAgYW5pbWF0ZSA9IG5ldyBTbGlkZUFuaW1hdGlvbihzZXR0aW5ncywgc2xpZGVzX2NvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnRhaW5lci5vbignY2xpY2snLCAnLicgKyBzZXR0aW5ncy5uZXh0X2NsYXNzLCBzZWxmLm5leHQpO1xuICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsICcuJyArIHNldHRpbmdzLnByZXZfY2xhc3MsIHNlbGYucHJldik7XG5cbiAgICAgIGlmIChzZXR0aW5ncy5uZXh0X29uX2NsaWNrKSB7XG4gICAgICAgIGNvbnRhaW5lci5vbignY2xpY2snLCAnLicgKyBzZXR0aW5ncy5zbGlkZXNfY29udGFpbmVyX2NsYXNzICsgJyBbZGF0YS1vcmJpdC1zbGlkZV0nLCBzZWxmLmxpbmtfYnVsbGV0KTtcbiAgICAgIH1cblxuICAgICAgY29udGFpbmVyLm9uKCdjbGljaycsIHNlbGYudG9nZ2xlX3RpbWVyKTtcbiAgICAgIGlmIChzZXR0aW5ncy5zd2lwZSkge1xuICAgICAgICBjb250YWluZXIub24oJ3RvdWNoc3RhcnQuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghZS50b3VjaGVzKSB7ZSA9IGUub3JpZ2luYWxFdmVudDt9XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBzdGFydF9wYWdlX3ggOiBlLnRvdWNoZXNbMF0ucGFnZVgsXG4gICAgICAgICAgICBzdGFydF9wYWdlX3kgOiBlLnRvdWNoZXNbMF0ucGFnZVksXG4gICAgICAgICAgICBzdGFydF90aW1lIDogKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgIGRlbHRhX3ggOiAwLFxuICAgICAgICAgICAgaXNfc2Nyb2xsaW5nIDogdW5kZWZpbmVkXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb250YWluZXIuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIGRhdGEpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbigndG91Y2htb3ZlLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICAgICAgZSA9IGUub3JpZ2luYWxFdmVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gSWdub3JlIHBpbmNoL3pvb20gZXZlbnRzXG4gICAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPiAxIHx8IGUuc2NhbGUgJiYgZS5zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBkYXRhID0gY29udGFpbmVyLmRhdGEoJ3N3aXBlLXRyYW5zaXRpb24nKTtcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnKSB7ZGF0YSA9IHt9O31cblxuICAgICAgICAgIGRhdGEuZGVsdGFfeCA9IGUudG91Y2hlc1swXS5wYWdlWCAtIGRhdGEuc3RhcnRfcGFnZV94O1xuXG4gICAgICAgICAgaWYgKCB0eXBlb2YgZGF0YS5pc19zY3JvbGxpbmcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRhLmlzX3Njcm9sbGluZyA9ICEhKCBkYXRhLmlzX3Njcm9sbGluZyB8fCBNYXRoLmFicyhkYXRhLmRlbHRhX3gpIDwgTWF0aC5hYnMoZS50b3VjaGVzWzBdLnBhZ2VZIC0gZGF0YS5zdGFydF9wYWdlX3kpICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFkYXRhLmlzX3Njcm9sbGluZyAmJiAhZGF0YS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBkaXJlY3Rpb24gPSAoZGF0YS5kZWx0YV94IDwgMCkgPyAoaWR4ICsgMSkgOiAoaWR4IC0gMSk7XG4gICAgICAgICAgICBkYXRhLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9nb3RvKGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ3RvdWNoZW5kLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBjb250YWluZXIuZGF0YSgnc3dpcGUtdHJhbnNpdGlvbicsIHt9KTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgY29udGFpbmVyLm9uKCdtb3VzZWVudGVyLmZuZHRuLm9yYml0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzLnRpbWVyICYmIHNldHRpbmdzLnBhdXNlX29uX2hvdmVyKSB7XG4gICAgICAgICAgc2VsZi5zdG9wX3RpbWVyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlbGVhdmUuZm5kdG4ub3JiaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MudGltZXIgJiYgc2V0dGluZ3MucmVzdW1lX29uX21vdXNlb3V0KSB7XG4gICAgICAgICAgdGltZXIuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1vcmJpdC1saW5rXScsIHNlbGYubGlua19jdXN0b20pO1xuICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkIHJlc2l6ZScsIHNlbGYuY29tcHV0ZV9kaW1lbnNpb25zKTtcbiAgICAgIEZvdW5kYXRpb24udXRpbHMuaW1hZ2VfbG9hZGVkKHRoaXMuc2xpZGVzKCkuY2hpbGRyZW4oJ2ltZycpLCBzZWxmLmNvbXB1dGVfZGltZW5zaW9ucyk7XG4gICAgICBGb3VuZGF0aW9uLnV0aWxzLmltYWdlX2xvYWRlZCh0aGlzLnNsaWRlcygpLmNoaWxkcmVuKCdpbWcnKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjb250YWluZXIucHJldignLicgKyBzZXR0aW5ncy5wcmVsb2FkZXJfY2xhc3MpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIHNlbGYudXBkYXRlX3NsaWRlX251bWJlcigwKTtcbiAgICAgICAgc2VsZi51cGRhdGVfYWN0aXZlX2xpbmsoMCk7XG4gICAgICAgIHNsaWRlc19jb250YWluZXIudHJpZ2dlcigncmVhZHkuZm5kdG4ub3JiaXQnKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzZWxmLmluaXQoKTtcbiAgfTtcblxuICB2YXIgVGltZXIgPSBmdW5jdGlvbiAoZWwsIHNldHRpbmdzLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZHVyYXRpb24gPSBzZXR0aW5ncy50aW1lcl9zcGVlZCxcbiAgICAgICAgcHJvZ3Jlc3MgPSBlbC5maW5kKCcuJyArIHNldHRpbmdzLnRpbWVyX3Byb2dyZXNzX2NsYXNzKSxcbiAgICAgICAgc3RhcnQsXG4gICAgICAgIHRpbWVvdXQsXG4gICAgICAgIGxlZnQgPSAtMTtcblxuICAgIHRoaXMudXBkYXRlX3Byb2dyZXNzID0gZnVuY3Rpb24gKHcpIHtcbiAgICAgIHZhciBuZXdfcHJvZ3Jlc3MgPSBwcm9ncmVzcy5jbG9uZSgpO1xuICAgICAgbmV3X3Byb2dyZXNzLmF0dHIoJ3N0eWxlJywgJycpO1xuICAgICAgbmV3X3Byb2dyZXNzLmNzcygnd2lkdGgnLCB3ICsgJyUnKTtcbiAgICAgIHByb2dyZXNzLnJlcGxhY2VXaXRoKG5ld19wcm9ncmVzcyk7XG4gICAgICBwcm9ncmVzcyA9IG5ld19wcm9ncmVzcztcbiAgICB9O1xuXG4gICAgdGhpcy5yZXN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgZWwuYWRkQ2xhc3Moc2V0dGluZ3MudGltZXJfcGF1c2VkX2NsYXNzKTtcbiAgICAgIGxlZnQgPSAtMTtcbiAgICAgIHNlbGYudXBkYXRlX3Byb2dyZXNzKDApO1xuICAgIH07XG5cbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFlbC5oYXNDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpKSB7cmV0dXJuIHRydWU7fVxuICAgICAgbGVmdCA9IChsZWZ0ID09PSAtMSkgPyBkdXJhdGlvbiA6IGxlZnQ7XG4gICAgICBlbC5yZW1vdmVDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHByb2dyZXNzLmFuaW1hdGUoeyd3aWR0aCcgOiAnMTAwJSd9LCBsZWZ0LCAnbGluZWFyJyk7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucmVzdGFydCgpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSwgbGVmdCk7XG4gICAgICBlbC50cmlnZ2VyKCd0aW1lci1zdGFydGVkLmZuZHRuLm9yYml0JylcbiAgICB9O1xuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVsLmhhc0NsYXNzKHNldHRpbmdzLnRpbWVyX3BhdXNlZF9jbGFzcykpIHtyZXR1cm4gdHJ1ZTt9XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICBlbC5hZGRDbGFzcyhzZXR0aW5ncy50aW1lcl9wYXVzZWRfY2xhc3MpO1xuICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgbGVmdCA9IGxlZnQgLSAoZW5kIC0gc3RhcnQpO1xuICAgICAgdmFyIHcgPSAxMDAgLSAoKGxlZnQgLyBkdXJhdGlvbikgKiAxMDApO1xuICAgICAgc2VsZi51cGRhdGVfcHJvZ3Jlc3Modyk7XG4gICAgICBlbC50cmlnZ2VyKCd0aW1lci1zdG9wcGVkLmZuZHRuLm9yYml0Jyk7XG4gICAgfTtcbiAgfTtcblxuICB2YXIgU2xpZGVBbmltYXRpb24gPSBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbnRhaW5lcikge1xuICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZDtcbiAgICB2YXIgaXNfcnRsID0gKCQoJ2h0bWxbZGlyPXJ0bF0nKS5sZW5ndGggPT09IDEpO1xuICAgIHZhciBtYXJnaW4gPSBpc19ydGwgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuICAgIHZhciBhbmltTWFyZ2luID0ge307XG4gICAgYW5pbU1hcmdpblttYXJnaW5dID0gJzAlJztcblxuICAgIHRoaXMubmV4dCA9IGZ1bmN0aW9uIChjdXJyZW50LCBuZXh0LCBjYWxsYmFjaykge1xuICAgICAgY3VycmVudC5hbmltYXRlKHttYXJnaW5MZWZ0IDogJy0xMDAlJ30sIGR1cmF0aW9uKTtcbiAgICAgIG5leHQuYW5pbWF0ZShhbmltTWFyZ2luLCBkdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBjdXJyZW50LmNzcyhtYXJnaW4sICcxMDAlJyk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5wcmV2ID0gZnVuY3Rpb24gKGN1cnJlbnQsIHByZXYsIGNhbGxiYWNrKSB7XG4gICAgICBjdXJyZW50LmFuaW1hdGUoe21hcmdpbkxlZnQgOiAnMTAwJSd9LCBkdXJhdGlvbik7XG4gICAgICBwcmV2LmNzcyhtYXJnaW4sICctMTAwJScpO1xuICAgICAgcHJldi5hbmltYXRlKGFuaW1NYXJnaW4sIGR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnQuY3NzKG1hcmdpbiwgJzEwMCUnKTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgdmFyIEZhZGVBbmltYXRpb24gPSBmdW5jdGlvbiAoc2V0dGluZ3MsIGNvbnRhaW5lcikge1xuICAgIHZhciBkdXJhdGlvbiA9IHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZDtcbiAgICB2YXIgaXNfcnRsID0gKCQoJ2h0bWxbZGlyPXJ0bF0nKS5sZW5ndGggPT09IDEpO1xuICAgIHZhciBtYXJnaW4gPSBpc19ydGwgPyAnbWFyZ2luUmlnaHQnIDogJ21hcmdpbkxlZnQnO1xuXG4gICAgdGhpcy5uZXh0ID0gZnVuY3Rpb24gKGN1cnJlbnQsIG5leHQsIGNhbGxiYWNrKSB7XG4gICAgICBuZXh0LmNzcyh7J21hcmdpbicgOiAnMCUnLCAnb3BhY2l0eScgOiAnMC4wMSd9KTtcbiAgICAgIG5leHQuYW5pbWF0ZSh7J29wYWNpdHknIDonMSd9LCBkdXJhdGlvbiwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY3VycmVudC5jc3MoJ21hcmdpbicsICcxMDAlJyk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5wcmV2ID0gZnVuY3Rpb24gKGN1cnJlbnQsIHByZXYsIGNhbGxiYWNrKSB7XG4gICAgICBwcmV2LmNzcyh7J21hcmdpbicgOiAnMCUnLCAnb3BhY2l0eScgOiAnMC4wMSd9KTtcbiAgICAgIHByZXYuYW5pbWF0ZSh7J29wYWNpdHknIDogJzEnfSwgZHVyYXRpb24sICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGN1cnJlbnQuY3NzKCdtYXJnaW4nLCAnMTAwJScpO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBGb3VuZGF0aW9uLmxpYnMgPSBGb3VuZGF0aW9uLmxpYnMgfHwge307XG5cbiAgRm91bmRhdGlvbi5saWJzLm9yYml0ID0ge1xuICAgIG5hbWUgOiAnb3JiaXQnLFxuXG4gICAgdmVyc2lvbiA6ICc1LjUuMicsXG5cbiAgICBzZXR0aW5ncyA6IHtcbiAgICAgIGFuaW1hdGlvbiA6ICdzbGlkZScsXG4gICAgICB0aW1lcl9zcGVlZCA6IDEwMDAwLFxuICAgICAgcGF1c2Vfb25faG92ZXIgOiB0cnVlLFxuICAgICAgcmVzdW1lX29uX21vdXNlb3V0IDogZmFsc2UsXG4gICAgICBuZXh0X29uX2NsaWNrIDogdHJ1ZSxcbiAgICAgIGFuaW1hdGlvbl9zcGVlZCA6IDUwMCxcbiAgICAgIHN0YWNrX29uX3NtYWxsIDogZmFsc2UsXG4gICAgICBuYXZpZ2F0aW9uX2Fycm93cyA6IHRydWUsXG4gICAgICBzbGlkZV9udW1iZXIgOiB0cnVlLFxuICAgICAgc2xpZGVfbnVtYmVyX3RleHQgOiAnb2YnLFxuICAgICAgY29udGFpbmVyX2NsYXNzIDogJ29yYml0LWNvbnRhaW5lcicsXG4gICAgICBzdGFja19vbl9zbWFsbF9jbGFzcyA6ICdvcmJpdC1zdGFjay1vbi1zbWFsbCcsXG4gICAgICBuZXh0X2NsYXNzIDogJ29yYml0LW5leHQnLFxuICAgICAgcHJldl9jbGFzcyA6ICdvcmJpdC1wcmV2JyxcbiAgICAgIHRpbWVyX2NvbnRhaW5lcl9jbGFzcyA6ICdvcmJpdC10aW1lcicsXG4gICAgICB0aW1lcl9wYXVzZWRfY2xhc3MgOiAncGF1c2VkJyxcbiAgICAgIHRpbWVyX3Byb2dyZXNzX2NsYXNzIDogJ29yYml0LXByb2dyZXNzJyxcbiAgICAgIHNsaWRlc19jb250YWluZXJfY2xhc3MgOiAnb3JiaXQtc2xpZGVzLWNvbnRhaW5lcicsXG4gICAgICBwcmVsb2FkZXJfY2xhc3MgOiAncHJlbG9hZGVyJyxcbiAgICAgIHNsaWRlX3NlbGVjdG9yIDogJyonLFxuICAgICAgYnVsbGV0c19jb250YWluZXJfY2xhc3MgOiAnb3JiaXQtYnVsbGV0cycsXG4gICAgICBidWxsZXRzX2FjdGl2ZV9jbGFzcyA6ICdhY3RpdmUnLFxuICAgICAgc2xpZGVfbnVtYmVyX2NsYXNzIDogJ29yYml0LXNsaWRlLW51bWJlcicsXG4gICAgICBjYXB0aW9uX2NsYXNzIDogJ29yYml0LWNhcHRpb24nLFxuICAgICAgYWN0aXZlX3NsaWRlX2NsYXNzIDogJ2FjdGl2ZScsXG4gICAgICBvcmJpdF90cmFuc2l0aW9uX2NsYXNzIDogJ29yYml0LXRyYW5zaXRpb25pbmcnLFxuICAgICAgYnVsbGV0cyA6IHRydWUsXG4gICAgICBjaXJjdWxhciA6IHRydWUsXG4gICAgICB0aW1lciA6IHRydWUsXG4gICAgICB2YXJpYWJsZV9oZWlnaHQgOiBmYWxzZSxcbiAgICAgIHN3aXBlIDogdHJ1ZSxcbiAgICAgIGJlZm9yZV9zbGlkZV9jaGFuZ2UgOiBub29wLFxuICAgICAgYWZ0ZXJfc2xpZGVfY2hhbmdlIDogbm9vcFxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICB2YXIgb3JiaXRfaW5zdGFuY2UgPSBuZXcgT3JiaXQodGhpcy5TKGluc3RhbmNlKSwgdGhpcy5TKGluc3RhbmNlKS5kYXRhKCdvcmJpdC1pbml0JykpO1xuICAgICAgdGhpcy5TKGluc3RhbmNlKS5kYXRhKHRoaXMubmFtZSArICctaW5zdGFuY2UnLCBvcmJpdF9pbnN0YW5jZSk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKHNlbGYuUyhzZWxmLnNjb3BlKS5pcygnW2RhdGEtb3JiaXRdJykpIHtcbiAgICAgICAgdmFyICRlbCA9IHNlbGYuUyhzZWxmLnNjb3BlKTtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gJGVsLmRhdGEoc2VsZi5uYW1lICsgJy1pbnN0YW5jZScpO1xuICAgICAgICBpbnN0YW5jZS5jb21wdXRlX2RpbWVuc2lvbnMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYuUygnW2RhdGEtb3JiaXRdJywgc2VsZi5zY29wZSkuZWFjaChmdW5jdGlvbiAoaWR4LCBlbCkge1xuICAgICAgICAgIHZhciAkZWwgPSBzZWxmLlMoZWwpO1xuICAgICAgICAgIHZhciBvcHRzID0gc2VsZi5kYXRhX29wdGlvbnMoJGVsKTtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkZWwuZGF0YShzZWxmLm5hbWUgKyAnLWluc3RhbmNlJyk7XG4gICAgICAgICAgaW5zdGFuY2UuY29tcHV0ZV9kaW1lbnNpb25zKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLnJldmVhbCA9IHtcbiAgICBuYW1lIDogJ3JldmVhbCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIGxvY2tlZCA6IGZhbHNlLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhbmltYXRpb24gOiAnZmFkZUFuZFBvcCcsXG4gICAgICBhbmltYXRpb25fc3BlZWQgOiAyNTAsXG4gICAgICBjbG9zZV9vbl9iYWNrZ3JvdW5kX2NsaWNrIDogdHJ1ZSxcbiAgICAgIGNsb3NlX29uX2VzYyA6IHRydWUsXG4gICAgICBkaXNtaXNzX21vZGFsX2NsYXNzIDogJ2Nsb3NlLXJldmVhbC1tb2RhbCcsXG4gICAgICBtdWx0aXBsZV9vcGVuZWQgOiBmYWxzZSxcbiAgICAgIGJnX2NsYXNzIDogJ3JldmVhbC1tb2RhbC1iZycsXG4gICAgICByb290X2VsZW1lbnQgOiAnYm9keScsXG4gICAgICBvcGVuIDogZnVuY3Rpb24oKXt9LFxuICAgICAgb3BlbmVkIDogZnVuY3Rpb24oKXt9LFxuICAgICAgY2xvc2UgOiBmdW5jdGlvbigpe30sXG4gICAgICBjbG9zZWQgOiBmdW5jdGlvbigpe30sXG4gICAgICBvbl9hamF4X2Vycm9yOiAkLm5vb3AsXG4gICAgICBiZyA6ICQoJy5yZXZlYWwtbW9kYWwtYmcnKSxcbiAgICAgIGNzcyA6IHtcbiAgICAgICAgb3BlbiA6IHtcbiAgICAgICAgICAnb3BhY2l0eScgOiAwLFxuICAgICAgICAgICd2aXNpYmlsaXR5JyA6ICd2aXNpYmxlJyxcbiAgICAgICAgICAnZGlzcGxheScgOiAnYmxvY2snXG4gICAgICAgIH0sXG4gICAgICAgIGNsb3NlIDoge1xuICAgICAgICAgICdvcGFjaXR5JyA6IDEsXG4gICAgICAgICAgJ3Zpc2liaWxpdHknIDogJ2hpZGRlbicsXG4gICAgICAgICAgJ2Rpc3BsYXknIDogJ25vbmUnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW5pdCA6IGZ1bmN0aW9uIChzY29wZSwgbWV0aG9kLCBvcHRpb25zKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLnNldHRpbmdzLCBtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBldmVudHMgOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TO1xuXG4gICAgICBTKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy5yZXZlYWwnKVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnJldmVhbCcsICdbJyArIHRoaXMuYWRkX25hbWVzcGFjZSgnZGF0YS1yZXZlYWwtaWQnKSArICddOm5vdChbZGlzYWJsZWRdKScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgaWYgKCFzZWxmLmxvY2tlZCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICAgIGFqYXggPSBlbGVtZW50LmRhdGEoc2VsZi5kYXRhX2F0dHIoJ3JldmVhbC1hamF4JykpLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VDb250ZW50U2VsID0gZWxlbWVudC5kYXRhKHNlbGYuZGF0YV9hdHRyKCdyZXZlYWwtcmVwbGFjZS1jb250ZW50JykpO1xuXG4gICAgICAgICAgICBzZWxmLmxvY2tlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYWpheCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgc2VsZi5vcGVuLmNhbGwoc2VsZiwgZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgdXJsID0gYWpheCA9PT0gdHJ1ZSA/IGVsZW1lbnQuYXR0cignaHJlZicpIDogYWpheDtcbiAgICAgICAgICAgICAgc2VsZi5vcGVuLmNhbGwoc2VsZiwgZWxlbWVudCwge3VybCA6IHVybH0sIHsgcmVwbGFjZUNvbnRlbnRTZWwgOiByZXBsYWNlQ29udGVudFNlbCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICBTKGRvY3VtZW50KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnJldmVhbCcsIHRoaXMuY2xvc2VfdGFyZ2V0cygpLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBpZiAoIXNlbGYubG9ja2VkKSB7XG4gICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXS5vcGVuJykuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHNlbGYuc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgYmdfY2xpY2tlZCA9IFMoZS50YXJnZXQpWzBdID09PSBTKCcuJyArIHNldHRpbmdzLmJnX2NsYXNzKVswXTtcblxuICAgICAgICAgICAgaWYgKGJnX2NsaWNrZWQpIHtcbiAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLmNsb3NlX29uX2JhY2tncm91bmRfY2xpY2spIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmxvY2tlZCA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgYmdfY2xpY2tlZCA/IFMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddLm9wZW46bm90KC50b2JhY2spJykgOiBTKHRoaXMpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgUyh0aGlzLnNjb3BlKVxuICAgICAgICAgIC8vIC5vZmYoJy5yZXZlYWwnKVxuICAgICAgICAgIC5vbignb3Blbi5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLm9wZW4pXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgdGhpcy5zZXR0aW5ncy5vcGVuZWQpXG4gICAgICAgICAgLm9uKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJywgdGhpcy5vcGVuX3ZpZGVvKVxuICAgICAgICAgIC5vbignY2xvc2UuZm5kdG4ucmV2ZWFsJywgdGhpcy5zZXR0aW5ncy5jbG9zZSlcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCB0aGlzLnNldHRpbmdzLmNsb3NlZClcbiAgICAgICAgICAub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnLCB0aGlzLmNsb3NlX3ZpZGVvKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgICAvLyAub2ZmKCcucmV2ZWFsJylcbiAgICAgICAgICAub24oJ29wZW4uZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5vcGVuKVxuICAgICAgICAgIC5vbignb3BlbmVkLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2V0dGluZ3Mub3BlbmVkKVxuICAgICAgICAgIC5vbignb3BlbmVkLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMub3Blbl92aWRlbylcbiAgICAgICAgICAub24oJ2Nsb3NlLmZuZHRuLnJldmVhbCcsICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2V0dGluZ3MuY2xvc2UpXG4gICAgICAgICAgLm9uKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5zZXR0aW5ncy5jbG9zZWQpXG4gICAgICAgICAgLm9uKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJywgJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJywgdGhpcy5jbG9zZV92aWRlbyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvLyBQQVRDSCAjMzogdHVybmluZyBvbiBrZXkgdXAgY2FwdHVyZSBvbmx5IHdoZW4gYSByZXZlYWwgd2luZG93IGlzIG9wZW5cbiAgICBrZXlfdXBfb24gOiBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gUEFUQ0ggIzE6IGZpeGluZyBtdWx0aXBsZSBrZXl1cCBldmVudCB0cmlnZ2VyIGZyb20gc2luZ2xlIGtleSBwcmVzc1xuICAgICAgc2VsZi5TKCdib2R5Jykub2ZmKCdrZXl1cC5mbmR0bi5yZXZlYWwnKS5vbigna2V5dXAuZm5kdG4ucmV2ZWFsJywgZnVuY3Rpb24gKCBldmVudCApIHtcbiAgICAgICAgdmFyIG9wZW5fbW9kYWwgPSBzZWxmLlMoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddLm9wZW4nKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gb3Blbl9tb2RhbC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgc2VsZi5zZXR0aW5ncyA7XG4gICAgICAgIC8vIFBBVENIICMyOiBtYWtpbmcgc3VyZSB0aGF0IHRoZSBjbG9zZSBldmVudCBjYW4gYmUgY2FsbGVkIG9ubHkgd2hpbGUgdW5sb2NrZWQsXG4gICAgICAgIC8vICAgICAgICAgICBzbyB0aGF0IG11bHRpcGxlIGtleXVwLmZuZHRuLnJldmVhbCBldmVudHMgZG9uJ3QgcHJldmVudCBjbGVhbiBjbG9zaW5nIG9mIHRoZSByZXZlYWwgd2luZG93LlxuICAgICAgICBpZiAoIHNldHRpbmdzICYmIGV2ZW50LndoaWNoID09PSAyNyAgJiYgc2V0dGluZ3MuY2xvc2Vfb25fZXNjICYmICFzZWxmLmxvY2tlZCkgeyAvLyAyNyBpcyB0aGUga2V5Y29kZSBmb3IgdGhlIEVzY2FwZSBrZXlcbiAgICAgICAgICBzZWxmLmNsb3NlLmNhbGwoc2VsZiwgb3Blbl9tb2RhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLy8gUEFUQ0ggIzM6IHR1cm5pbmcgb24ga2V5IHVwIGNhcHR1cmUgb25seSB3aGVuIGEgcmV2ZWFsIHdpbmRvdyBpcyBvcGVuXG4gICAga2V5X3VwX29mZiA6IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdGhpcy5TKCdib2R5Jykub2ZmKCdrZXl1cC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBvcGVuIDogZnVuY3Rpb24gKHRhcmdldCwgYWpheF9zZXR0aW5ncykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIG1vZGFsO1xuXG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0LnNlbGVjdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIC8vIEZpbmQgdGhlIG5hbWVkIG5vZGU7IG9ubHkgdXNlIHRoZSBmaXJzdCBvbmUgZm91bmQsIHNpbmNlIHRoZSByZXN0IG9mIHRoZSBjb2RlIGFzc3VtZXMgdGhlcmUncyBvbmx5IG9uZSBub2RlXG4gICAgICAgICAgbW9kYWwgPSBzZWxmLlMoJyMnICsgdGFyZ2V0LmRhdGEoc2VsZi5kYXRhX2F0dHIoJ3JldmVhbC1pZCcpKSkuZmlyc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2RhbCA9IHNlbGYuUyh0aGlzLnNjb3BlKTtcblxuICAgICAgICAgIGFqYXhfc2V0dGluZ3MgPSB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1vZGFsID0gc2VsZi5TKHRoaXMuc2NvcGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2V0dGluZ3MgPSBtb2RhbC5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG4gICAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3M7XG5cblxuICAgICAgaWYgKG1vZGFsLmhhc0NsYXNzKCdvcGVuJykgJiYgdGFyZ2V0LmF0dHIoJ2RhdGEtcmV2ZWFsLWlkJykgPT0gbW9kYWwuYXR0cignaWQnKSkge1xuICAgICAgICByZXR1cm4gc2VsZi5jbG9zZShtb2RhbCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbW9kYWwuaGFzQ2xhc3MoJ29wZW4nKSkge1xuICAgICAgICB2YXIgb3Blbl9tb2RhbCA9IHNlbGYuUygnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10ub3BlbicpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgbW9kYWwuZGF0YSgnY3NzLXRvcCcpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIG1vZGFsLmRhdGEoJ2Nzcy10b3AnLCBwYXJzZUludChtb2RhbC5jc3MoJ3RvcCcpLCAxMCkpXG4gICAgICAgICAgICAuZGF0YSgnb2Zmc2V0JywgdGhpcy5jYWNoZV9vZmZzZXQobW9kYWwpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vZGFsLmF0dHIoJ3RhYmluZGV4JywnMCcpLmF0dHIoJ2FyaWEtaGlkZGVuJywnZmFsc2UnKTtcblxuICAgICAgICB0aGlzLmtleV91cF9vbihtb2RhbCk7ICAgIC8vIFBBVENIICMzOiB0dXJuaW5nIG9uIGtleSB1cCBjYXB0dXJlIG9ubHkgd2hlbiBhIHJldmVhbCB3aW5kb3cgaXMgb3BlblxuXG4gICAgICAgIC8vIFByZXZlbnQgbmFtZXNwYWNlIGV2ZW50IGZyb20gdHJpZ2dlcmluZyB0d2ljZVxuICAgICAgICBtb2RhbC5vbignb3Blbi5mbmR0bi5yZXZlYWwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUubmFtZXNwYWNlICE9PSAnZm5kdG4ucmV2ZWFsJykgcmV0dXJuO1xuICAgICAgICB9KTtcblxuICAgICAgICBtb2RhbC5vbignb3Blbi5mbmR0bi5yZXZlYWwnKS50cmlnZ2VyKCdvcGVuLmZuZHRuLnJldmVhbCcpO1xuXG4gICAgICAgIGlmIChvcGVuX21vZGFsLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZV9iZyhtb2RhbCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGFqYXhfc2V0dGluZ3MgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgYWpheF9zZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHVybCA6IGFqYXhfc2V0dGluZ3NcbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhamF4X3NldHRpbmdzID09PSAndW5kZWZpbmVkJyB8fCAhYWpheF9zZXR0aW5ncy51cmwpIHtcbiAgICAgICAgICBpZiAob3Blbl9tb2RhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MubXVsdGlwbGVfb3BlbmVkKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9fYmFjayhvcGVuX21vZGFsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuaGlkZShvcGVuX21vZGFsLCBzZXR0aW5ncy5jc3MuY2xvc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2hvdyhtb2RhbCwgc2V0dGluZ3MuY3NzLm9wZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBvbGRfc3VjY2VzcyA9IHR5cGVvZiBhamF4X3NldHRpbmdzLnN1Y2Nlc3MgIT09ICd1bmRlZmluZWQnID8gYWpheF9zZXR0aW5ncy5zdWNjZXNzIDogbnVsbDtcbiAgICAgICAgICAkLmV4dGVuZChhamF4X3NldHRpbmdzLCB7XG4gICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgIGlmICggJC5pc0Z1bmN0aW9uKG9sZF9zdWNjZXNzKSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb2xkX3N1Y2Nlc3MoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICBkYXRhID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdGlvbnMucmVwbGFjZUNvbnRlbnRTZWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbW9kYWwuZmluZChvcHRpb25zLnJlcGxhY2VDb250ZW50U2VsKS5odG1sKGRhdGEpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vZGFsLmh0bWwoZGF0YSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBzZWxmLlMobW9kYWwpLmZvdW5kYXRpb24oJ3NlY3Rpb24nLCAncmVmbG93Jyk7XG4gICAgICAgICAgICAgIHNlbGYuUyhtb2RhbCkuY2hpbGRyZW4oKS5mb3VuZGF0aW9uKCk7XG5cbiAgICAgICAgICAgICAgaWYgKG9wZW5fbW9kYWwubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQpIHtcbiAgICAgICAgICAgICAgICAgIHNlbGYudG9fYmFjayhvcGVuX21vZGFsKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2VsZi5oaWRlKG9wZW5fbW9kYWwsIHNldHRpbmdzLmNzcy5jbG9zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlbGYuc2hvdyhtb2RhbCwgc2V0dGluZ3MuY3NzLm9wZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gY2hlY2sgZm9yIGlmIHVzZXIgaW5pdGFsaXplZCB3aXRoIGVycm9yIGNhbGxiYWNrXG4gICAgICAgICAgaWYgKHNldHRpbmdzLm9uX2FqYXhfZXJyb3IgIT09ICQubm9vcCkge1xuICAgICAgICAgICAgJC5leHRlbmQoYWpheF9zZXR0aW5ncywge1xuICAgICAgICAgICAgICBlcnJvciA6IHNldHRpbmdzLm9uX2FqYXhfZXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQuYWpheChhamF4X3NldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2VsZi5TKHdpbmRvdykudHJpZ2dlcigncmVzaXplJyk7XG4gICAgfSxcblxuICAgIGNsb3NlIDogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICB2YXIgbW9kYWwgPSBtb2RhbCAmJiBtb2RhbC5sZW5ndGggPyBtb2RhbCA6IHRoaXMuUyh0aGlzLnNjb3BlKSxcbiAgICAgICAgICBvcGVuX21vZGFscyA9IHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10ub3BlbicpLFxuICAgICAgICAgIHNldHRpbmdzID0gbW9kYWwuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpIHx8IHRoaXMuc2V0dGluZ3MsXG4gICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmIChvcGVuX21vZGFscy5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgbW9kYWwucmVtb3ZlQXR0cigndGFiaW5kZXgnLCcwJykuYXR0cignYXJpYS1oaWRkZW4nLCd0cnVlJyk7XG5cbiAgICAgICAgdGhpcy5sb2NrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmtleV91cF9vZmYobW9kYWwpOyAgIC8vIFBBVENIICMzOiB0dXJuaW5nIG9uIGtleSB1cCBjYXB0dXJlIG9ubHkgd2hlbiBhIHJldmVhbCB3aW5kb3cgaXMgb3BlblxuXG4gICAgICAgIG1vZGFsLnRyaWdnZXIoJ2Nsb3NlLmZuZHRuLnJldmVhbCcpO1xuXG4gICAgICAgIGlmICgoc2V0dGluZ3MubXVsdGlwbGVfb3BlbmVkICYmIG9wZW5fbW9kYWxzLmxlbmd0aCA9PT0gMSkgfHwgIXNldHRpbmdzLm11bHRpcGxlX29wZW5lZCB8fCBtb2RhbC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgc2VsZi50b2dnbGVfYmcobW9kYWwsIGZhbHNlKTtcbiAgICAgICAgICBzZWxmLnRvX2Zyb250KG1vZGFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy5tdWx0aXBsZV9vcGVuZWQpIHtcbiAgICAgICAgICBzZWxmLmhpZGUobW9kYWwsIHNldHRpbmdzLmNzcy5jbG9zZSwgc2V0dGluZ3MpO1xuICAgICAgICAgIHNlbGYudG9fZnJvbnQoJCgkLm1ha2VBcnJheShvcGVuX21vZGFscykucmV2ZXJzZSgpWzFdKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5oaWRlKG9wZW5fbW9kYWxzLCBzZXR0aW5ncy5jc3MuY2xvc2UsIHNldHRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjbG9zZV90YXJnZXRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJhc2UgPSAnLicgKyB0aGlzLnNldHRpbmdzLmRpc21pc3NfbW9kYWxfY2xhc3M7XG5cbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmNsb3NlX29uX2JhY2tncm91bmRfY2xpY2spIHtcbiAgICAgICAgcmV0dXJuIGJhc2UgKyAnLCAuJyArIHRoaXMuc2V0dGluZ3MuYmdfY2xhc3M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH0sXG5cbiAgICB0b2dnbGVfYmcgOiBmdW5jdGlvbiAobW9kYWwsIHN0YXRlKSB7XG4gICAgICBpZiAodGhpcy5TKCcuJyArIHRoaXMuc2V0dGluZ3MuYmdfY2xhc3MpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnNldHRpbmdzLmJnID0gJCgnPGRpdiAvPicsIHsnY2xhc3MnOiB0aGlzLnNldHRpbmdzLmJnX2NsYXNzfSlcbiAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKS5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB2aXNpYmxlID0gdGhpcy5zZXR0aW5ncy5iZy5maWx0ZXIoJzp2aXNpYmxlJykubGVuZ3RoID4gMDtcbiAgICAgIGlmICggc3RhdGUgIT0gdmlzaWJsZSApIHtcbiAgICAgICAgaWYgKCBzdGF0ZSA9PSB1bmRlZmluZWQgPyB2aXNpYmxlIDogIXN0YXRlICkge1xuICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLnNldHRpbmdzLmJnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3codGhpcy5zZXR0aW5ncy5iZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2hvdyA6IGZ1bmN0aW9uIChlbCwgY3NzKSB7XG4gICAgICAvLyBpcyBtb2RhbFxuICAgICAgaWYgKGNzcykge1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSBlbC5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JykgfHwgdGhpcy5zZXR0aW5ncyxcbiAgICAgICAgICAgIHJvb3RfZWxlbWVudCA9IHNldHRpbmdzLnJvb3RfZWxlbWVudCxcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuXG4gICAgICAgIGlmIChlbC5wYXJlbnQocm9vdF9lbGVtZW50KS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBlbC53cmFwKCc8ZGl2IHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiAvPicpLnBhcmVudCgpO1xuXG4gICAgICAgICAgZWwub24oJ2Nsb3NlZC5mbmR0bi5yZXZlYWwud3JhcHBlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsLmRldGFjaCgpLmFwcGVuZFRvKHBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIGVsLnVud3JhcCgpLnVuYmluZCgnY2xvc2VkLmZuZHRuLnJldmVhbC53cmFwcGVkJyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBlbC5kZXRhY2goKS5hcHBlbmRUbyhyb290X2VsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFuaW1EYXRhID0gZ2V0QW5pbWF0aW9uRGF0YShzZXR0aW5ncy5hbmltYXRpb24pO1xuICAgICAgICBpZiAoIWFuaW1EYXRhLmFuaW1hdGUpIHtcbiAgICAgICAgICB0aGlzLmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbmltRGF0YS5wb3ApIHtcbiAgICAgICAgICBjc3MudG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpIC0gZWwuZGF0YSgnb2Zmc2V0JykgKyAncHgnO1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge1xuICAgICAgICAgICAgdG9wOiAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyBlbC5kYXRhKCdjc3MtdG9wJykgKyAncHgnLFxuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgICAgICAgLmNzcyhjc3MpXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLnRyaWdnZXIoJ29wZW5lZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5pbURhdGEuZmFkZSkge1xuICAgICAgICAgIGNzcy50b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyBlbC5kYXRhKCdjc3MtdG9wJykgKyAncHgnO1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge29wYWNpdHk6IDF9O1xuXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgICAgIC5jc3MoY3NzKVxuICAgICAgICAgICAgICAuYW5pbWF0ZShlbmRfY3NzLCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQsICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBlbC50cmlnZ2VyKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICAgIH0sIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCAvIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLmNzcyhjc3MpLnNob3coKS5jc3Moe29wYWNpdHkgOiAxfSkuYWRkQ2xhc3MoJ29wZW4nKS50cmlnZ2VyKCdvcGVuZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG5cbiAgICAgIC8vIHNob3VsZCB3ZSBhbmltYXRlIHRoZSBiYWNrZ3JvdW5kP1xuICAgICAgaWYgKGdldEFuaW1hdGlvbkRhdGEoc2V0dGluZ3MuYW5pbWF0aW9uKS5mYWRlKSB7XG4gICAgICAgIHJldHVybiBlbC5mYWRlSW4oc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XG5cbiAgICAgIHJldHVybiBlbC5zaG93KCk7XG4gICAgfSxcblxuICAgIHRvX2JhY2sgOiBmdW5jdGlvbihlbCkge1xuICAgICAgZWwuYWRkQ2xhc3MoJ3RvYmFjaycpO1xuICAgIH0sXG5cbiAgICB0b19mcm9udCA6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICBlbC5yZW1vdmVDbGFzcygndG9iYWNrJyk7XG4gICAgfSxcblxuICAgIGhpZGUgOiBmdW5jdGlvbiAoZWwsIGNzcykge1xuICAgICAgLy8gaXMgbW9kYWxcbiAgICAgIGlmIChjc3MpIHtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gZWwuZGF0YSh0aGlzLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpLFxuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5ncztcblxuICAgICAgICB2YXIgYW5pbURhdGEgPSBnZXRBbmltYXRpb25EYXRhKHNldHRpbmdzLmFuaW1hdGlvbik7XG4gICAgICAgIGlmICghYW5pbURhdGEuYW5pbWF0ZSkge1xuICAgICAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFuaW1EYXRhLnBvcCkge1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge1xuICAgICAgICAgICAgdG9wOiAtICQod2luZG93KS5zY3JvbGxUb3AoKSAtIGVsLmRhdGEoJ29mZnNldCcpICsgJ3B4JyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgICAgICAgIC5hbmltYXRlKGVuZF9jc3MsIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCwgJ2xpbmVhcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGVsLmNzcyhjc3MpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgfSwgc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYW5pbURhdGEuZmFkZSkge1xuICAgICAgICAgIHZhciBlbmRfY3NzID0ge29wYWNpdHkgOiAwfTtcblxuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBlbFxuICAgICAgICAgICAgICAuYW5pbWF0ZShlbmRfY3NzLCBzZXR0aW5ncy5hbmltYXRpb25fc3BlZWQsICdsaW5lYXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5sb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBlbC5jc3MoY3NzKS50cmlnZ2VyKCdjbG9zZWQuZm5kdG4ucmV2ZWFsJyk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnb3BlbicpO1xuICAgICAgICAgIH0sIHNldHRpbmdzLmFuaW1hdGlvbl9zcGVlZCAvIDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLmhpZGUoKS5jc3MoY3NzKS5yZW1vdmVDbGFzcygnb3BlbicpLnRyaWdnZXIoJ2Nsb3NlZC5mbmR0bi5yZXZlYWwnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncztcblxuICAgICAgLy8gc2hvdWxkIHdlIGFuaW1hdGUgdGhlIGJhY2tncm91bmQ/XG4gICAgICBpZiAoZ2V0QW5pbWF0aW9uRGF0YShzZXR0aW5ncy5hbmltYXRpb24pLmZhZGUpIHtcbiAgICAgICAgcmV0dXJuIGVsLmZhZGVPdXQoc2V0dGluZ3MuYW5pbWF0aW9uX3NwZWVkIC8gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbC5oaWRlKCk7XG4gICAgfSxcblxuICAgIGNsb3NlX3ZpZGVvIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB2aWRlbyA9ICQoJy5mbGV4LXZpZGVvJywgZS50YXJnZXQpLFxuICAgICAgICAgIGlmcmFtZSA9ICQoJ2lmcmFtZScsIHZpZGVvKTtcblxuICAgICAgaWYgKGlmcmFtZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmcmFtZS5hdHRyKCdkYXRhLXNyYycsIGlmcmFtZVswXS5zcmMpO1xuICAgICAgICBpZnJhbWUuYXR0cignc3JjJywgaWZyYW1lLmF0dHIoJ3NyYycpKTtcbiAgICAgICAgdmlkZW8uaGlkZSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBvcGVuX3ZpZGVvIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciB2aWRlbyA9ICQoJy5mbGV4LXZpZGVvJywgZS50YXJnZXQpLFxuICAgICAgICAgIGlmcmFtZSA9IHZpZGVvLmZpbmQoJ2lmcmFtZScpO1xuXG4gICAgICBpZiAoaWZyYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGRhdGFfc3JjID0gaWZyYW1lLmF0dHIoJ2RhdGEtc3JjJyk7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YV9zcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWZyYW1lWzBdLnNyYyA9IGlmcmFtZS5hdHRyKCdkYXRhLXNyYycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzcmMgPSBpZnJhbWVbMF0uc3JjO1xuICAgICAgICAgIGlmcmFtZVswXS5zcmMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaWZyYW1lWzBdLnNyYyA9IHNyYztcbiAgICAgICAgfVxuICAgICAgICB2aWRlby5zaG93KCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRhdGFfYXR0ciA6IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgIGlmICh0aGlzLm5hbWVzcGFjZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5hbWVzcGFjZSArICctJyArIHN0cjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgY2FjaGVfb2Zmc2V0IDogZnVuY3Rpb24gKG1vZGFsKSB7XG4gICAgICB2YXIgb2Zmc2V0ID0gbW9kYWwuc2hvdygpLmhlaWdodCgpICsgcGFyc2VJbnQobW9kYWwuY3NzKCd0b3AnKSwgMTApICsgbW9kYWwuc2Nyb2xsWTtcblxuICAgICAgbW9kYWwuaGlkZSgpO1xuXG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAkKHRoaXMuc2NvcGUpLm9mZignLmZuZHRuLnJldmVhbCcpO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xuXG4gIC8qXG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ3BvcEFuZEZhZGUnKSAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogdHJ1ZSwgIGZhZGU6IHRydWV9XG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ2ZhZGUnKSAgICAgICAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogZmFsc2UsIGZhZGU6IHRydWV9XG4gICAqIGdldEFuaW1hdGlvbkRhdGEoJ3BvcCcpICAgICAgICAvLyB7YW5pbWF0ZTogdHJ1ZSwgIHBvcDogdHJ1ZSwgIGZhZGU6IGZhbHNlfVxuICAgKiBnZXRBbmltYXRpb25EYXRhKCdmb28nKSAgICAgICAgLy8ge2FuaW1hdGU6IGZhbHNlLCBwb3A6IGZhbHNlLCBmYWRlOiBmYWxzZX1cbiAgICogZ2V0QW5pbWF0aW9uRGF0YShudWxsKSAgICAgICAgIC8vIHthbmltYXRlOiBmYWxzZSwgcG9wOiBmYWxzZSwgZmFkZTogZmFsc2V9XG4gICAqL1xuICBmdW5jdGlvbiBnZXRBbmltYXRpb25EYXRhKHN0cikge1xuICAgIHZhciBmYWRlID0gL2ZhZGUvaS50ZXN0KHN0cik7XG4gICAgdmFyIHBvcCA9IC9wb3AvaS50ZXN0KHN0cik7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFuaW1hdGUgOiBmYWRlIHx8IHBvcCxcbiAgICAgIHBvcCA6IHBvcCxcbiAgICAgIGZhZGUgOiBmYWRlXG4gICAgfTtcbiAgfVxufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG5cbjsoZnVuY3Rpb24gKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgRm91bmRhdGlvbi5saWJzLnNsaWRlciA9IHtcbiAgICBuYW1lIDogJ3NsaWRlcicsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgc3RhcnQgOiAwLFxuICAgICAgZW5kIDogMTAwLFxuICAgICAgc3RlcCA6IDEsXG4gICAgICBwcmVjaXNpb24gOiBudWxsLFxuICAgICAgaW5pdGlhbCA6IG51bGwsXG4gICAgICBkaXNwbGF5X3NlbGVjdG9yIDogJycsXG4gICAgICB2ZXJ0aWNhbCA6IGZhbHNlLFxuICAgICAgdHJpZ2dlcl9pbnB1dF9jaGFuZ2UgOiBmYWxzZSxcbiAgICAgIG9uX2NoYW5nZSA6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAndGhyb3R0bGUnKTtcbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgJCh0aGlzLnNjb3BlKVxuICAgICAgICAub2ZmKCcuc2xpZGVyJylcbiAgICAgICAgLm9uKCdtb3VzZWRvd24uZm5kdG4uc2xpZGVyIHRvdWNoc3RhcnQuZm5kdG4uc2xpZGVyIHBvaW50ZXJkb3duLmZuZHRuLnNsaWRlcicsXG4gICAgICAgICdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXTpub3QoLmRpc2FibGVkLCBbZGlzYWJsZWRdKSAucmFuZ2Utc2xpZGVyLWhhbmRsZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKCFzZWxmLmNhY2hlLmFjdGl2ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VsZi5zZXRfYWN0aXZlX3NsaWRlcigkKGUudGFyZ2V0KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNlbW92ZS5mbmR0bi5zbGlkZXIgdG91Y2htb3ZlLmZuZHRuLnNsaWRlciBwb2ludGVybW92ZS5mbmR0bi5zbGlkZXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICghIXNlbGYuY2FjaGUuYWN0aXZlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoJC5kYXRhKHNlbGYuY2FjaGUuYWN0aXZlWzBdLCAnc2V0dGluZ3MnKS52ZXJ0aWNhbCkge1xuICAgICAgICAgICAgICB2YXIgc2Nyb2xsX29mZnNldCA9IDA7XG4gICAgICAgICAgICAgIGlmICghZS5wYWdlWSkge1xuICAgICAgICAgICAgICAgIHNjcm9sbF9vZmZzZXQgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZWxmLmNhbGN1bGF0ZV9wb3NpdGlvbihzZWxmLmNhY2hlLmFjdGl2ZSwgc2VsZi5nZXRfY3Vyc29yX3Bvc2l0aW9uKGUsICd5JykgKyBzY3JvbGxfb2Zmc2V0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHNlbGYuY2FsY3VsYXRlX3Bvc2l0aW9uKHNlbGYuY2FjaGUuYWN0aXZlLCBzZWxmLmdldF9jdXJzb3JfcG9zaXRpb24oZSwgJ3gnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ21vdXNldXAuZm5kdG4uc2xpZGVyIHRvdWNoZW5kLmZuZHRuLnNsaWRlciBwb2ludGVydXAuZm5kdG4uc2xpZGVyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZV9hY3RpdmVfc2xpZGVyKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2hhbmdlLmZuZHRuLnNsaWRlcicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgc2VsZi5zZXR0aW5ncy5vbl9jaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIHNlbGYuUyh3aW5kb3cpXG4gICAgICAgIC5vbigncmVzaXplLmZuZHRuLnNsaWRlcicsIHNlbGYudGhyb3R0bGUoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLnJlZmxvdygpO1xuICAgICAgICB9LCAzMDApKTtcblxuICAgICAgLy8gdXBkYXRlIHNsaWRlciB2YWx1ZSBhcyB1c2VycyBjaGFuZ2UgaW5wdXQgdmFsdWVcbiAgICAgIHRoaXMuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNsaWRlciA9ICQodGhpcyksXG4gICAgICAgICAgICBoYW5kbGUgPSBzbGlkZXIuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJylbMF0sXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNlbGYuaW5pdGlhbGl6ZV9zZXR0aW5ncyhoYW5kbGUpO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yICE9ICcnKSB7XG4gICAgICAgICAgJChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKSkge1xuICAgICAgICAgICAgICAkKHRoaXMpLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8vIGlzIHRoZXJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzP1xuICAgICAgICAgICAgICAgIHNsaWRlci5mb3VuZGF0aW9uKFwic2xpZGVyXCIsIFwic2V0X3ZhbHVlXCIsICQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldF9jdXJzb3JfcG9zaXRpb24gOiBmdW5jdGlvbiAoZSwgeHkpIHtcbiAgICAgIHZhciBwYWdlWFkgPSAncGFnZScgKyB4eS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIGNsaWVudFhZID0gJ2NsaWVudCcgKyB4eS50b1VwcGVyQ2FzZSgpLFxuICAgICAgICAgIHBvc2l0aW9uO1xuXG4gICAgICBpZiAodHlwZW9mIGVbcGFnZVhZXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcG9zaXRpb24gPSBlW3BhZ2VYWV07XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBlLm9yaWdpbmFsRXZlbnRbY2xpZW50WFldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwb3NpdGlvbiA9IGUub3JpZ2luYWxFdmVudFtjbGllbnRYWV07XG4gICAgICB9IGVsc2UgaWYgKGUub3JpZ2luYWxFdmVudC50b3VjaGVzICYmIGUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdICYmIHR5cGVvZiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXVtjbGllbnRYWV0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBvc2l0aW9uID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF1bY2xpZW50WFldO1xuICAgICAgfSBlbHNlIGlmIChlLmN1cnJlbnRQb2ludCAmJiB0eXBlb2YgZS5jdXJyZW50UG9pbnRbeHldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwb3NpdGlvbiA9IGUuY3VycmVudFBvaW50W3h5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvc2l0aW9uO1xuICAgIH0sXG5cbiAgICBzZXRfYWN0aXZlX3NsaWRlciA6IGZ1bmN0aW9uICgkaGFuZGxlKSB7XG4gICAgICB0aGlzLmNhY2hlLmFjdGl2ZSA9ICRoYW5kbGU7XG4gICAgfSxcblxuICAgIHJlbW92ZV9hY3RpdmVfc2xpZGVyIDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jYWNoZS5hY3RpdmUgPSBudWxsO1xuICAgIH0sXG5cbiAgICBjYWxjdWxhdGVfcG9zaXRpb24gOiBmdW5jdGlvbiAoJGhhbmRsZSwgY3Vyc29yX3gpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnc2V0dGluZ3MnKSxcbiAgICAgICAgICBoYW5kbGVfbCA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnaGFuZGxlX2wnKSxcbiAgICAgICAgICBoYW5kbGVfbyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnaGFuZGxlX28nKSxcbiAgICAgICAgICBiYXJfbCA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnYmFyX2wnKSxcbiAgICAgICAgICBiYXJfbyA9ICQuZGF0YSgkaGFuZGxlWzBdLCAnYmFyX28nKTtcblxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBjdDtcblxuICAgICAgICBpZiAoRm91bmRhdGlvbi5ydGwgJiYgIXNldHRpbmdzLnZlcnRpY2FsKSB7XG4gICAgICAgICAgcGN0ID0gc2VsZi5saW1pdF90bygoKGJhcl9vICsgYmFyX2wgLSBjdXJzb3JfeCkgLyBiYXJfbCksIDAsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBjdCA9IHNlbGYubGltaXRfdG8oKChjdXJzb3JfeCAtIGJhcl9vKSAvIGJhcl9sKSwgMCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICBwY3QgPSBzZXR0aW5ncy52ZXJ0aWNhbCA/IDEgLSBwY3QgOiBwY3Q7XG5cbiAgICAgICAgdmFyIG5vcm0gPSBzZWxmLm5vcm1hbGl6ZWRfdmFsdWUocGN0LCBzZXR0aW5ncy5zdGFydCwgc2V0dGluZ3MuZW5kLCBzZXR0aW5ncy5zdGVwLCBzZXR0aW5ncy5wcmVjaXNpb24pO1xuXG4gICAgICAgIHNlbGYuc2V0X3VpKCRoYW5kbGUsIG5vcm0pO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHNldF91aSA6IGZ1bmN0aW9uICgkaGFuZGxlLCB2YWx1ZSkge1xuICAgICAgdmFyIHNldHRpbmdzID0gJC5kYXRhKCRoYW5kbGVbMF0sICdzZXR0aW5ncycpLFxuICAgICAgICAgIGhhbmRsZV9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdoYW5kbGVfbCcpLFxuICAgICAgICAgIGJhcl9sID0gJC5kYXRhKCRoYW5kbGVbMF0sICdiYXJfbCcpLFxuICAgICAgICAgIG5vcm1fcGN0ID0gdGhpcy5ub3JtYWxpemVkX3BlcmNlbnRhZ2UodmFsdWUsIHNldHRpbmdzLnN0YXJ0LCBzZXR0aW5ncy5lbmQpLFxuICAgICAgICAgIGhhbmRsZV9vZmZzZXQgPSBub3JtX3BjdCAqIChiYXJfbCAtIGhhbmRsZV9sKSAtIDEsXG4gICAgICAgICAgcHJvZ3Jlc3NfYmFyX2xlbmd0aCA9IG5vcm1fcGN0ICogMTAwLFxuICAgICAgICAgICRoYW5kbGVfcGFyZW50ID0gJGhhbmRsZS5wYXJlbnQoKSxcbiAgICAgICAgICAkaGlkZGVuX2lucHV0cyA9ICRoYW5kbGUucGFyZW50KCkuY2hpbGRyZW4oJ2lucHV0W3R5cGU9aGlkZGVuXScpO1xuXG4gICAgICBpZiAoRm91bmRhdGlvbi5ydGwgJiYgIXNldHRpbmdzLnZlcnRpY2FsKSB7XG4gICAgICAgIGhhbmRsZV9vZmZzZXQgPSAtaGFuZGxlX29mZnNldDtcbiAgICAgIH1cblxuICAgICAgaGFuZGxlX29mZnNldCA9IHNldHRpbmdzLnZlcnRpY2FsID8gLWhhbmRsZV9vZmZzZXQgKyBiYXJfbCAtIGhhbmRsZV9sICsgMSA6IGhhbmRsZV9vZmZzZXQ7XG4gICAgICB0aGlzLnNldF90cmFuc2xhdGUoJGhhbmRsZSwgaGFuZGxlX29mZnNldCwgc2V0dGluZ3MudmVydGljYWwpO1xuXG4gICAgICBpZiAoc2V0dGluZ3MudmVydGljYWwpIHtcbiAgICAgICAgJGhhbmRsZS5zaWJsaW5ncygnLnJhbmdlLXNsaWRlci1hY3RpdmUtc2VnbWVudCcpLmNzcygnaGVpZ2h0JywgcHJvZ3Jlc3NfYmFyX2xlbmd0aCArICclJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkaGFuZGxlLnNpYmxpbmdzKCcucmFuZ2Utc2xpZGVyLWFjdGl2ZS1zZWdtZW50JykuY3NzKCd3aWR0aCcsIHByb2dyZXNzX2Jhcl9sZW5ndGggKyAnJScpO1xuICAgICAgfVxuXG4gICAgICAkaGFuZGxlX3BhcmVudC5hdHRyKHRoaXMuYXR0cl9uYW1lKCksIHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UuZm5kdG4uc2xpZGVyJyk7XG5cbiAgICAgICRoaWRkZW5faW5wdXRzLnZhbCh2YWx1ZSk7XG4gICAgICBpZiAoc2V0dGluZ3MudHJpZ2dlcl9pbnB1dF9jaGFuZ2UpIHtcbiAgICAgICAgICAkaGlkZGVuX2lucHV0cy50cmlnZ2VyKCdjaGFuZ2UuZm5kdG4uc2xpZGVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghJGhhbmRsZVswXS5oYXNBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nKSkge1xuICAgICAgICAkaGFuZGxlLmF0dHIoe1xuICAgICAgICAgICdhcmlhLXZhbHVlbWluJyA6IHNldHRpbmdzLnN0YXJ0LFxuICAgICAgICAgICdhcmlhLXZhbHVlbWF4JyA6IHNldHRpbmdzLmVuZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgICRoYW5kbGUuYXR0cignYXJpYS12YWx1ZW5vdycsIHZhbHVlKTtcblxuICAgICAgaWYgKHNldHRpbmdzLmRpc3BsYXlfc2VsZWN0b3IgIT0gJycpIHtcbiAgICAgICAgJChzZXR0aW5ncy5kaXNwbGF5X3NlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAodGhpcy5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykpIHtcbiAgICAgICAgICAgICQodGhpcykudmFsKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCh0aGlzKS50ZXh0KHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWRfcGVyY2VudGFnZSA6IGZ1bmN0aW9uICh2YWwsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbigxLCAodmFsIC0gc3RhcnQpIC8gKGVuZCAtIHN0YXJ0KSk7XG4gICAgfSxcblxuICAgIG5vcm1hbGl6ZWRfdmFsdWUgOiBmdW5jdGlvbiAodmFsLCBzdGFydCwgZW5kLCBzdGVwLCBwcmVjaXNpb24pIHtcbiAgICAgIHZhciByYW5nZSA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICAgIHBvaW50ID0gdmFsICogcmFuZ2UsXG4gICAgICAgICAgbW9kID0gKHBvaW50IC0gKHBvaW50ICUgc3RlcCkpIC8gc3RlcCxcbiAgICAgICAgICByZW0gPSBwb2ludCAlIHN0ZXAsXG4gICAgICAgICAgcm91bmQgPSAoIHJlbSA+PSBzdGVwICogMC41ID8gc3RlcCA6IDApO1xuICAgICAgcmV0dXJuICgobW9kICogc3RlcCArIHJvdW5kKSArIHN0YXJ0KS50b0ZpeGVkKHByZWNpc2lvbik7XG4gICAgfSxcblxuICAgIHNldF90cmFuc2xhdGUgOiBmdW5jdGlvbiAoZWxlLCBvZmZzZXQsIHZlcnRpY2FsKSB7XG4gICAgICBpZiAodmVydGljYWwpIHtcbiAgICAgICAgJChlbGUpXG4gICAgICAgICAgLmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1vei10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW1zLXRyYW5zZm9ybScsICd0cmFuc2xhdGVZKCcgKyBvZmZzZXQgKyAncHgpJylcbiAgICAgICAgICAuY3NzKCctby10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWSgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVkoJyArIG9mZnNldCArICdweCknKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZWxlKVxuICAgICAgICAgIC5jc3MoJy13ZWJraXQtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJy1tcy10cmFuc2Zvcm0nLCAndHJhbnNsYXRlWCgnICsgb2Zmc2V0ICsgJ3B4KScpXG4gICAgICAgICAgLmNzcygnLW8tdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZVgoJyArIG9mZnNldCArICdweCknKVxuICAgICAgICAgIC5jc3MoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGVYKCcgKyBvZmZzZXQgKyAncHgpJyk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGxpbWl0X3RvIDogZnVuY3Rpb24gKHZhbCwgbWluLCBtYXgpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWwsIG1pbiksIG1heCk7XG4gICAgfSxcblxuICAgIGluaXRpYWxpemVfc2V0dGluZ3MgOiBmdW5jdGlvbiAoaGFuZGxlKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJChoYW5kbGUpLnBhcmVudCgpKSksXG4gICAgICAgICAgZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0O1xuXG4gICAgICBpZiAoc2V0dGluZ3MucHJlY2lzaW9uID09PSBudWxsKSB7XG4gICAgICAgIGRlY2ltYWxfcGxhY2VzX21hdGNoX3Jlc3VsdCA9ICgnJyArIHNldHRpbmdzLnN0ZXApLm1hdGNoKC9cXC4oW1xcZF0qKS8pO1xuICAgICAgICBzZXR0aW5ncy5wcmVjaXNpb24gPSBkZWNpbWFsX3BsYWNlc19tYXRjaF9yZXN1bHQgJiYgZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0WzFdID8gZGVjaW1hbF9wbGFjZXNfbWF0Y2hfcmVzdWx0WzFdLmxlbmd0aCA6IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy52ZXJ0aWNhbCkge1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX28nLCAkKGhhbmRsZSkucGFyZW50KCkub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2Jhcl9sJywgJChoYW5kbGUpLnBhcmVudCgpLm91dGVySGVpZ2h0KCkpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX28nLCAkKGhhbmRsZSkub2Zmc2V0KCkudG9wKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2hhbmRsZV9sJywgJChoYW5kbGUpLm91dGVySGVpZ2h0KCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2Jhcl9vJywgJChoYW5kbGUpLnBhcmVudCgpLm9mZnNldCgpLmxlZnQpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnYmFyX2wnLCAkKGhhbmRsZSkucGFyZW50KCkub3V0ZXJXaWR0aCgpKTtcbiAgICAgICAgJC5kYXRhKGhhbmRsZSwgJ2hhbmRsZV9vJywgJChoYW5kbGUpLm9mZnNldCgpLmxlZnQpO1xuICAgICAgICAkLmRhdGEoaGFuZGxlLCAnaGFuZGxlX2wnLCAkKGhhbmRsZSkub3V0ZXJXaWR0aCgpKTtcbiAgICAgIH1cblxuICAgICAgJC5kYXRhKGhhbmRsZSwgJ2JhcicsICQoaGFuZGxlKS5wYXJlbnQoKSk7XG4gICAgICByZXR1cm4gJC5kYXRhKGhhbmRsZSwgJ3NldHRpbmdzJywgc2V0dGluZ3MpO1xuICAgIH0sXG5cbiAgICBzZXRfaW5pdGlhbF9wb3NpdGlvbiA6IGZ1bmN0aW9uICgkZWxlKSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmRhdGEoJGVsZS5jaGlsZHJlbignLnJhbmdlLXNsaWRlci1oYW5kbGUnKVswXSwgJ3NldHRpbmdzJyksXG4gICAgICAgICAgaW5pdGlhbCA9ICgodHlwZW9mIHNldHRpbmdzLmluaXRpYWwgPT0gJ251bWJlcicgJiYgIWlzTmFOKHNldHRpbmdzLmluaXRpYWwpKSA/IHNldHRpbmdzLmluaXRpYWwgOiBNYXRoLmZsb29yKChzZXR0aW5ncy5lbmQgLSBzZXR0aW5ncy5zdGFydCkgKiAwLjUgLyBzZXR0aW5ncy5zdGVwKSAqIHNldHRpbmdzLnN0ZXAgKyBzZXR0aW5ncy5zdGFydCksXG4gICAgICAgICAgJGhhbmRsZSA9ICRlbGUuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJyk7XG4gICAgICB0aGlzLnNldF91aSgkaGFuZGxlLCBpbml0aWFsKTtcbiAgICB9LFxuXG4gICAgc2V0X3ZhbHVlIDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICBpZiAoISEkKHRoaXMuc2NvcGUpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSkpIHtcbiAgICAgICAgJCh0aGlzLnNjb3BlKS5hdHRyKHNlbGYuYXR0cl9uYW1lKCksIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHNlbGYucmVmbG93KCk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHNlbGYuUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGhhbmRsZSA9ICQodGhpcykuY2hpbGRyZW4oJy5yYW5nZS1zbGlkZXItaGFuZGxlJylbMF0sXG4gICAgICAgICAgICB2YWwgPSAkKHRoaXMpLmF0dHIoc2VsZi5hdHRyX25hbWUoKSk7XG4gICAgICAgIHNlbGYuaW5pdGlhbGl6ZV9zZXR0aW5ncyhoYW5kbGUpO1xuXG4gICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICBzZWxmLnNldF91aSgkKGhhbmRsZSksIHBhcnNlRmxvYXQodmFsKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5zZXRfaW5pdGlhbF9wb3NpdGlvbigkKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMudGFiID0ge1xuICAgIG5hbWUgOiAndGFiJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBhY3RpdmVfY2xhc3MgOiAnYWN0aXZlJyxcbiAgICAgIGNhbGxiYWNrIDogZnVuY3Rpb24gKCkge30sXG4gICAgICBkZWVwX2xpbmtpbmcgOiBmYWxzZSxcbiAgICAgIHNjcm9sbF90b19jb250ZW50IDogdHJ1ZSxcbiAgICAgIGlzX2hvdmVyIDogZmFsc2VcbiAgICB9LFxuXG4gICAgZGVmYXVsdF90YWJfaGFzaGVzIDogW10sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gdGhpcy5TO1xuXG5cdCAgLy8gU3RvcmUgdGhlIGRlZmF1bHQgYWN0aXZlIHRhYnMgd2hpY2ggd2lsbCBiZSByZWZlcmVuY2VkIHdoZW4gdGhlXG5cdCAgLy8gbG9jYXRpb24gaGFzaCBpcyBhYnNlbnQsIGFzIGluIHRoZSBjYXNlIG9mIG5hdmlnYXRpbmcgdGhlIHRhYnMgYW5kXG5cdCAgLy8gcmV0dXJuaW5nIHRvIHRoZSBmaXJzdCB2aWV3aW5nIHZpYSB0aGUgYnJvd3NlciBCYWNrIGJ1dHRvbi5cblx0ICBTKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSA+IC5hY3RpdmUgPiBhJywgdGhpcy5zY29wZSkuZWFjaChmdW5jdGlvbiAoKSB7XG5cdCAgICBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5wdXNoKHRoaXMuaGFzaCk7XG5cdCAgfSk7XG5cbiAgICAgIC8vIHN0b3JlIHRoZSBpbml0aWFsIGhyZWYsIHdoaWNoIGlzIHVzZWQgdG8gYWxsb3cgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlXG4gICAgICAvLyBicm93c2VyIGJhY2sgYnV0dG9uIHdoZW4gZGVlcCBsaW5raW5nIGlzIHR1cm5lZCBvbi5cbiAgICAgIHNlbGYuZW50cnlfbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5oYW5kbGVfbG9jYXRpb25faGFzaF9jaGFuZ2UoKTtcbiAgICB9LFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgIHZhciB1c3VhbF90YWJfYmVoYXZpb3IgPSAgZnVuY3Rpb24gKGUsIHRhcmdldCkge1xuICAgICAgICAgIHZhciBzZXR0aW5ncyA9IFModGFyZ2V0KS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmlzX2hvdmVyIHx8IE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0YXJnZXQpLnBhcmVudCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRhYicpXG4gICAgICAgIC8vIEtleSBldmVudDogZm9jdXMvdGFiIGtleVxuICAgICAgICAub24oJ2tleWRvd24uZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgICAgICAgICAgLy8gaWYgdXNlciBwcmVzc2VkIHRhYiBrZXlcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09IDkpIHsgXG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgLy8gVE9ETzogQ2hhbmdlIHVzdWFsX3RhYl9iZWhhdmlvciBpbnRvIGFjY2Vzc2liaWxpdHkgZnVuY3Rpb24/XG4gICAgICAgICAgICAgIHVzdWFsX3RhYl9iZWhhdmlvcihlLCBlbCk7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9KVxuICAgICAgICAvLyBDbGljayBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udGFiJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddID4gKiA+IGEnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGVsID0gdGhpcztcbiAgICAgICAgICB1c3VhbF90YWJfYmVoYXZpb3IoZSwgZWwpO1xuICAgICAgICB9KVxuICAgICAgICAvLyBIb3ZlciBldmVudDogdGFiIHRpdGxlXG4gICAgICAgIC5vbignbW91c2VlbnRlci5mbmR0bi50YWInLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKTtcbiAgICAgICAgICBpZiAoc2V0dGluZ3MuaXNfaG92ZXIpIHtcbiAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoUyh0aGlzKS5wYXJlbnQoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gTG9jYXRpb24gaGFzaCBjaGFuZ2UgZXZlbnRcbiAgICAgIFMod2luZG93KS5vbignaGFzaGNoYW5nZS5mbmR0bi50YWInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlbGYuaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlKCk7XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaGFuZGxlX2xvY2F0aW9uX2hhc2hfY2hhbmdlIDogZnVuY3Rpb24gKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgUyA9IHRoaXMuUztcblxuICAgICAgUygnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nLCB0aGlzLnNjb3BlKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNldHRpbmdzID0gUyh0aGlzKS5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5kZWVwX2xpbmtpbmcpIHtcbiAgICAgICAgICAvLyBNYXRjaCB0aGUgbG9jYXRpb24gaGFzaCB0byBhIGxhYmVsXG4gICAgICAgICAgdmFyIGhhc2g7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBwcmVmaXggdGhlIGhhc2ggdG8gcHJldmVudCBhbmNob3Igc2Nyb2xsaW5nXG4gICAgICAgICAgICBoYXNoID0gc2VsZi5zY29wZS5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJ2ZuZHRuLScsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhc2ggIT0gJycpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGxvY2F0aW9uIGhhc2ggcmVmZXJlbmNlcyBhIHRhYiBjb250ZW50IGRpdiBvclxuICAgICAgICAgICAgLy8gYW5vdGhlciBlbGVtZW50IG9uIHRoZSBwYWdlIChpbnNpZGUgb3Igb3V0c2lkZSB0aGUgdGFiIGNvbnRlbnQgZGl2KVxuICAgICAgICAgICAgdmFyIGhhc2hfZWxlbWVudCA9IFMoaGFzaCk7XG4gICAgICAgICAgICBpZiAoaGFzaF9lbGVtZW50Lmhhc0NsYXNzKCdjb250ZW50JykgJiYgaGFzaF9lbGVtZW50LnBhcmVudCgpLmhhc0NsYXNzKCd0YWJzLWNvbnRlbnQnKSkge1xuICAgICAgICAgICAgICAvLyBUYWIgY29udGVudCBkaXZcbiAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9JyArIGhhc2ggKyAnXScpLnBhcmVudCgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIE5vdCB0aGUgdGFiIGNvbnRlbnQgZGl2LiBJZiBpbnNpZGUgdGhlIHRhYiBjb250ZW50LCBmaW5kIHRoZVxuICAgICAgICAgICAgICAvLyBjb250YWluaW5nIHRhYiBhbmQgdG9nZ2xlIGl0IGFzIGFjdGl2ZS5cbiAgICAgICAgICAgICAgdmFyIGhhc2hfdGFiX2NvbnRhaW5lcl9pZCA9IGhhc2hfZWxlbWVudC5jbG9zZXN0KCcuY29udGVudCcpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgIGlmIChoYXNoX3RhYl9jb250YWluZXJfaWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVfYWN0aXZlX3RhYigkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSA+ICogPiBhW2hyZWY9IycgKyBoYXNoX3RhYl9jb250YWluZXJfaWQgKyAnXScpLnBhcmVudCgpLCBoYXNoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZWZlcmVuY2UgdGhlIGRlZmF1bHQgdGFiIGhhc2hlcyB3aGljaCB3ZXJlIGluaXRpYWxpemVkIGluIHRoZSBpbml0IGZ1bmN0aW9uXG4gICAgICAgICAgICBmb3IgKHZhciBpbmQgPSAwOyBpbmQgPCBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlcy5sZW5ndGg7IGluZCsrKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlX2FjdGl2ZV90YWIoJCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10gPiAqID4gYVtocmVmPScgKyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1tpbmRdICsgJ10nKS5wYXJlbnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgfSk7XG4gICAgIH0sXG5cbiAgICB0b2dnbGVfYWN0aXZlX3RhYiA6IGZ1bmN0aW9uICh0YWIsIGxvY2F0aW9uX2hhc2gpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBTID0gc2VsZi5TLFxuICAgICAgICAgIHRhYnMgPSB0YWIuY2xvc2VzdCgnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICB0YWJfbGluayA9IHRhYi5maW5kKCdhJyksXG4gICAgICAgICAgYW5jaG9yID0gdGFiLmNoaWxkcmVuKCdhJykuZmlyc3QoKSxcbiAgICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5hdHRyKCdocmVmJykuc3BsaXQoJyMnKVsxXSxcbiAgICAgICAgICB0YXJnZXQgPSBTKHRhcmdldF9oYXNoKSxcbiAgICAgICAgICBzaWJsaW5ncyA9IHRhYi5zaWJsaW5ncygpLFxuICAgICAgICAgIHNldHRpbmdzID0gdGFicy5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBMaWdodCBtb2RpZmljYXRpb24gb2YgSGV5ZG9uIFBpY2tlcmluZydzIFByYWN0aWNhbCBBUklBIEV4YW1wbGVzOiBodHRwOi8vaGV5ZG9ud29ya3MuY29tL3ByYWN0aWNhbF9hcmlhX2V4YW1wbGVzL2pzL2ExMXkuanNcblxuICAgICAgICAgICAgLy8gZGVmaW5lIGN1cnJlbnQsIHByZXZpb3VzIGFuZCBuZXh0IChwb3NzaWJsZSkgdGFic1xuXG4gICAgICAgICAgICB2YXIgJG9yaWdpbmFsID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciAkcHJldiA9ICQodGhpcykucGFyZW50cygnbGknKS5wcmV2KCkuY2hpbGRyZW4oJ1tyb2xlPVwidGFiXCJdJyk7XG4gICAgICAgICAgICB2YXIgJG5leHQgPSAkKHRoaXMpLnBhcmVudHMoJ2xpJykubmV4dCgpLmNoaWxkcmVuKCdbcm9sZT1cInRhYlwiXScpO1xuICAgICAgICAgICAgdmFyICR0YXJnZXQ7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgdGhlIGRpcmVjdGlvbiAocHJldiBvciBuZXh0KVxuXG4gICAgICAgICAgICBzd2l0Y2ggKGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkcHJldjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAzOTpcbiAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJG5leHQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgJHRhcmdldCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICRvcmlnaW5hbC5hdHRyKHtcbiAgICAgICAgICAgICAgICAndGFiaW5kZXgnIDogJy0xJyxcbiAgICAgICAgICAgICAgICAnYXJpYS1zZWxlY3RlZCcgOiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoe1xuICAgICAgICAgICAgICAgICd0YWJpbmRleCcgOiAnMCcsXG4gICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnIDogdHJ1ZVxuICAgICAgICAgICAgICB9KS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIaWRlIHBhbmVsc1xuXG4gICAgICAgICAgICAkKCdbcm9sZT1cInRhYnBhbmVsXCJdJylcbiAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgLy8gU2hvdyBwYW5lbCB3aGljaCBjb3JyZXNwb25kcyB0byB0YXJnZXRcblxuICAgICAgICAgICAgJCgnIycgKyAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmF0dHIoJ2hyZWYnKS5zdWJzdHJpbmcoMSkpXG4gICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIG51bGwpO1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnb190b19oYXNoID0gZnVuY3Rpb24oaGFzaCkge1xuICAgICAgICAgICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgY29ycmVjdCBiZWhhdmlvdXIgb2YgdGhlIGJyb3dzZXIncyBiYWNrIGJ1dHRvbiB3aGVuIGRlZXAgbGlua2luZyBpcyBlbmFibGVkLiBXaXRob3V0IGl0XG4gICAgICAgICAgICAvLyB0aGUgdXNlciB3b3VsZCBnZXQgY29udGludWFsbHkgcmVkaXJlY3RlZCB0byB0aGUgZGVmYXVsdCBoYXNoLlxuICAgICAgICAgICAgdmFyIGlzX2VudHJ5X2xvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWYgPT09IHNlbGYuZW50cnlfbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgZGVmYXVsdF9oYXNoID0gc2V0dGluZ3Muc2Nyb2xsX3RvX2NvbnRlbnQgPyBzZWxmLmRlZmF1bHRfdGFiX2hhc2hlc1swXSA6IGlzX2VudHJ5X2xvY2F0aW9uID8gd2luZG93LmxvY2F0aW9uLmhhc2ggOidmbmR0bi0nICsgc2VsZi5kZWZhdWx0X3RhYl9oYXNoZXNbMF0ucmVwbGFjZSgnIycsICcnKVxuXG4gICAgICAgICAgICBpZiAoIShpc19lbnRyeV9sb2NhdGlvbiAmJiBoYXNoID09PSBkZWZhdWx0X2hhc2gpKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gaGFzaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAvLyBhbGxvdyB1c2FnZSBvZiBkYXRhLXRhYi1jb250ZW50IGF0dHJpYnV0ZSBpbnN0ZWFkIG9mIGhyZWZcbiAgICAgIGlmIChhbmNob3IuZGF0YSgndGFiLWNvbnRlbnQnKSkge1xuICAgICAgICB0YXJnZXRfaGFzaCA9ICcjJyArIGFuY2hvci5kYXRhKCd0YWItY29udGVudCcpLnNwbGl0KCcjJylbMV07XG4gICAgICAgIHRhcmdldCA9IFModGFyZ2V0X2hhc2gpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2V0dGluZ3MuZGVlcF9saW5raW5nKSB7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbF90b19jb250ZW50KSB7XG5cbiAgICAgICAgICAvLyByZXRhaW4gY3VycmVudCBoYXNoIHRvIHNjcm9sbCB0byBjb250ZW50XG4gICAgICAgICAgZ29fdG9faGFzaChsb2NhdGlvbl9oYXNoIHx8IHRhcmdldF9oYXNoKTtcblxuICAgICAgICAgIGlmIChsb2NhdGlvbl9oYXNoID09IHVuZGVmaW5lZCB8fCBsb2NhdGlvbl9oYXNoID09IHRhcmdldF9oYXNoKSB7XG4gICAgICAgICAgICB0YWIucGFyZW50KClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUyh0YXJnZXRfaGFzaClbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcHJlZml4IHRoZSBoYXNoZXMgc28gdGhhdCB0aGUgYnJvd3NlciBkb2Vzbid0IHNjcm9sbCBkb3duXG4gICAgICAgICAgaWYgKGxvY2F0aW9uX2hhc2ggIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb190b19oYXNoKCdmbmR0bi0nICsgbG9jYXRpb25faGFzaC5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ29fdG9faGFzaCgnZm5kdG4tJyArIHRhcmdldF9oYXNoLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBXQVJOSU5HOiBUaGUgYWN0aXZhdGlvbiBhbmQgZGVhY3RpdmF0aW9uIG9mIHRoZSB0YWIgY29udGVudCBtdXN0XG4gICAgICAvLyBvY2N1ciBhZnRlciB0aGUgZGVlcCBsaW5raW5nIGluIG9yZGVyIHRvIHByb3Blcmx5IHJlZnJlc2ggdGhlIGJyb3dzZXJcbiAgICAgIC8vIHdpbmRvdyAobm90YWJseSBpbiBDaHJvbWUpLlxuICAgICAgLy8gQ2xlYW4gdXAgbXVsdGlwbGUgYXR0ciBpbnN0YW5jZXMgdG8gZG9uZSBvbmNlXG4gICAgICB0YWIuYWRkQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS50cmlnZ2VySGFuZGxlcignb3BlbmVkJyk7XG4gICAgICB0YWJfbGluay5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAndHJ1ZScsICB0YWJpbmRleCA6IDB9KTtcbiAgICAgIHNpYmxpbmdzLnJlbW92ZUNsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcylcbiAgICAgIHNpYmxpbmdzLmZpbmQoJ2EnKS5hdHRyKHsnYXJpYS1zZWxlY3RlZCcgOiAnZmFsc2UnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3Moc2V0dGluZ3MuYWN0aXZlX2NsYXNzKS5hdHRyKHsnYXJpYS1oaWRkZW4nIDogJ3RydWUnLCAgdGFiaW5kZXggOiAtMX0pO1xuICAgICAgdGFyZ2V0LmFkZENsYXNzKHNldHRpbmdzLmFjdGl2ZV9jbGFzcykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICAgICAgc2V0dGluZ3MuY2FsbGJhY2sodGFiKTtcbiAgICAgIHRhcmdldC50cmlnZ2VySGFuZGxlcigndG9nZ2xlZCcsIFt0YXJnZXRdKTtcbiAgICAgIHRhYnMudHJpZ2dlckhhbmRsZXIoJ3RvZ2dsZWQnLCBbdGFiXSk7XG5cbiAgICAgIHRhYl9saW5rLm9mZigna2V5ZG93bicpLm9uKCdrZXlkb3duJywgaW50ZXJwcmV0X2tleXVwX2FjdGlvbiApO1xuICAgIH0sXG5cbiAgICBkYXRhX2F0dHIgOiBmdW5jdGlvbiAoc3RyKSB7XG4gICAgICBpZiAodGhpcy5uYW1lc3BhY2UubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uYW1lc3BhY2UgKyAnLScgKyBzdHI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgcmVmbG93IDogZnVuY3Rpb24gKCkge31cbiAgfTtcbn0oalF1ZXJ5LCB3aW5kb3csIHdpbmRvdy5kb2N1bWVudCkpO1xuXG47KGZ1bmN0aW9uICgkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIEZvdW5kYXRpb24ubGlicy50b29sdGlwID0ge1xuICAgIG5hbWUgOiAndG9vbHRpcCcsXG5cbiAgICB2ZXJzaW9uIDogJzUuNS4yJyxcblxuICAgIHNldHRpbmdzIDoge1xuICAgICAgYWRkaXRpb25hbF9pbmhlcml0YWJsZV9jbGFzc2VzIDogW10sXG4gICAgICB0b29sdGlwX2NsYXNzIDogJy50b29sdGlwJyxcbiAgICAgIGFwcGVuZF90byA6ICdib2R5JyxcbiAgICAgIHRvdWNoX2Nsb3NlX3RleHQgOiAnVGFwIFRvIENsb3NlJyxcbiAgICAgIGRpc2FibGVfZm9yX3RvdWNoIDogZmFsc2UsXG4gICAgICBob3Zlcl9kZWxheSA6IDIwMCxcbiAgICAgIHNob3dfb24gOiAnYWxsJyxcbiAgICAgIHRpcF90ZW1wbGF0ZSA6IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGVudCkge1xuICAgICAgICByZXR1cm4gJzxzcGFuIGRhdGEtc2VsZWN0b3I9XCInICsgc2VsZWN0b3IgKyAnXCIgaWQ9XCInICsgc2VsZWN0b3IgKyAnXCIgY2xhc3M9XCInXG4gICAgICAgICAgKyBGb3VuZGF0aW9uLmxpYnMudG9vbHRpcC5zZXR0aW5ncy50b29sdGlwX2NsYXNzLnN1YnN0cmluZygxKVxuICAgICAgICAgICsgJ1wiIHJvbGU9XCJ0b29sdGlwXCI+JyArIGNvbnRlbnQgKyAnPHNwYW4gY2xhc3M9XCJudWJcIj48L3NwYW4+PC9zcGFuPic7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNhY2hlIDoge30sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNjb3BlLCBtZXRob2QsIG9wdGlvbnMpIHtcbiAgICAgIEZvdW5kYXRpb24uaW5oZXJpdCh0aGlzLCAncmFuZG9tX3N0cicpO1xuICAgICAgdGhpcy5iaW5kaW5ncyhtZXRob2QsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICBzaG91bGRfc2hvdyA6IGZ1bmN0aW9uICh0YXJnZXQsIHRpcCkge1xuICAgICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMuc2V0dGluZ3MsIHRoaXMuZGF0YV9vcHRpb25zKHRhcmdldCkpO1xuXG4gICAgICBpZiAoc2V0dGluZ3Muc2hvd19vbiA9PT0gJ2FsbCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc21hbGwoKSAmJiBzZXR0aW5ncy5zaG93X29uID09PSAnc21hbGwnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm1lZGl1bSgpICYmIHNldHRpbmdzLnNob3dfb24gPT09ICdtZWRpdW0nKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmxhcmdlKCkgJiYgc2V0dGluZ3Muc2hvd19vbiA9PT0gJ2xhcmdlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgbWVkaXVtIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydtZWRpdW0nXSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgbGFyZ2UgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ2xhcmdlJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIGV2ZW50cyA6IGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSBzZWxmLlM7XG5cbiAgICAgIHNlbGYuY3JlYXRlKHRoaXMuUyhpbnN0YW5jZSkpO1xuXG4gICAgICBmdW5jdGlvbiBfc3RhcnRTaG93KGVsdCwgJHRoaXMsIGltbWVkaWF0ZSkge1xuICAgICAgICBpZiAoZWx0LnRpbWVyKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgICAgc2VsZi5zaG93VGlwKCR0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbHQudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgICAgICBzZWxmLnNob3dUaXAoJHRoaXMpO1xuICAgICAgICAgIH0uYmluZChlbHQpLCBzZWxmLnNldHRpbmdzLmhvdmVyX2RlbGF5KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBfc3RhcnRIaWRlKGVsdCwgJHRoaXMpIHtcbiAgICAgICAgaWYgKGVsdC50aW1lcikge1xuICAgICAgICAgIGNsZWFyVGltZW91dChlbHQudGltZXIpO1xuICAgICAgICAgIGVsdC50aW1lciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmhpZGUoJHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAkKHRoaXMuc2NvcGUpXG4gICAgICAgIC5vZmYoJy50b29sdGlwJylcbiAgICAgICAgLm9uKCdtb3VzZWVudGVyLmZuZHRuLnRvb2x0aXAgbW91c2VsZWF2ZS5mbmR0bi50b29sdGlwIHRvdWNoc3RhcnQuZm5kdG4udG9vbHRpcCBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAnLFxuICAgICAgICAgICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgdmFyICR0aGlzID0gUyh0aGlzKSxcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgc2VsZi5zZXR0aW5ncywgc2VsZi5kYXRhX29wdGlvbnMoJHRoaXMpKSxcbiAgICAgICAgICAgICAgaXNfdG91Y2ggPSBmYWxzZTtcblxuICAgICAgICAgIGlmIChNb2Rlcm5penIudG91Y2ggJiYgL3RvdWNoc3RhcnR8TVNQb2ludGVyRG93bi9pLnRlc3QoZS50eXBlKSAmJiBTKGUudGFyZ2V0KS5pcygnYScpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKC9tb3VzZS9pLnRlc3QoZS50eXBlKSAmJiBzZWxmLmllX3RvdWNoKGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIGlmICgkdGhpcy5oYXNDbGFzcygnb3BlbicpKSB7XG4gICAgICAgICAgICBpZiAoTW9kZXJuaXpyLnRvdWNoICYmIC90b3VjaHN0YXJ0fE1TUG9pbnRlckRvd24vaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5oaWRlKCR0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmRpc2FibGVfZm9yX3RvdWNoICYmIE1vZGVybml6ci50b3VjaCAmJiAvdG91Y2hzdGFydHxNU1BvaW50ZXJEb3duL2kudGVzdChlLnR5cGUpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNldHRpbmdzLmRpc2FibGVfZm9yX3RvdWNoICYmIE1vZGVybml6ci50b3VjaCAmJiAvdG91Y2hzdGFydHxNU1BvaW50ZXJEb3duL2kudGVzdChlLnR5cGUpKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgUyhzZXR0aW5ncy50b29sdGlwX2NsYXNzICsgJy5vcGVuJykuaGlkZSgpO1xuICAgICAgICAgICAgICBpc190b3VjaCA9IHRydWU7XG4gICAgICAgICAgICAgIC8vIGNsb3NlIG90aGVyIG9wZW4gdG9vbHRpcHMgb24gdG91Y2hcbiAgICAgICAgICAgICAgaWYgKCQoJy5vcGVuWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICB2YXIgcHJldk9wZW4gPSBTKCQoJy5vcGVuWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKVswXSk7XG4gICAgICAgICAgICAgICBzZWxmLmhpZGUocHJldk9wZW4pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgvZW50ZXJ8b3Zlci9pLnRlc3QoZS50eXBlKSkge1xuICAgICAgICAgICAgICBfc3RhcnRTaG93KHRoaXMsICR0aGlzKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLnR5cGUgPT09ICdtb3VzZW91dCcgfHwgZS50eXBlID09PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCAkdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfc3RhcnRTaG93KHRoaXMsICR0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignbW91c2VsZWF2ZS5mbmR0bi50b29sdGlwIHRvdWNoc3RhcnQuZm5kdG4udG9vbHRpcCBNU1BvaW50ZXJEb3duLmZuZHRuLnRvb2x0aXAnLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10ub3BlbicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgaWYgKC9tb3VzZS9pLnRlc3QoZS50eXBlKSAmJiBzZWxmLmllX3RvdWNoKGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCQodGhpcykuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAndG91Y2gnICYmIGUudHlwZSA9PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAnbW91c2UnICYmIC9NU1BvaW50ZXJEb3dufHRvdWNoc3RhcnQvaS50ZXN0KGUudHlwZSkpIHtcbiAgICAgICAgICAgIHNlbGYuY29udmVydF90b190b3VjaCgkKHRoaXMpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCAkKHRoaXMpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignRE9NTm9kZVJlbW92ZWQgRE9NQXR0ck1vZGlmaWVkJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddOm5vdChhKScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgX3N0YXJ0SGlkZSh0aGlzLCBTKHRoaXMpKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGllX3RvdWNoIDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vIEhvdyBkbyBJIGRpc3Rpbmd1aXNoIGJldHdlZW4gSUUxMSBhbmQgV2luZG93cyBQaG9uZSA4Pz8/Pz9cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgc2hvd1RpcCA6IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG4gICAgICB2YXIgJHRpcCA9IHRoaXMuZ2V0VGlwKCR0YXJnZXQpO1xuICAgICAgaWYgKHRoaXMuc2hvdWxkX3Nob3coJHRhcmdldCwgJHRpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hvdygkdGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9LFxuXG4gICAgZ2V0VGlwIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3IoJHRhcmdldCksXG4gICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJHRhcmdldCkpLFxuICAgICAgICAgIHRpcCA9IG51bGw7XG5cbiAgICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICB0aXAgPSB0aGlzLlMoJ3NwYW5bZGF0YS1zZWxlY3Rvcj1cIicgKyBzZWxlY3RvciArICdcIl0nICsgc2V0dGluZ3MudG9vbHRpcF9jbGFzcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAodHlwZW9mIHRpcCA9PT0gJ29iamVjdCcpID8gdGlwIDogZmFsc2U7XG4gICAgfSxcblxuICAgIHNlbGVjdG9yIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBkYXRhU2VsZWN0b3IgPSAkdGFyZ2V0LmF0dHIodGhpcy5hdHRyX25hbWUoKSkgfHwgJHRhcmdldC5hdHRyKCdkYXRhLXNlbGVjdG9yJyk7XG5cbiAgICAgIGlmICh0eXBlb2YgZGF0YVNlbGVjdG9yICE9ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGFTZWxlY3RvciA9IHRoaXMucmFuZG9tX3N0cig2KTtcbiAgICAgICAgJHRhcmdldFxuICAgICAgICAgIC5hdHRyKCdkYXRhLXNlbGVjdG9yJywgZGF0YVNlbGVjdG9yKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgZGF0YVNlbGVjdG9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGFTZWxlY3RvcjtcbiAgICB9LFxuXG4gICAgY3JlYXRlIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLnNldHRpbmdzLCB0aGlzLmRhdGFfb3B0aW9ucygkdGFyZ2V0KSksXG4gICAgICAgICAgdGlwX3RlbXBsYXRlID0gdGhpcy5zZXR0aW5ncy50aXBfdGVtcGxhdGU7XG5cbiAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MudGlwX3RlbXBsYXRlID09PSAnc3RyaW5nJyAmJiB3aW5kb3cuaGFzT3duUHJvcGVydHkoc2V0dGluZ3MudGlwX3RlbXBsYXRlKSkge1xuICAgICAgICB0aXBfdGVtcGxhdGUgPSB3aW5kb3dbc2V0dGluZ3MudGlwX3RlbXBsYXRlXTtcbiAgICAgIH1cblxuICAgICAgdmFyICR0aXAgPSAkKHRpcF90ZW1wbGF0ZSh0aGlzLnNlbGVjdG9yKCR0YXJnZXQpLCAkKCc8ZGl2PjwvZGl2PicpLmh0bWwoJHRhcmdldC5hdHRyKCd0aXRsZScpKS5odG1sKCkpKSxcbiAgICAgICAgICBjbGFzc2VzID0gdGhpcy5pbmhlcml0YWJsZV9jbGFzc2VzKCR0YXJnZXQpO1xuXG4gICAgICAkdGlwLmFkZENsYXNzKGNsYXNzZXMpLmFwcGVuZFRvKHNldHRpbmdzLmFwcGVuZF90byk7XG5cbiAgICAgIGlmIChNb2Rlcm5penIudG91Y2gpIHtcbiAgICAgICAgJHRpcC5hcHBlbmQoJzxzcGFuIGNsYXNzPVwidGFwLXRvLWNsb3NlXCI+JyArIHNldHRpbmdzLnRvdWNoX2Nsb3NlX3RleHQgKyAnPC9zcGFuPicpO1xuICAgICAgICAkdGlwLm9uKCd0b3VjaHN0YXJ0LmZuZHRuLnRvb2x0aXAgTVNQb2ludGVyRG93bi5mbmR0bi50b29sdGlwJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmhpZGUoJHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkdGFyZ2V0LnJlbW92ZUF0dHIoJ3RpdGxlJykuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgfSxcblxuICAgIHJlcG9zaXRpb24gOiBmdW5jdGlvbiAodGFyZ2V0LCB0aXAsIGNsYXNzZXMpIHtcbiAgICAgIHZhciB3aWR0aCwgbnViLCBudWJIZWlnaHQsIG51YldpZHRoLCBjb2x1bW4sIG9ialBvcztcblxuICAgICAgdGlwLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKS5zaG93KCk7XG5cbiAgICAgIHdpZHRoID0gdGFyZ2V0LmRhdGEoJ3dpZHRoJyk7XG4gICAgICBudWIgPSB0aXAuY2hpbGRyZW4oJy5udWInKTtcbiAgICAgIG51YkhlaWdodCA9IG51Yi5vdXRlckhlaWdodCgpO1xuICAgICAgbnViV2lkdGggPSBudWIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgaWYgKHRoaXMuc21hbGwoKSkge1xuICAgICAgICB0aXAuY3NzKHsnd2lkdGgnIDogJzEwMCUnfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aXAuY3NzKHsnd2lkdGgnIDogKHdpZHRoKSA/IHdpZHRoIDogJ2F1dG8nfSk7XG4gICAgICB9XG5cbiAgICAgIG9ialBvcyA9IGZ1bmN0aW9uIChvYmosIHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCwgd2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIG9iai5jc3Moe1xuICAgICAgICAgICd0b3AnIDogKHRvcCkgPyB0b3AgOiAnYXV0bycsXG4gICAgICAgICAgJ2JvdHRvbScgOiAoYm90dG9tKSA/IGJvdHRvbSA6ICdhdXRvJyxcbiAgICAgICAgICAnbGVmdCcgOiAobGVmdCkgPyBsZWZ0IDogJ2F1dG8nLFxuICAgICAgICAgICdyaWdodCcgOiAocmlnaHQpID8gcmlnaHQgOiAnYXV0bydcbiAgICAgICAgfSkuZW5kKCk7XG4gICAgICB9O1xuXG4gICAgICBvYmpQb3ModGlwLCAodGFyZ2V0Lm9mZnNldCgpLnRvcCArIHRhcmdldC5vdXRlckhlaWdodCgpICsgMTApLCAnYXV0bycsICdhdXRvJywgdGFyZ2V0Lm9mZnNldCgpLmxlZnQpO1xuXG4gICAgICBpZiAodGhpcy5zbWFsbCgpKSB7XG4gICAgICAgIG9ialBvcyh0aXAsICh0YXJnZXQub2Zmc2V0KCkudG9wICsgdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyAxMCksICdhdXRvJywgJ2F1dG8nLCAxMi41LCAkKHRoaXMuc2NvcGUpLndpZHRoKCkpO1xuICAgICAgICB0aXAuYWRkQ2xhc3MoJ3RpcC1vdmVycmlkZScpO1xuICAgICAgICBvYmpQb3MobnViLCAtbnViSGVpZ2h0LCAnYXV0bycsICdhdXRvJywgdGFyZ2V0Lm9mZnNldCgpLmxlZnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGxlZnQgPSB0YXJnZXQub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgaWYgKEZvdW5kYXRpb24ucnRsKSB7XG4gICAgICAgICAgbnViLmFkZENsYXNzKCdydGwnKTtcbiAgICAgICAgICBsZWZ0ID0gdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKyB0YXJnZXQub3V0ZXJXaWR0aCgpIC0gdGlwLm91dGVyV2lkdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ialBvcyh0aXAsICh0YXJnZXQub2Zmc2V0KCkudG9wICsgdGFyZ2V0Lm91dGVySGVpZ2h0KCkgKyAxMCksICdhdXRvJywgJ2F1dG8nLCBsZWZ0KTtcbiAgICAgICAgLy8gcmVzZXQgbnViIGZyb20gc21hbGwgc3R5bGVzLCBpZiB0aGV5J3ZlIGJlZW4gYXBwbGllZFxuICAgICAgICBpZiAobnViLmF0dHIoJ3N0eWxlJykpIHtcbiAgICAgICAgICBudWIucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGlwLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5pbmRleE9mKCd0aXAtdG9wJykgPiAtMSkge1xuICAgICAgICAgIGlmIChGb3VuZGF0aW9uLnJ0bCkge1xuICAgICAgICAgICAgbnViLmFkZENsYXNzKCdydGwnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgLSB0aXAub3V0ZXJIZWlnaHQoKSksICdhdXRvJywgJ2F1dG8nLCBsZWZ0KVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgfSBlbHNlIGlmIChjbGFzc2VzICYmIGNsYXNzZXMuaW5kZXhPZigndGlwLWxlZnQnKSA+IC0xKSB7XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyAodGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKSAtICh0aXAub3V0ZXJIZWlnaHQoKSAvIDIpKSwgJ2F1dG8nLCAnYXV0bycsICh0YXJnZXQub2Zmc2V0KCkubGVmdCAtIHRpcC5vdXRlcldpZHRoKCkgLSBudWJIZWlnaHQpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgICBudWIucmVtb3ZlQ2xhc3MoJ3J0bCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGNsYXNzZXMgJiYgY2xhc3Nlcy5pbmRleE9mKCd0aXAtcmlnaHQnKSA+IC0xKSB7XG4gICAgICAgICAgb2JqUG9zKHRpcCwgKHRhcmdldC5vZmZzZXQoKS50b3AgKyAodGFyZ2V0Lm91dGVySGVpZ2h0KCkgLyAyKSAtICh0aXAub3V0ZXJIZWlnaHQoKSAvIDIpKSwgJ2F1dG8nLCAnYXV0bycsICh0YXJnZXQub2Zmc2V0KCkubGVmdCArIHRhcmdldC5vdXRlcldpZHRoKCkgKyBudWJIZWlnaHQpKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCd0aXAtb3ZlcnJpZGUnKTtcbiAgICAgICAgICBudWIucmVtb3ZlQ2xhc3MoJ3J0bCcpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRpcC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpLmhpZGUoKTtcbiAgICB9LFxuXG4gICAgc21hbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXMgJiZcbiAgICAgICAgIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgaW5oZXJpdGFibGVfY2xhc3NlcyA6IGZ1bmN0aW9uICgkdGFyZ2V0KSB7XG4gICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5zZXR0aW5ncywgdGhpcy5kYXRhX29wdGlvbnMoJHRhcmdldCkpLFxuICAgICAgICAgIGluaGVyaXRhYmxlcyA9IFsndGlwLXRvcCcsICd0aXAtbGVmdCcsICd0aXAtYm90dG9tJywgJ3RpcC1yaWdodCcsICdyYWRpdXMnLCAncm91bmQnXS5jb25jYXQoc2V0dGluZ3MuYWRkaXRpb25hbF9pbmhlcml0YWJsZV9jbGFzc2VzKSxcbiAgICAgICAgICBjbGFzc2VzID0gJHRhcmdldC5hdHRyKCdjbGFzcycpLFxuICAgICAgICAgIGZpbHRlcmVkID0gY2xhc3NlcyA/ICQubWFwKGNsYXNzZXMuc3BsaXQoJyAnKSwgZnVuY3Rpb24gKGVsLCBpKSB7XG4gICAgICAgICAgICBpZiAoJC5pbkFycmF5KGVsLCBpbmhlcml0YWJsZXMpICE9PSAtMSkge1xuICAgICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuam9pbignICcpIDogJyc7XG5cbiAgICAgIHJldHVybiAkLnRyaW0oZmlsdGVyZWQpO1xuICAgIH0sXG5cbiAgICBjb252ZXJ0X3RvX3RvdWNoIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAkdGlwID0gc2VsZi5nZXRUaXAoJHRhcmdldCksXG4gICAgICAgICAgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgc2VsZi5zZXR0aW5ncywgc2VsZi5kYXRhX29wdGlvbnMoJHRhcmdldCkpO1xuXG4gICAgICBpZiAoJHRpcC5maW5kKCcudGFwLXRvLWNsb3NlJykubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICR0aXAuYXBwZW5kKCc8c3BhbiBjbGFzcz1cInRhcC10by1jbG9zZVwiPicgKyBzZXR0aW5ncy50b3VjaF9jbG9zZV90ZXh0ICsgJzwvc3Bhbj4nKTtcbiAgICAgICAgJHRpcC5vbignY2xpY2suZm5kdG4udG9vbHRpcC50YXBjbG9zZSB0b3VjaHN0YXJ0LmZuZHRuLnRvb2x0aXAudGFwY2xvc2UgTVNQb2ludGVyRG93bi5mbmR0bi50b29sdGlwLnRhcGNsb3NlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBzZWxmLmhpZGUoJHRhcmdldCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAkdGFyZ2V0LmRhdGEoJ3Rvb2x0aXAtb3Blbi1ldmVudC10eXBlJywgJ3RvdWNoJyk7XG4gICAgfSxcblxuICAgIHNob3cgOiBmdW5jdGlvbiAoJHRhcmdldCkge1xuICAgICAgdmFyICR0aXAgPSB0aGlzLmdldFRpcCgkdGFyZ2V0KTtcblxuICAgICAgaWYgKCR0YXJnZXQuZGF0YSgndG9vbHRpcC1vcGVuLWV2ZW50LXR5cGUnKSA9PSAndG91Y2gnKSB7XG4gICAgICAgIHRoaXMuY29udmVydF90b190b3VjaCgkdGFyZ2V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXBvc2l0aW9uKCR0YXJnZXQsICR0aXAsICR0YXJnZXQuYXR0cignY2xhc3MnKSk7XG4gICAgICAkdGFyZ2V0LmFkZENsYXNzKCdvcGVuJyk7XG4gICAgICAkdGlwLmZhZGVJbigxNTApO1xuICAgIH0sXG5cbiAgICBoaWRlIDogZnVuY3Rpb24gKCR0YXJnZXQpIHtcbiAgICAgIHZhciAkdGlwID0gdGhpcy5nZXRUaXAoJHRhcmdldCk7XG4gICAgICAkdGlwLmZhZGVPdXQoMTUwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aXAuZmluZCgnLnRhcC10by1jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAkdGlwLm9mZignY2xpY2suZm5kdG4udG9vbHRpcC50YXBjbG9zZSBNU1BvaW50ZXJEb3duLmZuZHRuLnRhcGNsb3NlJyk7XG4gICAgICAgICR0YXJnZXQucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBvZmYgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB0aGlzLlModGhpcy5zY29wZSkub2ZmKCcuZm5kdG4udG9vbHRpcCcpO1xuICAgICAgdGhpcy5TKHRoaXMuc2V0dGluZ3MudG9vbHRpcF9jbGFzcykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICAkKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLmVxKGkpLmF0dHIoJ3RpdGxlJywgJCh0aGlzKS50ZXh0KCkpO1xuICAgICAgfSkucmVtb3ZlKCk7XG4gICAgfSxcblxuICAgIHJlZmxvdyA6IGZ1bmN0aW9uICgpIHt9XG4gIH07XG59KGpRdWVyeSwgd2luZG93LCB3aW5kb3cuZG9jdW1lbnQpKTtcblxuOyhmdW5jdGlvbiAoJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBGb3VuZGF0aW9uLmxpYnMudG9wYmFyID0ge1xuICAgIG5hbWUgOiAndG9wYmFyJyxcblxuICAgIHZlcnNpb24gOiAnNS41LjInLFxuXG4gICAgc2V0dGluZ3MgOiB7XG4gICAgICBpbmRleCA6IDAsXG4gICAgICBzdGFydF9vZmZzZXQgOiAwLFxuICAgICAgc3RpY2t5X2NsYXNzIDogJ3N0aWNreScsXG4gICAgICBjdXN0b21fYmFja190ZXh0IDogdHJ1ZSxcbiAgICAgIGJhY2tfdGV4dCA6ICdCYWNrJyxcbiAgICAgIG1vYmlsZV9zaG93X3BhcmVudF9saW5rIDogdHJ1ZSxcbiAgICAgIGlzX2hvdmVyIDogdHJ1ZSxcbiAgICAgIHNjcm9sbHRvcCA6IHRydWUsIC8vIGp1bXAgdG8gdG9wIHdoZW4gc3RpY2t5IG5hdiBtZW51IHRvZ2dsZSBpcyBjbGlja2VkXG4gICAgICBzdGlja3lfb24gOiAnYWxsJyxcbiAgICAgIGRyb3Bkb3duX2F1dG9jbG9zZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBpbml0IDogZnVuY3Rpb24gKHNlY3Rpb24sIG1ldGhvZCwgb3B0aW9ucykge1xuICAgICAgRm91bmRhdGlvbi5pbmhlcml0KHRoaXMsICdhZGRfY3VzdG9tX3J1bGUgcmVnaXN0ZXJfbWVkaWEgdGhyb3R0bGUnKTtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5yZWdpc3Rlcl9tZWRpYSgndG9wYmFyJywgJ2ZvdW5kYXRpb24tbXEtdG9wYmFyJyk7XG5cbiAgICAgIHRoaXMuYmluZGluZ3MobWV0aG9kLCBvcHRpb25zKTtcblxuICAgICAgc2VsZi5TKCdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXScsIHRoaXMuc2NvcGUpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9wYmFyID0gJCh0aGlzKSxcbiAgICAgICAgICAgIHNldHRpbmdzID0gdG9wYmFyLmRhdGEoc2VsZi5hdHRyX25hbWUodHJ1ZSkgKyAnLWluaXQnKSxcbiAgICAgICAgICAgIHNlY3Rpb24gPSBzZWxmLlMoJ3NlY3Rpb24sIC50b3AtYmFyLXNlY3Rpb24nLCB0aGlzKTtcbiAgICAgICAgdG9wYmFyLmRhdGEoJ2luZGV4JywgMCk7XG4gICAgICAgIHZhciB0b3BiYXJDb250YWluZXIgPSB0b3BiYXIucGFyZW50KCk7XG4gICAgICAgIGlmICh0b3BiYXJDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykgfHwgc2VsZi5pc19zdGlja3kodG9wYmFyLCB0b3BiYXJDb250YWluZXIsIHNldHRpbmdzKSApIHtcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLnN0aWNreV9jbGFzcyA9IHNldHRpbmdzLnN0aWNreV9jbGFzcztcbiAgICAgICAgICBzZWxmLnNldHRpbmdzLnN0aWNreV90b3BiYXIgPSB0b3BiYXI7XG4gICAgICAgICAgdG9wYmFyLmRhdGEoJ2hlaWdodCcsIHRvcGJhckNvbnRhaW5lci5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgICB0b3BiYXIuZGF0YSgnc3RpY2t5b2Zmc2V0JywgdG9wYmFyQ29udGFpbmVyLm9mZnNldCgpLnRvcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9wYmFyLmRhdGEoJ2hlaWdodCcsIHRvcGJhci5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2V0dGluZ3MuYXNzZW1ibGVkKSB7XG4gICAgICAgICAgc2VsZi5hc3NlbWJsZSh0b3BiYXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgc2VsZi5TKCcuaGFzLWRyb3Bkb3duJywgdG9wYmFyKS5hZGRDbGFzcygnbm90LWNsaWNrJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi5TKCcuaGFzLWRyb3Bkb3duJywgdG9wYmFyKS5yZW1vdmVDbGFzcygnbm90LWNsaWNrJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQYWQgYm9keSB3aGVuIHN0aWNreSAoc2Nyb2xsZWQpIG9yIGZpeGVkLlxuICAgICAgICBzZWxmLmFkZF9jdXN0b21fcnVsZSgnLmYtdG9wYmFyLWZpeGVkIHsgcGFkZGluZy10b3A6ICcgKyB0b3BiYXIuZGF0YSgnaGVpZ2h0JykgKyAncHggfScpO1xuXG4gICAgICAgIGlmICh0b3BiYXJDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgaXNfc3RpY2t5IDogZnVuY3Rpb24gKHRvcGJhciwgdG9wYmFyQ29udGFpbmVyLCBzZXR0aW5ncykge1xuICAgICAgdmFyIHN0aWNreSAgICAgPSB0b3BiYXJDb250YWluZXIuaGFzQ2xhc3Moc2V0dGluZ3Muc3RpY2t5X2NsYXNzKTtcbiAgICAgIHZhciBzbWFsbE1hdGNoID0gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpLm1hdGNoZXM7XG4gICAgICB2YXIgbWVkTWF0Y2ggICA9IG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzLm1lZGl1bSkubWF0Y2hlcztcbiAgICAgIHZhciBscmdNYXRjaCAgID0gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubGFyZ2UpLm1hdGNoZXM7XG5cbiAgICAgIGlmIChzdGlja3kgJiYgc2V0dGluZ3Muc3RpY2t5X29uID09PSAnYWxsJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGlja3kgJiYgdGhpcy5zbWFsbCgpICYmIHNldHRpbmdzLnN0aWNreV9vbi5pbmRleE9mKCdzbWFsbCcpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiAhbWVkTWF0Y2ggJiYgIWxyZ01hdGNoKSB7IHJldHVybiB0cnVlOyB9XG4gICAgICB9XG4gICAgICBpZiAoc3RpY2t5ICYmIHRoaXMubWVkaXVtKCkgJiYgc2V0dGluZ3Muc3RpY2t5X29uLmluZGV4T2YoJ21lZGl1bScpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiBtZWRNYXRjaCAmJiAhbHJnTWF0Y2gpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIH1cbiAgICAgIGlmIChzdGlja3kgJiYgdGhpcy5sYXJnZSgpICYmIHNldHRpbmdzLnN0aWNreV9vbi5pbmRleE9mKCdsYXJnZScpICE9PSAtMSkge1xuICAgICAgICBpZiAoc21hbGxNYXRjaCAmJiBtZWRNYXRjaCAmJiBscmdNYXRjaCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgICAgfVxuXG4gICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICB0b2dnbGUgOiBmdW5jdGlvbiAodG9nZ2xlRWwpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICB0b3BiYXI7XG5cbiAgICAgIGlmICh0b2dnbGVFbCkge1xuICAgICAgICB0b3BiYXIgPSBzZWxmLlModG9nZ2xlRWwpLmNsb3Nlc3QoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3BiYXIgPSBzZWxmLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG5cbiAgICAgIHZhciBzZWN0aW9uID0gc2VsZi5TKCdzZWN0aW9uLCAudG9wLWJhci1zZWN0aW9uJywgdG9wYmFyKTtcblxuICAgICAgaWYgKHNlbGYuYnJlYWtwb2ludCgpKSB7XG4gICAgICAgIGlmICghc2VsZi5ydGwpIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7bGVmdCA6ICcwJSd9KTtcbiAgICAgICAgICAkKCc+Lm5hbWUnLCBzZWN0aW9uKS5jc3Moe2xlZnQgOiAnMTAwJSd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAnMCUnfSk7XG4gICAgICAgICAgJCgnPi5uYW1lJywgc2VjdGlvbikuY3NzKHtyaWdodCA6ICcxMDAlJ30pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5TKCdsaS5tb3ZlZCcsIHNlY3Rpb24pLnJlbW92ZUNsYXNzKCdtb3ZlZCcpO1xuICAgICAgICB0b3BiYXIuZGF0YSgnaW5kZXgnLCAwKTtcblxuICAgICAgICB0b3BiYXJcbiAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2V4cGFuZGVkJylcbiAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZXR0aW5ncy5zY3JvbGx0b3ApIHtcbiAgICAgICAgaWYgKCF0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcbiAgICAgICAgICBpZiAodG9wYmFyLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB0b3BiYXIucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodG9wYmFyLnBhcmVudCgpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbHRvcCkge1xuICAgICAgICAgICAgdG9wYmFyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgdG9wYmFyLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgICAgICAgICAgc2VsZi5TKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJyk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wYmFyLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHNlbGYuaXNfc3RpY2t5KHRvcGJhciwgdG9wYmFyLnBhcmVudCgpLCBzZXR0aW5ncykpIHtcbiAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9wYmFyLnBhcmVudCgpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgaWYgKCF0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJykpIHtcbiAgICAgICAgICAgIHRvcGJhci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgIHRvcGJhci5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKTtcbiAgICAgICAgICAgIHNlbGYudXBkYXRlX3N0aWNreV9wb3NpdGlvbmluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b3BiYXIuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICB0b3BiYXIucGFyZW50KCkuYWRkQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgICAgICAgICBzZWxmLlMoJ2JvZHknKS5hZGRDbGFzcygnZi10b3BiYXItZml4ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdGltZXIgOiBudWxsLFxuXG4gICAgZXZlbnRzIDogZnVuY3Rpb24gKGJhcikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICAgIFMgPSB0aGlzLlM7XG5cbiAgICAgIFModGhpcy5zY29wZSlcbiAgICAgICAgLm9mZignLnRvcGJhcicpXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udG9wYmFyJywgJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddIC50b2dnbGUtdG9wYmFyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgc2VsZi50b2dnbGUodGhpcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbignY2xpY2suZm5kdG4udG9wYmFyIGNvbnRleHRtZW51LmZuZHRuLnRvcGJhcicsICcudG9wLWJhciAudG9wLWJhci1zZWN0aW9uIGxpIGFbaHJlZl49XCIjXCJdLFsnICsgdGhpcy5hdHRyX25hbWUoKSArICddIC50b3AtYmFyLXNlY3Rpb24gbGkgYVtocmVmXj1cIiNcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGxpID0gJCh0aGlzKS5jbG9zZXN0KCdsaScpLFxuICAgICAgICAgICAgICAgIHRvcGJhciA9IGxpLmNsb3Nlc3QoJ1snICsgc2VsZi5hdHRyX25hbWUoKSArICddJyksXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSB0b3BiYXIuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuXG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZHJvcGRvd25fYXV0b2Nsb3NlICYmIHNldHRpbmdzLmlzX2hvdmVyKSB7XG4gICAgICAgICAgICAgIHZhciBob3ZlckxpID0gJCh0aGlzKS5jbG9zZXN0KCcuaG92ZXInKTtcbiAgICAgICAgICAgICAgaG92ZXJMaS5yZW1vdmVDbGFzcygnaG92ZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSAmJiAhbGkuaGFzQ2xhc3MoJ2JhY2snKSAmJiAhbGkuaGFzQ2xhc3MoJ2hhcy1kcm9wZG93bicpKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICAgICAgLm9uKCdjbGljay5mbmR0bi50b3BiYXInLCAnWycgKyB0aGlzLmF0dHJfbmFtZSgpICsgJ10gbGkuaGFzLWRyb3Bkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICB2YXIgbGkgPSBTKHRoaXMpLFxuICAgICAgICAgICAgICB0YXJnZXQgPSBTKGUudGFyZ2V0KSxcbiAgICAgICAgICAgICAgdG9wYmFyID0gbGkuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgICAgc2V0dGluZ3MgPSB0b3BiYXIuZGF0YShzZWxmLmF0dHJfbmFtZSh0cnVlKSArICctaW5pdCcpO1xuXG4gICAgICAgICAgaWYgKHRhcmdldC5kYXRhKCdyZXZlYWxJZCcpKSB7XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZXR0aW5ncy5pc19ob3ZlciAmJiAhTW9kZXJuaXpyLnRvdWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgIGlmIChsaS5oYXNDbGFzcygnaG92ZXInKSkge1xuICAgICAgICAgICAgbGlcbiAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdob3ZlcicpXG4gICAgICAgICAgICAgIC5maW5kKCdsaScpXG4gICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaG92ZXInKTtcblxuICAgICAgICAgICAgbGkucGFyZW50cygnbGkuaG92ZXInKVxuICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpLmFkZENsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICAkKGxpKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0WzBdLm5vZGVOYW1lID09PSAnQScgJiYgdGFyZ2V0LnBhcmVudCgpLmhhc0NsYXNzKCdoYXMtZHJvcGRvd24nKSkge1xuICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAub24oJ2NsaWNrLmZuZHRuLnRvcGJhcicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSAuaGFzLWRyb3Bkb3duPmEnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmIChzZWxmLmJyZWFrcG9pbnQoKSkge1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyA9IFModGhpcyksXG4gICAgICAgICAgICAgICAgdG9wYmFyID0gJHRoaXMuY2xvc2VzdCgnWycgKyBzZWxmLmF0dHJfbmFtZSgpICsgJ10nKSxcbiAgICAgICAgICAgICAgICBzZWN0aW9uID0gdG9wYmFyLmZpbmQoJ3NlY3Rpb24sIC50b3AtYmFyLXNlY3Rpb24nKSxcbiAgICAgICAgICAgICAgICBkcm9wZG93bkhlaWdodCA9ICR0aGlzLm5leHQoJy5kcm9wZG93bicpLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICAgICAgJHNlbGVjdGVkTGkgPSAkdGhpcy5jbG9zZXN0KCdsaScpO1xuXG4gICAgICAgICAgICB0b3BiYXIuZGF0YSgnaW5kZXgnLCB0b3BiYXIuZGF0YSgnaW5kZXgnKSArIDEpO1xuICAgICAgICAgICAgJHNlbGVjdGVkTGkuYWRkQ2xhc3MoJ21vdmVkJyk7XG5cbiAgICAgICAgICAgIGlmICghc2VsZi5ydGwpIHtcbiAgICAgICAgICAgICAgc2VjdGlvbi5jc3Moe2xlZnQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoJz4ubmFtZScpLmNzcyh7bGVmdCA6IDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpICsgJyUnfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgICAgICBzZWN0aW9uLmZpbmQoJz4ubmFtZScpLmNzcyh7cmlnaHQgOiAxMDAgKiB0b3BiYXIuZGF0YSgnaW5kZXgnKSArICclJ30pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b3BiYXIuY3NzKCdoZWlnaHQnLCAkdGhpcy5zaWJsaW5ncygndWwnKS5vdXRlckhlaWdodCh0cnVlKSArIHRvcGJhci5kYXRhKCdoZWlnaHQnKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgUyh3aW5kb3cpLm9mZignLnRvcGJhcicpLm9uKCdyZXNpemUuZm5kdG4udG9wYmFyJywgc2VsZi50aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5yZXNpemUuY2FsbChzZWxmKTtcbiAgICAgIH0sIDUwKSkudHJpZ2dlcigncmVzaXplLmZuZHRuLnRvcGJhcicpLmxvYWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvZmZzZXQgaXMgY2FsY3VsYXRlZCBhZnRlciBhbGwgb2YgdGhlIHBhZ2VzIHJlc291cmNlcyBoYXZlIGxvYWRlZFxuICAgICAgICAgIFModGhpcykudHJpZ2dlcigncmVzaXplLmZuZHRuLnRvcGJhcicpO1xuICAgICAgfSk7XG5cbiAgICAgIFMoJ2JvZHknKS5vZmYoJy50b3BiYXInKS5vbignY2xpY2suZm5kdG4udG9wYmFyJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IFMoZS50YXJnZXQpLmNsb3Nlc3QoJ2xpJykuY2xvc2VzdCgnbGkuaG92ZXInKTtcblxuICAgICAgICBpZiAocGFyZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBTKCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXSBsaS5ob3ZlcicpLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIEdvIHVwIGEgbGV2ZWwgb24gQ2xpY2tcbiAgICAgIFModGhpcy5zY29wZSkub24oJ2NsaWNrLmZuZHRuLnRvcGJhcicsICdbJyArIHRoaXMuYXR0cl9uYW1lKCkgKyAnXSAuaGFzLWRyb3Bkb3duIC5iYWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciAkdGhpcyA9IFModGhpcyksXG4gICAgICAgICAgICB0b3BiYXIgPSAkdGhpcy5jbG9zZXN0KCdbJyArIHNlbGYuYXR0cl9uYW1lKCkgKyAnXScpLFxuICAgICAgICAgICAgc2VjdGlvbiA9IHRvcGJhci5maW5kKCdzZWN0aW9uLCAudG9wLWJhci1zZWN0aW9uJyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgICAkbW92ZWRMaSA9ICR0aGlzLmNsb3Nlc3QoJ2xpLm1vdmVkJyksXG4gICAgICAgICAgICAkcHJldmlvdXNMZXZlbFVsID0gJG1vdmVkTGkucGFyZW50KCk7XG5cbiAgICAgICAgdG9wYmFyLmRhdGEoJ2luZGV4JywgdG9wYmFyLmRhdGEoJ2luZGV4JykgLSAxKTtcblxuICAgICAgICBpZiAoIXNlbGYucnRsKSB7XG4gICAgICAgICAgc2VjdGlvbi5jc3Moe2xlZnQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgIHNlY3Rpb24uZmluZCgnPi5uYW1lJykuY3NzKHtsZWZ0IDogMTAwICogdG9wYmFyLmRhdGEoJ2luZGV4JykgKyAnJSd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWN0aW9uLmNzcyh7cmlnaHQgOiAtKDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpKSArICclJ30pO1xuICAgICAgICAgIHNlY3Rpb24uZmluZCgnPi5uYW1lJykuY3NzKHtyaWdodCA6IDEwMCAqIHRvcGJhci5kYXRhKCdpbmRleCcpICsgJyUnfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9wYmFyLmRhdGEoJ2luZGV4JykgPT09IDApIHtcbiAgICAgICAgICB0b3BiYXIuY3NzKCdoZWlnaHQnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdG9wYmFyLmNzcygnaGVpZ2h0JywgJHByZXZpb3VzTGV2ZWxVbC5vdXRlckhlaWdodCh0cnVlKSArIHRvcGJhci5kYXRhKCdoZWlnaHQnKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbW92ZWRMaS5yZW1vdmVDbGFzcygnbW92ZWQnKTtcbiAgICAgICAgfSwgMzAwKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTaG93IGRyb3Bkb3duIG1lbnVzIHdoZW4gdGhlaXIgaXRlbXMgYXJlIGZvY3VzZWRcbiAgICAgIFModGhpcy5zY29wZSkuZmluZCgnLmRyb3Bkb3duIGEnKVxuICAgICAgICAuZm9jdXMoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykucGFyZW50cygnLmhhcy1kcm9wZG93bicpLmFkZENsYXNzKCdob3ZlcicpO1xuICAgICAgICB9KVxuICAgICAgICAuYmx1cihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJCh0aGlzKS5wYXJlbnRzKCcuaGFzLWRyb3Bkb3duJykucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICByZXNpemUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICBzZWxmLlMoJ1snICsgdGhpcy5hdHRyX25hbWUoKSArICddJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3BiYXIgPSBzZWxmLlModGhpcyksXG4gICAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHNlbGYuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0Jyk7XG5cbiAgICAgICAgdmFyIHN0aWNreUNvbnRhaW5lciA9IHRvcGJhci5wYXJlbnQoJy4nICsgc2VsZi5zZXR0aW5ncy5zdGlja3lfY2xhc3MpO1xuICAgICAgICB2YXIgc3RpY2t5T2Zmc2V0O1xuXG4gICAgICAgIGlmICghc2VsZi5icmVha3BvaW50KCkpIHtcbiAgICAgICAgICB2YXIgZG9Ub2dnbGUgPSB0b3BiYXIuaGFzQ2xhc3MoJ2V4cGFuZGVkJyk7XG4gICAgICAgICAgdG9wYmFyXG4gICAgICAgICAgICAuY3NzKCdoZWlnaHQnLCAnJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZXhwYW5kZWQnKVxuICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaG92ZXInKTtcblxuICAgICAgICAgICAgaWYgKGRvVG9nZ2xlKSB7XG4gICAgICAgICAgICAgIHNlbGYudG9nZ2xlKHRvcGJhcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5pc19zdGlja3kodG9wYmFyLCBzdGlja3lDb250YWluZXIsIHNldHRpbmdzKSkge1xuICAgICAgICAgIGlmIChzdGlja3lDb250YWluZXIuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgZml4ZWQgdG8gYWxsb3cgZm9yIGNvcnJlY3QgY2FsY3VsYXRpb24gb2YgdGhlIG9mZnNldC5cbiAgICAgICAgICAgIHN0aWNreUNvbnRhaW5lci5yZW1vdmVDbGFzcygnZml4ZWQnKTtcblxuICAgICAgICAgICAgc3RpY2t5T2Zmc2V0ID0gc3RpY2t5Q29udGFpbmVyLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgIGlmIChzZWxmLlMoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJykpIHtcbiAgICAgICAgICAgICAgc3RpY2t5T2Zmc2V0IC09IHRvcGJhci5kYXRhKCdoZWlnaHQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG9wYmFyLmRhdGEoJ3N0aWNreW9mZnNldCcsIHN0aWNreU9mZnNldCk7XG4gICAgICAgICAgICBzdGlja3lDb250YWluZXIuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0aWNreU9mZnNldCA9IHN0aWNreUNvbnRhaW5lci5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICB0b3BiYXIuZGF0YSgnc3RpY2t5b2Zmc2V0Jywgc3RpY2t5T2Zmc2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGJyZWFrcG9pbnQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gIW1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWyd0b3BiYXInXSkubWF0Y2hlcztcbiAgICB9LFxuXG4gICAgc21hbGwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXNbJ3NtYWxsJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIG1lZGl1bSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBtYXRjaE1lZGlhKEZvdW5kYXRpb24ubWVkaWFfcXVlcmllc1snbWVkaXVtJ10pLm1hdGNoZXM7XG4gICAgfSxcblxuICAgIGxhcmdlIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG1hdGNoTWVkaWEoRm91bmRhdGlvbi5tZWRpYV9xdWVyaWVzWydsYXJnZSddKS5tYXRjaGVzO1xuICAgIH0sXG5cbiAgICBhc3NlbWJsZSA6IGZ1bmN0aW9uICh0b3BiYXIpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICBzZXR0aW5ncyA9IHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpICsgJy1pbml0JyksXG4gICAgICAgICAgc2VjdGlvbiA9IHNlbGYuUygnc2VjdGlvbiwgLnRvcC1iYXItc2VjdGlvbicsIHRvcGJhcik7XG5cbiAgICAgIC8vIFB1bGwgZWxlbWVudCBvdXQgb2YgdGhlIERPTSBmb3IgbWFuaXB1bGF0aW9uXG4gICAgICBzZWN0aW9uLmRldGFjaCgpO1xuXG4gICAgICBzZWxmLlMoJy5oYXMtZHJvcGRvd24+YScsIHNlY3Rpb24pLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJGxpbmsgPSBzZWxmLlModGhpcyksXG4gICAgICAgICAgICAkZHJvcGRvd24gPSAkbGluay5zaWJsaW5ncygnLmRyb3Bkb3duJyksXG4gICAgICAgICAgICB1cmwgPSAkbGluay5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAkdGl0bGVMaTtcblxuICAgICAgICBpZiAoISRkcm9wZG93bi5maW5kKCcudGl0bGUuYmFjaycpLmxlbmd0aCkge1xuXG4gICAgICAgICAgaWYgKHNldHRpbmdzLm1vYmlsZV9zaG93X3BhcmVudF9saW5rID09IHRydWUgJiYgdXJsKSB7XG4gICAgICAgICAgICAkdGl0bGVMaSA9ICQoJzxsaSBjbGFzcz1cInRpdGxlIGJhY2sganMtZ2VuZXJhdGVkXCI+PGg1PjxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9oNT48L2xpPjxsaSBjbGFzcz1cInBhcmVudC1saW5rIGhpZGUtZm9yLW1lZGl1bS11cFwiPjxhIGNsYXNzPVwicGFyZW50LWxpbmsganMtZ2VuZXJhdGVkXCIgaHJlZj1cIicgKyB1cmwgKyAnXCI+JyArICRsaW5rLmh0bWwoKSArJzwvYT48L2xpPicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkdGl0bGVMaSA9ICQoJzxsaSBjbGFzcz1cInRpdGxlIGJhY2sganMtZ2VuZXJhdGVkXCI+PGg1PjxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIj48L2E+PC9oNT4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBDb3B5IGxpbmsgdG8gc3VibmF2XG4gICAgICAgICAgaWYgKHNldHRpbmdzLmN1c3RvbV9iYWNrX3RleHQgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgJCgnaDU+YScsICR0aXRsZUxpKS5odG1sKHNldHRpbmdzLmJhY2tfdGV4dCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJ2g1PmEnLCAkdGl0bGVMaSkuaHRtbCgnJmxhcXVvOyAnICsgJGxpbmsuaHRtbCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJGRyb3Bkb3duLnByZXBlbmQoJHRpdGxlTGkpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gUHV0IGVsZW1lbnQgYmFjayBpbiB0aGUgRE9NXG4gICAgICBzZWN0aW9uLmFwcGVuZFRvKHRvcGJhcik7XG5cbiAgICAgIC8vIGNoZWNrIGZvciBzdGlja3lcbiAgICAgIHRoaXMuc3RpY2t5KCk7XG5cbiAgICAgIHRoaXMuYXNzZW1ibGVkKHRvcGJhcik7XG4gICAgfSxcblxuICAgIGFzc2VtYmxlZCA6IGZ1bmN0aW9uICh0b3BiYXIpIHtcbiAgICAgIHRvcGJhci5kYXRhKHRoaXMuYXR0cl9uYW1lKHRydWUpLCAkLmV4dGVuZCh7fSwgdG9wYmFyLmRhdGEodGhpcy5hdHRyX25hbWUodHJ1ZSkpLCB7YXNzZW1ibGVkIDogdHJ1ZX0pKTtcbiAgICB9LFxuXG4gICAgaGVpZ2h0IDogZnVuY3Rpb24gKHVsKSB7XG4gICAgICB2YXIgdG90YWwgPSAwLFxuICAgICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgICAkKCc+IGxpJywgdWwpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB0b3RhbCArPSBzZWxmLlModGhpcykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRvdGFsO1xuICAgIH0sXG5cbiAgICBzdGlja3kgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYudXBkYXRlX3N0aWNreV9wb3NpdGlvbmluZygpO1xuICAgICAgfSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZV9zdGlja3lfcG9zaXRpb25pbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2xhc3MgPSAnLicgKyB0aGlzLnNldHRpbmdzLnN0aWNreV9jbGFzcyxcbiAgICAgICAgICAkd2luZG93ID0gdGhpcy5TKHdpbmRvdyksXG4gICAgICAgICAgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmIChzZWxmLnNldHRpbmdzLnN0aWNreV90b3BiYXIgJiYgc2VsZi5pc19zdGlja3kodGhpcy5zZXR0aW5ncy5zdGlja3lfdG9wYmFyLHRoaXMuc2V0dGluZ3Muc3RpY2t5X3RvcGJhci5wYXJlbnQoKSwgdGhpcy5zZXR0aW5ncykpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gdGhpcy5zZXR0aW5ncy5zdGlja3lfdG9wYmFyLmRhdGEoJ3N0aWNreW9mZnNldCcpICsgdGhpcy5zZXR0aW5ncy5zdGFydF9vZmZzZXQ7XG4gICAgICAgIGlmICghc2VsZi5TKGtsYXNzKS5oYXNDbGFzcygnZXhwYW5kZWQnKSkge1xuICAgICAgICAgIGlmICgkd2luZG93LnNjcm9sbFRvcCgpID4gKGRpc3RhbmNlKSkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLlMoa2xhc3MpLmhhc0NsYXNzKCdmaXhlZCcpKSB7XG4gICAgICAgICAgICAgIHNlbGYuUyhrbGFzcykuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgICAgICAgICAgIHNlbGYuUygnYm9keScpLmFkZENsYXNzKCdmLXRvcGJhci1maXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoJHdpbmRvdy5zY3JvbGxUb3AoKSA8PSBkaXN0YW5jZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuUyhrbGFzcykuaGFzQ2xhc3MoJ2ZpeGVkJykpIHtcbiAgICAgICAgICAgICAgc2VsZi5TKGtsYXNzKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICAgICAgICAgICAgc2VsZi5TKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2YtdG9wYmFyLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIG9mZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuUyh0aGlzLnNjb3BlKS5vZmYoJy5mbmR0bi50b3BiYXInKTtcbiAgICAgIHRoaXMuUyh3aW5kb3cpLm9mZignLmZuZHRuLnRvcGJhcicpO1xuICAgIH0sXG5cbiAgICByZWZsb3cgOiBmdW5jdGlvbiAoKSB7fVxuICB9O1xufShqUXVlcnksIHdpbmRvdywgd2luZG93LmRvY3VtZW50KSk7XG4iLCIvKiFcbiAqIGpRdWVyeSBKYXZhU2NyaXB0IExpYnJhcnkgdjIuMS40XG4gKiBodHRwOi8vanF1ZXJ5LmNvbS9cbiAqXG4gKiBJbmNsdWRlcyBTaXp6bGUuanNcbiAqIGh0dHA6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IDIwMDUsIDIwMTQgalF1ZXJ5IEZvdW5kYXRpb24sIEluYy4gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogRGF0ZTogMjAxNS0wNC0yOFQxNjowMVpcbiAqL1xuIWZ1bmN0aW9uKGEsYil7XCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZS5leHBvcnRzP21vZHVsZS5leHBvcnRzPWEuZG9jdW1lbnQ/YihhLCEwKTpmdW5jdGlvbihhKXtpZighYS5kb2N1bWVudCl0aHJvdyBuZXcgRXJyb3IoXCJqUXVlcnkgcmVxdWlyZXMgYSB3aW5kb3cgd2l0aCBhIGRvY3VtZW50XCIpO3JldHVybiBiKGEpfTpiKGEpfShcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzp0aGlzLGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhhKXt2YXIgYj1cImxlbmd0aFwiaW4gYSYmYS5sZW5ndGgsYz1fLnR5cGUoYSk7cmV0dXJuXCJmdW5jdGlvblwiPT09Y3x8Xy5pc1dpbmRvdyhhKT8hMToxPT09YS5ub2RlVHlwZSYmYj8hMDpcImFycmF5XCI9PT1jfHwwPT09Ynx8XCJudW1iZXJcIj09dHlwZW9mIGImJmI+MCYmYi0xIGluIGF9ZnVuY3Rpb24gZChhLGIsYyl7aWYoXy5pc0Z1bmN0aW9uKGIpKXJldHVybiBfLmdyZXAoYSxmdW5jdGlvbihhLGQpe3JldHVybiEhYi5jYWxsKGEsZCxhKSE9PWN9KTtpZihiLm5vZGVUeXBlKXJldHVybiBfLmdyZXAoYSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PWIhPT1jfSk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe2lmKGhhLnRlc3QoYikpcmV0dXJuIF8uZmlsdGVyKGIsYSxjKTtiPV8uZmlsdGVyKGIsYSl9cmV0dXJuIF8uZ3JlcChhLGZ1bmN0aW9uKGEpe3JldHVybiBVLmNhbGwoYixhKT49MCE9PWN9KX1mdW5jdGlvbiBlKGEsYil7Zm9yKDsoYT1hW2JdKSYmMSE9PWEubm9kZVR5cGU7KTtyZXR1cm4gYX1mdW5jdGlvbiBmKGEpe3ZhciBiPW9hW2FdPXt9O3JldHVybiBfLmVhY2goYS5tYXRjaChuYSl8fFtdLGZ1bmN0aW9uKGEsYyl7YltjXT0hMH0pLGJ9ZnVuY3Rpb24gZygpe1oucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixnLCExKSxhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZywhMSksXy5yZWFkeSgpfWZ1bmN0aW9uIGgoKXtPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5jYWNoZT17fSwwLHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm57fX19KSx0aGlzLmV4cGFuZG89Xy5leHBhbmRvK2gudWlkKyt9ZnVuY3Rpb24gaShhLGIsYyl7dmFyIGQ7aWYodm9pZCAwPT09YyYmMT09PWEubm9kZVR5cGUpaWYoZD1cImRhdGEtXCIrYi5yZXBsYWNlKHVhLFwiLSQxXCIpLnRvTG93ZXJDYXNlKCksYz1hLmdldEF0dHJpYnV0ZShkKSxcInN0cmluZ1wiPT10eXBlb2YgYyl7dHJ5e2M9XCJ0cnVlXCI9PT1jPyEwOlwiZmFsc2VcIj09PWM/ITE6XCJudWxsXCI9PT1jP251bGw6K2MrXCJcIj09PWM/K2M6dGEudGVzdChjKT9fLnBhcnNlSlNPTihjKTpjfWNhdGNoKGUpe31zYS5zZXQoYSxiLGMpfWVsc2UgYz12b2lkIDA7cmV0dXJuIGN9ZnVuY3Rpb24gaigpe3JldHVybiEwfWZ1bmN0aW9uIGsoKXtyZXR1cm4hMX1mdW5jdGlvbiBsKCl7dHJ5e3JldHVybiBaLmFjdGl2ZUVsZW1lbnR9Y2F0Y2goYSl7fX1mdW5jdGlvbiBtKGEsYil7cmV0dXJuIF8ubm9kZU5hbWUoYSxcInRhYmxlXCIpJiZfLm5vZGVOYW1lKDExIT09Yi5ub2RlVHlwZT9iOmIuZmlyc3RDaGlsZCxcInRyXCIpP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXXx8YS5hcHBlbmRDaGlsZChhLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRib2R5XCIpKTphfWZ1bmN0aW9uIG4oYSl7cmV0dXJuIGEudHlwZT0obnVsbCE9PWEuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSkrXCIvXCIrYS50eXBlLGF9ZnVuY3Rpb24gbyhhKXt2YXIgYj1LYS5leGVjKGEudHlwZSk7cmV0dXJuIGI/YS50eXBlPWJbMV06YS5yZW1vdmVBdHRyaWJ1dGUoXCJ0eXBlXCIpLGF9ZnVuY3Rpb24gcChhLGIpe2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKylyYS5zZXQoYVtjXSxcImdsb2JhbEV2YWxcIiwhYnx8cmEuZ2V0KGJbY10sXCJnbG9iYWxFdmFsXCIpKX1mdW5jdGlvbiBxKGEsYil7dmFyIGMsZCxlLGYsZyxoLGksajtpZigxPT09Yi5ub2RlVHlwZSl7aWYocmEuaGFzRGF0YShhKSYmKGY9cmEuYWNjZXNzKGEpLGc9cmEuc2V0KGIsZiksaj1mLmV2ZW50cykpe2RlbGV0ZSBnLmhhbmRsZSxnLmV2ZW50cz17fTtmb3IoZSBpbiBqKWZvcihjPTAsZD1qW2VdLmxlbmd0aDtkPmM7YysrKV8uZXZlbnQuYWRkKGIsZSxqW2VdW2NdKX1zYS5oYXNEYXRhKGEpJiYoaD1zYS5hY2Nlc3MoYSksaT1fLmV4dGVuZCh7fSxoKSxzYS5zZXQoYixpKSl9fWZ1bmN0aW9uIHIoYSxiKXt2YXIgYz1hLmdldEVsZW1lbnRzQnlUYWdOYW1lP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYnx8XCIqXCIpOmEucXVlcnlTZWxlY3RvckFsbD9hLnF1ZXJ5U2VsZWN0b3JBbGwoYnx8XCIqXCIpOltdO3JldHVybiB2b2lkIDA9PT1ifHxiJiZfLm5vZGVOYW1lKGEsYik/Xy5tZXJnZShbYV0sYyk6Y31mdW5jdGlvbiBzKGEsYil7dmFyIGM9Yi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1wiaW5wdXRcIj09PWMmJnlhLnRlc3QoYS50eXBlKT9iLmNoZWNrZWQ9YS5jaGVja2VkOihcImlucHV0XCI9PT1jfHxcInRleHRhcmVhXCI9PT1jKSYmKGIuZGVmYXVsdFZhbHVlPWEuZGVmYXVsdFZhbHVlKX1mdW5jdGlvbiB0KGIsYyl7dmFyIGQsZT1fKGMuY3JlYXRlRWxlbWVudChiKSkuYXBwZW5kVG8oYy5ib2R5KSxmPWEuZ2V0RGVmYXVsdENvbXB1dGVkU3R5bGUmJihkPWEuZ2V0RGVmYXVsdENvbXB1dGVkU3R5bGUoZVswXSkpP2QuZGlzcGxheTpfLmNzcyhlWzBdLFwiZGlzcGxheVwiKTtyZXR1cm4gZS5kZXRhY2goKSxmfWZ1bmN0aW9uIHUoYSl7dmFyIGI9WixjPU9hW2FdO3JldHVybiBjfHwoYz10KGEsYiksXCJub25lXCIhPT1jJiZjfHwoTmE9KE5hfHxfKFwiPGlmcmFtZSBmcmFtZWJvcmRlcj0nMCcgd2lkdGg9JzAnIGhlaWdodD0nMCcvPlwiKSkuYXBwZW5kVG8oYi5kb2N1bWVudEVsZW1lbnQpLGI9TmFbMF0uY29udGVudERvY3VtZW50LGIud3JpdGUoKSxiLmNsb3NlKCksYz10KGEsYiksTmEuZGV0YWNoKCkpLE9hW2FdPWMpLGN9ZnVuY3Rpb24gdihhLGIsYyl7dmFyIGQsZSxmLGcsaD1hLnN0eWxlO3JldHVybiBjPWN8fFJhKGEpLGMmJihnPWMuZ2V0UHJvcGVydHlWYWx1ZShiKXx8Y1tiXSksYyYmKFwiXCIhPT1nfHxfLmNvbnRhaW5zKGEub3duZXJEb2N1bWVudCxhKXx8KGc9Xy5zdHlsZShhLGIpKSxRYS50ZXN0KGcpJiZQYS50ZXN0KGIpJiYoZD1oLndpZHRoLGU9aC5taW5XaWR0aCxmPWgubWF4V2lkdGgsaC5taW5XaWR0aD1oLm1heFdpZHRoPWgud2lkdGg9ZyxnPWMud2lkdGgsaC53aWR0aD1kLGgubWluV2lkdGg9ZSxoLm1heFdpZHRoPWYpKSx2b2lkIDAhPT1nP2crXCJcIjpnfWZ1bmN0aW9uIHcoYSxiKXtyZXR1cm57Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGEoKT92b2lkIGRlbGV0ZSB0aGlzLmdldDoodGhpcy5nZXQ9YikuYXBwbHkodGhpcyxhcmd1bWVudHMpfX19ZnVuY3Rpb24geChhLGIpe2lmKGIgaW4gYSlyZXR1cm4gYjtmb3IodmFyIGM9YlswXS50b1VwcGVyQ2FzZSgpK2Iuc2xpY2UoMSksZD1iLGU9WGEubGVuZ3RoO2UtLTspaWYoYj1YYVtlXStjLGIgaW4gYSlyZXR1cm4gYjtyZXR1cm4gZH1mdW5jdGlvbiB5KGEsYixjKXt2YXIgZD1UYS5leGVjKGIpO3JldHVybiBkP01hdGgubWF4KDAsZFsxXS0oY3x8MCkpKyhkWzJdfHxcInB4XCIpOmJ9ZnVuY3Rpb24geihhLGIsYyxkLGUpe2Zvcih2YXIgZj1jPT09KGQ/XCJib3JkZXJcIjpcImNvbnRlbnRcIik/NDpcIndpZHRoXCI9PT1iPzE6MCxnPTA7ND5mO2YrPTIpXCJtYXJnaW5cIj09PWMmJihnKz1fLmNzcyhhLGMrd2FbZl0sITAsZSkpLGQ/KFwiY29udGVudFwiPT09YyYmKGctPV8uY3NzKGEsXCJwYWRkaW5nXCIrd2FbZl0sITAsZSkpLFwibWFyZ2luXCIhPT1jJiYoZy09Xy5jc3MoYSxcImJvcmRlclwiK3dhW2ZdK1wiV2lkdGhcIiwhMCxlKSkpOihnKz1fLmNzcyhhLFwicGFkZGluZ1wiK3dhW2ZdLCEwLGUpLFwicGFkZGluZ1wiIT09YyYmKGcrPV8uY3NzKGEsXCJib3JkZXJcIit3YVtmXStcIldpZHRoXCIsITAsZSkpKTtyZXR1cm4gZ31mdW5jdGlvbiBBKGEsYixjKXt2YXIgZD0hMCxlPVwid2lkdGhcIj09PWI/YS5vZmZzZXRXaWR0aDphLm9mZnNldEhlaWdodCxmPVJhKGEpLGc9XCJib3JkZXItYm94XCI9PT1fLmNzcyhhLFwiYm94U2l6aW5nXCIsITEsZik7aWYoMD49ZXx8bnVsbD09ZSl7aWYoZT12KGEsYixmKSwoMD5lfHxudWxsPT1lKSYmKGU9YS5zdHlsZVtiXSksUWEudGVzdChlKSlyZXR1cm4gZTtkPWcmJihZLmJveFNpemluZ1JlbGlhYmxlKCl8fGU9PT1hLnN0eWxlW2JdKSxlPXBhcnNlRmxvYXQoZSl8fDB9cmV0dXJuIGUreihhLGIsY3x8KGc/XCJib3JkZXJcIjpcImNvbnRlbnRcIiksZCxmKStcInB4XCJ9ZnVuY3Rpb24gQihhLGIpe2Zvcih2YXIgYyxkLGUsZj1bXSxnPTAsaD1hLmxlbmd0aDtoPmc7ZysrKWQ9YVtnXSxkLnN0eWxlJiYoZltnXT1yYS5nZXQoZCxcIm9sZGRpc3BsYXlcIiksYz1kLnN0eWxlLmRpc3BsYXksYj8oZltnXXx8XCJub25lXCIhPT1jfHwoZC5zdHlsZS5kaXNwbGF5PVwiXCIpLFwiXCI9PT1kLnN0eWxlLmRpc3BsYXkmJnhhKGQpJiYoZltnXT1yYS5hY2Nlc3MoZCxcIm9sZGRpc3BsYXlcIix1KGQubm9kZU5hbWUpKSkpOihlPXhhKGQpLFwibm9uZVwiPT09YyYmZXx8cmEuc2V0KGQsXCJvbGRkaXNwbGF5XCIsZT9jOl8uY3NzKGQsXCJkaXNwbGF5XCIpKSkpO2ZvcihnPTA7aD5nO2crKylkPWFbZ10sZC5zdHlsZSYmKGImJlwibm9uZVwiIT09ZC5zdHlsZS5kaXNwbGF5JiZcIlwiIT09ZC5zdHlsZS5kaXNwbGF5fHwoZC5zdHlsZS5kaXNwbGF5PWI/ZltnXXx8XCJcIjpcIm5vbmVcIikpO3JldHVybiBhfWZ1bmN0aW9uIEMoYSxiLGMsZCxlKXtyZXR1cm4gbmV3IEMucHJvdG90eXBlLmluaXQoYSxiLGMsZCxlKX1mdW5jdGlvbiBEKCl7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtZYT12b2lkIDB9KSxZYT1fLm5vdygpfWZ1bmN0aW9uIEUoYSxiKXt2YXIgYyxkPTAsZT17aGVpZ2h0OmF9O2ZvcihiPWI/MTowOzQ+ZDtkKz0yLWIpYz13YVtkXSxlW1wibWFyZ2luXCIrY109ZVtcInBhZGRpbmdcIitjXT1hO3JldHVybiBiJiYoZS5vcGFjaXR5PWUud2lkdGg9YSksZX1mdW5jdGlvbiBGKGEsYixjKXtmb3IodmFyIGQsZT0oY2JbYl18fFtdKS5jb25jYXQoY2JbXCIqXCJdKSxmPTAsZz1lLmxlbmd0aDtnPmY7ZisrKWlmKGQ9ZVtmXS5jYWxsKGMsYixhKSlyZXR1cm4gZH1mdW5jdGlvbiBHKGEsYixjKXt2YXIgZCxlLGYsZyxoLGksaixrLGw9dGhpcyxtPXt9LG49YS5zdHlsZSxvPWEubm9kZVR5cGUmJnhhKGEpLHA9cmEuZ2V0KGEsXCJmeHNob3dcIik7Yy5xdWV1ZXx8KGg9Xy5fcXVldWVIb29rcyhhLFwiZnhcIiksbnVsbD09aC51bnF1ZXVlZCYmKGgudW5xdWV1ZWQ9MCxpPWguZW1wdHkuZmlyZSxoLmVtcHR5LmZpcmU9ZnVuY3Rpb24oKXtoLnVucXVldWVkfHxpKCl9KSxoLnVucXVldWVkKyssbC5hbHdheXMoZnVuY3Rpb24oKXtsLmFsd2F5cyhmdW5jdGlvbigpe2gudW5xdWV1ZWQtLSxfLnF1ZXVlKGEsXCJmeFwiKS5sZW5ndGh8fGguZW1wdHkuZmlyZSgpfSl9KSksMT09PWEubm9kZVR5cGUmJihcImhlaWdodFwiaW4gYnx8XCJ3aWR0aFwiaW4gYikmJihjLm92ZXJmbG93PVtuLm92ZXJmbG93LG4ub3ZlcmZsb3dYLG4ub3ZlcmZsb3dZXSxqPV8uY3NzKGEsXCJkaXNwbGF5XCIpLGs9XCJub25lXCI9PT1qP3JhLmdldChhLFwib2xkZGlzcGxheVwiKXx8dShhLm5vZGVOYW1lKTpqLFwiaW5saW5lXCI9PT1rJiZcIm5vbmVcIj09PV8uY3NzKGEsXCJmbG9hdFwiKSYmKG4uZGlzcGxheT1cImlubGluZS1ibG9ja1wiKSksYy5vdmVyZmxvdyYmKG4ub3ZlcmZsb3c9XCJoaWRkZW5cIixsLmFsd2F5cyhmdW5jdGlvbigpe24ub3ZlcmZsb3c9Yy5vdmVyZmxvd1swXSxuLm92ZXJmbG93WD1jLm92ZXJmbG93WzFdLG4ub3ZlcmZsb3dZPWMub3ZlcmZsb3dbMl19KSk7Zm9yKGQgaW4gYilpZihlPWJbZF0sJGEuZXhlYyhlKSl7aWYoZGVsZXRlIGJbZF0sZj1mfHxcInRvZ2dsZVwiPT09ZSxlPT09KG8/XCJoaWRlXCI6XCJzaG93XCIpKXtpZihcInNob3dcIiE9PWV8fCFwfHx2b2lkIDA9PT1wW2RdKWNvbnRpbnVlO289ITB9bVtkXT1wJiZwW2RdfHxfLnN0eWxlKGEsZCl9ZWxzZSBqPXZvaWQgMDtpZihfLmlzRW1wdHlPYmplY3QobSkpXCJpbmxpbmVcIj09PShcIm5vbmVcIj09PWo/dShhLm5vZGVOYW1lKTpqKSYmKG4uZGlzcGxheT1qKTtlbHNle3A/XCJoaWRkZW5cImluIHAmJihvPXAuaGlkZGVuKTpwPXJhLmFjY2VzcyhhLFwiZnhzaG93XCIse30pLGYmJihwLmhpZGRlbj0hbyksbz9fKGEpLnNob3coKTpsLmRvbmUoZnVuY3Rpb24oKXtfKGEpLmhpZGUoKX0pLGwuZG9uZShmdW5jdGlvbigpe3ZhciBiO3JhLnJlbW92ZShhLFwiZnhzaG93XCIpO2ZvcihiIGluIG0pXy5zdHlsZShhLGIsbVtiXSl9KTtmb3IoZCBpbiBtKWc9RihvP3BbZF06MCxkLGwpLGQgaW4gcHx8KHBbZF09Zy5zdGFydCxvJiYoZy5lbmQ9Zy5zdGFydCxnLnN0YXJ0PVwid2lkdGhcIj09PWR8fFwiaGVpZ2h0XCI9PT1kPzE6MCkpfX1mdW5jdGlvbiBIKGEsYil7dmFyIGMsZCxlLGYsZztmb3IoYyBpbiBhKWlmKGQ9Xy5jYW1lbENhc2UoYyksZT1iW2RdLGY9YVtjXSxfLmlzQXJyYXkoZikmJihlPWZbMV0sZj1hW2NdPWZbMF0pLGMhPT1kJiYoYVtkXT1mLGRlbGV0ZSBhW2NdKSxnPV8uY3NzSG9va3NbZF0sZyYmXCJleHBhbmRcImluIGcpe2Y9Zy5leHBhbmQoZiksZGVsZXRlIGFbZF07Zm9yKGMgaW4gZiljIGluIGF8fChhW2NdPWZbY10sYltjXT1lKX1lbHNlIGJbZF09ZX1mdW5jdGlvbiBJKGEsYixjKXt2YXIgZCxlLGY9MCxnPWJiLmxlbmd0aCxoPV8uRGVmZXJyZWQoKS5hbHdheXMoZnVuY3Rpb24oKXtkZWxldGUgaS5lbGVtfSksaT1mdW5jdGlvbigpe2lmKGUpcmV0dXJuITE7Zm9yKHZhciBiPVlhfHxEKCksYz1NYXRoLm1heCgwLGouc3RhcnRUaW1lK2ouZHVyYXRpb24tYiksZD1jL2ouZHVyYXRpb258fDAsZj0xLWQsZz0wLGk9ai50d2VlbnMubGVuZ3RoO2k+ZztnKyspai50d2VlbnNbZ10ucnVuKGYpO3JldHVybiBoLm5vdGlmeVdpdGgoYSxbaixmLGNdKSwxPmYmJmk/YzooaC5yZXNvbHZlV2l0aChhLFtqXSksITEpfSxqPWgucHJvbWlzZSh7ZWxlbTphLHByb3BzOl8uZXh0ZW5kKHt9LGIpLG9wdHM6Xy5leHRlbmQoITAse3NwZWNpYWxFYXNpbmc6e319LGMpLG9yaWdpbmFsUHJvcGVydGllczpiLG9yaWdpbmFsT3B0aW9uczpjLHN0YXJ0VGltZTpZYXx8RCgpLGR1cmF0aW9uOmMuZHVyYXRpb24sdHdlZW5zOltdLGNyZWF0ZVR3ZWVuOmZ1bmN0aW9uKGIsYyl7dmFyIGQ9Xy5Ud2VlbihhLGoub3B0cyxiLGMsai5vcHRzLnNwZWNpYWxFYXNpbmdbYl18fGoub3B0cy5lYXNpbmcpO3JldHVybiBqLnR3ZWVucy5wdXNoKGQpLGR9LHN0b3A6ZnVuY3Rpb24oYil7dmFyIGM9MCxkPWI/ai50d2VlbnMubGVuZ3RoOjA7aWYoZSlyZXR1cm4gdGhpcztmb3IoZT0hMDtkPmM7YysrKWoudHdlZW5zW2NdLnJ1bigxKTtyZXR1cm4gYj9oLnJlc29sdmVXaXRoKGEsW2osYl0pOmgucmVqZWN0V2l0aChhLFtqLGJdKSx0aGlzfX0pLGs9ai5wcm9wcztmb3IoSChrLGoub3B0cy5zcGVjaWFsRWFzaW5nKTtnPmY7ZisrKWlmKGQ9YmJbZl0uY2FsbChqLGEsayxqLm9wdHMpKXJldHVybiBkO3JldHVybiBfLm1hcChrLEYsaiksXy5pc0Z1bmN0aW9uKGoub3B0cy5zdGFydCkmJmoub3B0cy5zdGFydC5jYWxsKGEsaiksXy5meC50aW1lcihfLmV4dGVuZChpLHtlbGVtOmEsYW5pbTpqLHF1ZXVlOmoub3B0cy5xdWV1ZX0pKSxqLnByb2dyZXNzKGoub3B0cy5wcm9ncmVzcykuZG9uZShqLm9wdHMuZG9uZSxqLm9wdHMuY29tcGxldGUpLmZhaWwoai5vcHRzLmZhaWwpLmFsd2F5cyhqLm9wdHMuYWx3YXlzKX1mdW5jdGlvbiBKKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe1wic3RyaW5nXCIhPXR5cGVvZiBiJiYoYz1iLGI9XCIqXCIpO3ZhciBkLGU9MCxmPWIudG9Mb3dlckNhc2UoKS5tYXRjaChuYSl8fFtdO2lmKF8uaXNGdW5jdGlvbihjKSlmb3IoO2Q9ZltlKytdOylcIitcIj09PWRbMF0/KGQ9ZC5zbGljZSgxKXx8XCIqXCIsKGFbZF09YVtkXXx8W10pLnVuc2hpZnQoYykpOihhW2RdPWFbZF18fFtdKS5wdXNoKGMpfX1mdW5jdGlvbiBLKGEsYixjLGQpe2Z1bmN0aW9uIGUoaCl7dmFyIGk7cmV0dXJuIGZbaF09ITAsXy5lYWNoKGFbaF18fFtdLGZ1bmN0aW9uKGEsaCl7dmFyIGo9aChiLGMsZCk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGp8fGd8fGZbal0/Zz8hKGk9aik6dm9pZCAwOihiLmRhdGFUeXBlcy51bnNoaWZ0KGopLGUoaiksITEpfSksaX12YXIgZj17fSxnPWE9PT10YjtyZXR1cm4gZShiLmRhdGFUeXBlc1swXSl8fCFmW1wiKlwiXSYmZShcIipcIil9ZnVuY3Rpb24gTChhLGIpe3ZhciBjLGQsZT1fLmFqYXhTZXR0aW5ncy5mbGF0T3B0aW9uc3x8e307Zm9yKGMgaW4gYil2b2lkIDAhPT1iW2NdJiYoKGVbY10/YTpkfHwoZD17fSkpW2NdPWJbY10pO3JldHVybiBkJiZfLmV4dGVuZCghMCxhLGQpLGF9ZnVuY3Rpb24gTShhLGIsYyl7Zm9yKHZhciBkLGUsZixnLGg9YS5jb250ZW50cyxpPWEuZGF0YVR5cGVzO1wiKlwiPT09aVswXTspaS5zaGlmdCgpLHZvaWQgMD09PWQmJihkPWEubWltZVR5cGV8fGIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO2lmKGQpZm9yKGUgaW4gaClpZihoW2VdJiZoW2VdLnRlc3QoZCkpe2kudW5zaGlmdChlKTticmVha31pZihpWzBdaW4gYylmPWlbMF07ZWxzZXtmb3IoZSBpbiBjKXtpZighaVswXXx8YS5jb252ZXJ0ZXJzW2UrXCIgXCIraVswXV0pe2Y9ZTticmVha31nfHwoZz1lKX1mPWZ8fGd9cmV0dXJuIGY/KGYhPT1pWzBdJiZpLnVuc2hpZnQoZiksY1tmXSk6dm9pZCAwfWZ1bmN0aW9uIE4oYSxiLGMsZCl7dmFyIGUsZixnLGgsaSxqPXt9LGs9YS5kYXRhVHlwZXMuc2xpY2UoKTtpZihrWzFdKWZvcihnIGluIGEuY29udmVydGVycylqW2cudG9Mb3dlckNhc2UoKV09YS5jb252ZXJ0ZXJzW2ddO2ZvcihmPWsuc2hpZnQoKTtmOylpZihhLnJlc3BvbnNlRmllbGRzW2ZdJiYoY1thLnJlc3BvbnNlRmllbGRzW2ZdXT1iKSwhaSYmZCYmYS5kYXRhRmlsdGVyJiYoYj1hLmRhdGFGaWx0ZXIoYixhLmRhdGFUeXBlKSksaT1mLGY9ay5zaGlmdCgpKWlmKFwiKlwiPT09ZilmPWk7ZWxzZSBpZihcIipcIiE9PWkmJmkhPT1mKXtpZihnPWpbaStcIiBcIitmXXx8altcIiogXCIrZl0sIWcpZm9yKGUgaW4gailpZihoPWUuc3BsaXQoXCIgXCIpLGhbMV09PT1mJiYoZz1qW2krXCIgXCIraFswXV18fGpbXCIqIFwiK2hbMF1dKSl7Zz09PSEwP2c9altlXTpqW2VdIT09ITAmJihmPWhbMF0say51bnNoaWZ0KGhbMV0pKTticmVha31pZihnIT09ITApaWYoZyYmYVtcInRocm93c1wiXSliPWcoYik7ZWxzZSB0cnl7Yj1nKGIpfWNhdGNoKGwpe3JldHVybntzdGF0ZTpcInBhcnNlcmVycm9yXCIsZXJyb3I6Zz9sOlwiTm8gY29udmVyc2lvbiBmcm9tIFwiK2krXCIgdG8gXCIrZn19fXJldHVybntzdGF0ZTpcInN1Y2Nlc3NcIixkYXRhOmJ9fWZ1bmN0aW9uIE8oYSxiLGMsZCl7dmFyIGU7aWYoXy5pc0FycmF5KGIpKV8uZWFjaChiLGZ1bmN0aW9uKGIsZSl7Y3x8eWIudGVzdChhKT9kKGEsZSk6TyhhK1wiW1wiKyhcIm9iamVjdFwiPT10eXBlb2YgZT9iOlwiXCIpK1wiXVwiLGUsYyxkKX0pO2Vsc2UgaWYoY3x8XCJvYmplY3RcIiE9PV8udHlwZShiKSlkKGEsYik7ZWxzZSBmb3IoZSBpbiBiKU8oYStcIltcIitlK1wiXVwiLGJbZV0sYyxkKX1mdW5jdGlvbiBQKGEpe3JldHVybiBfLmlzV2luZG93KGEpP2E6OT09PWEubm9kZVR5cGUmJmEuZGVmYXVsdFZpZXd9dmFyIFE9W10sUj1RLnNsaWNlLFM9US5jb25jYXQsVD1RLnB1c2gsVT1RLmluZGV4T2YsVj17fSxXPVYudG9TdHJpbmcsWD1WLmhhc093blByb3BlcnR5LFk9e30sWj1hLmRvY3VtZW50LCQ9XCIyLjEuNFwiLF89ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IF8uZm4uaW5pdChhLGIpfSxhYT0vXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2csYmE9L14tbXMtLyxjYT0vLShbXFxkYS16XSkvZ2ksZGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYi50b1VwcGVyQ2FzZSgpfTtfLmZuPV8ucHJvdG90eXBlPXtqcXVlcnk6JCxjb25zdHJ1Y3RvcjpfLHNlbGVjdG9yOlwiXCIsbGVuZ3RoOjAsdG9BcnJheTpmdW5jdGlvbigpe3JldHVybiBSLmNhbGwodGhpcyl9LGdldDpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YT8wPmE/dGhpc1thK3RoaXMubGVuZ3RoXTp0aGlzW2FdOlIuY2FsbCh0aGlzKX0scHVzaFN0YWNrOmZ1bmN0aW9uKGEpe3ZhciBiPV8ubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLGEpO3JldHVybiBiLnByZXZPYmplY3Q9dGhpcyxiLmNvbnRleHQ9dGhpcy5jb250ZXh0LGJ9LGVhY2g6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gXy5lYWNoKHRoaXMsYSxiKX0sbWFwOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayhfLm1hcCh0aGlzLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuY2FsbChiLGMsYil9KSl9LHNsaWNlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKFIuYXBwbHkodGhpcyxhcmd1bWVudHMpKX0sZmlyc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgwKX0sbGFzdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVxKC0xKX0sZXE6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5sZW5ndGgsYz0rYSsoMD5hP2I6MCk7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGM+PTAmJmI+Yz9bdGhpc1tjXV06W10pfSxlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcmV2T2JqZWN0fHx0aGlzLmNvbnN0cnVjdG9yKG51bGwpfSxwdXNoOlQsc29ydDpRLnNvcnQsc3BsaWNlOlEuc3BsaWNlfSxfLmV4dGVuZD1fLmZuLmV4dGVuZD1mdW5jdGlvbigpe3ZhciBhLGIsYyxkLGUsZixnPWFyZ3VtZW50c1swXXx8e30saD0xLGk9YXJndW1lbnRzLmxlbmd0aCxqPSExO2ZvcihcImJvb2xlYW5cIj09dHlwZW9mIGcmJihqPWcsZz1hcmd1bWVudHNbaF18fHt9LGgrKyksXCJvYmplY3RcIj09dHlwZW9mIGd8fF8uaXNGdW5jdGlvbihnKXx8KGc9e30pLGg9PT1pJiYoZz10aGlzLGgtLSk7aT5oO2grKylpZihudWxsIT0oYT1hcmd1bWVudHNbaF0pKWZvcihiIGluIGEpYz1nW2JdLGQ9YVtiXSxnIT09ZCYmKGomJmQmJihfLmlzUGxhaW5PYmplY3QoZCl8fChlPV8uaXNBcnJheShkKSkpPyhlPyhlPSExLGY9YyYmXy5pc0FycmF5KGMpP2M6W10pOmY9YyYmXy5pc1BsYWluT2JqZWN0KGMpP2M6e30sZ1tiXT1fLmV4dGVuZChqLGYsZCkpOnZvaWQgMCE9PWQmJihnW2JdPWQpKTtyZXR1cm4gZ30sXy5leHRlbmQoe2V4cGFuZG86XCJqUXVlcnlcIisoJCtNYXRoLnJhbmRvbSgpKS5yZXBsYWNlKC9cXEQvZyxcIlwiKSxpc1JlYWR5OiEwLGVycm9yOmZ1bmN0aW9uKGEpe3Rocm93IG5ldyBFcnJvcihhKX0sbm9vcDpmdW5jdGlvbigpe30saXNGdW5jdGlvbjpmdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT1fLnR5cGUoYSl9LGlzQXJyYXk6QXJyYXkuaXNBcnJheSxpc1dpbmRvdzpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YSYmYT09PWEud2luZG93fSxpc051bWVyaWM6ZnVuY3Rpb24oYSl7cmV0dXJuIV8uaXNBcnJheShhKSYmYS1wYXJzZUZsb2F0KGEpKzE+PTB9LGlzUGxhaW5PYmplY3Q6ZnVuY3Rpb24oYSl7cmV0dXJuXCJvYmplY3RcIiE9PV8udHlwZShhKXx8YS5ub2RlVHlwZXx8Xy5pc1dpbmRvdyhhKT8hMTphLmNvbnN0cnVjdG9yJiYhWC5jYWxsKGEuY29uc3RydWN0b3IucHJvdG90eXBlLFwiaXNQcm90b3R5cGVPZlwiKT8hMTohMH0saXNFbXB0eU9iamVjdDpmdW5jdGlvbihhKXt2YXIgYjtmb3IoYiBpbiBhKXJldHVybiExO3JldHVybiEwfSx0eXBlOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hP2ErXCJcIjpcIm9iamVjdFwiPT10eXBlb2YgYXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYT9WW1cuY2FsbChhKV18fFwib2JqZWN0XCI6dHlwZW9mIGF9LGdsb2JhbEV2YWw6ZnVuY3Rpb24oYSl7dmFyIGIsYz1ldmFsO2E9Xy50cmltKGEpLGEmJigxPT09YS5pbmRleE9mKFwidXNlIHN0cmljdFwiKT8oYj1aLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksYi50ZXh0PWEsWi5oZWFkLmFwcGVuZENoaWxkKGIpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYikpOmMoYSkpfSxjYW1lbENhc2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZShiYSxcIm1zLVwiKS5yZXBsYWNlKGNhLGRhKX0sbm9kZU5hbWU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5ub2RlTmFtZSYmYS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09Yi50b0xvd2VyQ2FzZSgpfSxlYWNoOmZ1bmN0aW9uKGEsYixkKXt2YXIgZSxmPTAsZz1hLmxlbmd0aCxoPWMoYSk7aWYoZCl7aWYoaClmb3IoO2c+ZiYmKGU9Yi5hcHBseShhW2ZdLGQpLGUhPT0hMSk7ZisrKTtlbHNlIGZvcihmIGluIGEpaWYoZT1iLmFwcGx5KGFbZl0sZCksZT09PSExKWJyZWFrfWVsc2UgaWYoaClmb3IoO2c+ZiYmKGU9Yi5jYWxsKGFbZl0sZixhW2ZdKSxlIT09ITEpO2YrKyk7ZWxzZSBmb3IoZiBpbiBhKWlmKGU9Yi5jYWxsKGFbZl0sZixhW2ZdKSxlPT09ITEpYnJlYWs7cmV0dXJuIGF9LHRyaW06ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PWE/XCJcIjooYStcIlwiKS5yZXBsYWNlKGFhLFwiXCIpfSxtYWtlQXJyYXk6ZnVuY3Rpb24oYSxiKXt2YXIgZD1ifHxbXTtyZXR1cm4gbnVsbCE9YSYmKGMoT2JqZWN0KGEpKT9fLm1lcmdlKGQsXCJzdHJpbmdcIj09dHlwZW9mIGE/W2FdOmEpOlQuY2FsbChkLGEpKSxkfSxpbkFycmF5OmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbnVsbD09Yj8tMTpVLmNhbGwoYixhLGMpfSxtZXJnZTpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0rYi5sZW5ndGgsZD0wLGU9YS5sZW5ndGg7Yz5kO2QrKylhW2UrK109YltkXTtyZXR1cm4gYS5sZW5ndGg9ZSxhfSxncmVwOmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQsZT1bXSxmPTAsZz1hLmxlbmd0aCxoPSFjO2c+ZjtmKyspZD0hYihhW2ZdLGYpLGQhPT1oJiZlLnB1c2goYVtmXSk7cmV0dXJuIGV9LG1hcDpmdW5jdGlvbihhLGIsZCl7dmFyIGUsZj0wLGc9YS5sZW5ndGgsaD1jKGEpLGk9W107aWYoaClmb3IoO2c+ZjtmKyspZT1iKGFbZl0sZixkKSxudWxsIT1lJiZpLnB1c2goZSk7ZWxzZSBmb3IoZiBpbiBhKWU9YihhW2ZdLGYsZCksbnVsbCE9ZSYmaS5wdXNoKGUpO3JldHVybiBTLmFwcGx5KFtdLGkpfSxndWlkOjEscHJveHk6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGU7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGImJihjPWFbYl0sYj1hLGE9YyksXy5pc0Z1bmN0aW9uKGEpPyhkPVIuY2FsbChhcmd1bWVudHMsMiksZT1mdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGJ8fHRoaXMsZC5jb25jYXQoUi5jYWxsKGFyZ3VtZW50cykpKX0sZS5ndWlkPWEuZ3VpZD1hLmd1aWR8fF8uZ3VpZCsrLGUpOnZvaWQgMH0sbm93OkRhdGUubm93LHN1cHBvcnQ6WX0pLF8uZWFjaChcIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSxiKXtWW1wiW29iamVjdCBcIitiK1wiXVwiXT1iLnRvTG93ZXJDYXNlKCl9KTt2YXIgZWE9LyohXG4gKiBTaXp6bGUgQ1NTIFNlbGVjdG9yIEVuZ2luZSB2Mi4yLjAtcHJlXG4gKiBodHRwOi8vc2l6emxlanMuY29tL1xuICpcbiAqIENvcHlyaWdodCAyMDA4LCAyMDE0IGpRdWVyeSBGb3VuZGF0aW9uLCBJbmMuIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIERhdGU6IDIwMTQtMTItMTZcbiAqL1xuZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhLGIsYyxkKXt2YXIgZSxmLGcsaCxpLGosbCxuLG8scDtpZigoYj9iLm93bmVyRG9jdW1lbnR8fGI6TykhPT1HJiZGKGIpLGI9Ynx8RyxjPWN8fFtdLGg9Yi5ub2RlVHlwZSxcInN0cmluZ1wiIT10eXBlb2YgYXx8IWF8fDEhPT1oJiY5IT09aCYmMTEhPT1oKXJldHVybiBjO2lmKCFkJiZJKXtpZigxMSE9PWgmJihlPXNhLmV4ZWMoYSkpKWlmKGc9ZVsxXSl7aWYoOT09PWgpe2lmKGY9Yi5nZXRFbGVtZW50QnlJZChnKSwhZnx8IWYucGFyZW50Tm9kZSlyZXR1cm4gYztpZihmLmlkPT09ZylyZXR1cm4gYy5wdXNoKGYpLGN9ZWxzZSBpZihiLm93bmVyRG9jdW1lbnQmJihmPWIub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChnKSkmJk0oYixmKSYmZi5pZD09PWcpcmV0dXJuIGMucHVzaChmKSxjfWVsc2V7aWYoZVsyXSlyZXR1cm4gJC5hcHBseShjLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSkpLGM7aWYoKGc9ZVszXSkmJnYuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSlyZXR1cm4gJC5hcHBseShjLGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShnKSksY31pZih2LnFzYSYmKCFKfHwhSi50ZXN0KGEpKSl7aWYobj1sPU4sbz1iLHA9MSE9PWgmJmEsMT09PWgmJlwib2JqZWN0XCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpe2ZvcihqPXooYSksKGw9Yi5nZXRBdHRyaWJ1dGUoXCJpZFwiKSk/bj1sLnJlcGxhY2UodWEsXCJcXFxcJCZcIik6Yi5zZXRBdHRyaWJ1dGUoXCJpZFwiLG4pLG49XCJbaWQ9J1wiK24rXCInXSBcIixpPWoubGVuZ3RoO2ktLTspaltpXT1uK20oaltpXSk7bz10YS50ZXN0KGEpJiZrKGIucGFyZW50Tm9kZSl8fGIscD1qLmpvaW4oXCIsXCIpfWlmKHApdHJ5e3JldHVybiAkLmFwcGx5KGMsby5xdWVyeVNlbGVjdG9yQWxsKHApKSxjfWNhdGNoKHEpe31maW5hbGx5e2x8fGIucmVtb3ZlQXR0cmlidXRlKFwiaWRcIil9fX1yZXR1cm4gQihhLnJlcGxhY2UoaWEsXCIkMVwiKSxiLGMsZCl9ZnVuY3Rpb24gYygpe2Z1bmN0aW9uIGEoYyxkKXtyZXR1cm4gYi5wdXNoKGMrXCIgXCIpPncuY2FjaGVMZW5ndGgmJmRlbGV0ZSBhW2Iuc2hpZnQoKV0sYVtjK1wiIFwiXT1kfXZhciBiPVtdO3JldHVybiBhfWZ1bmN0aW9uIGQoYSl7cmV0dXJuIGFbTl09ITAsYX1mdW5jdGlvbiBlKGEpe3ZhciBiPUcuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7cmV0dXJuISFhKGIpfWNhdGNoKGMpe3JldHVybiExfWZpbmFsbHl7Yi5wYXJlbnROb2RlJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYiksYj1udWxsfX1mdW5jdGlvbiBmKGEsYil7Zm9yKHZhciBjPWEuc3BsaXQoXCJ8XCIpLGQ9YS5sZW5ndGg7ZC0tOyl3LmF0dHJIYW5kbGVbY1tkXV09Yn1mdW5jdGlvbiBnKGEsYil7dmFyIGM9YiYmYSxkPWMmJjE9PT1hLm5vZGVUeXBlJiYxPT09Yi5ub2RlVHlwZSYmKH5iLnNvdXJjZUluZGV4fHxWKS0ofmEuc291cmNlSW5kZXh8fFYpO2lmKGQpcmV0dXJuIGQ7aWYoYylmb3IoO2M9Yy5uZXh0U2libGluZzspaWYoYz09PWIpcmV0dXJuLTE7cmV0dXJuIGE/MTotMX1mdW5jdGlvbiBoKGEpe3JldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJpbnB1dFwiPT09YyYmYi50eXBlPT09YX19ZnVuY3Rpb24gaShhKXtyZXR1cm4gZnVuY3Rpb24oYil7dmFyIGM9Yi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVybihcImlucHV0XCI9PT1jfHxcImJ1dHRvblwiPT09YykmJmIudHlwZT09PWF9fWZ1bmN0aW9uIGooYSl7cmV0dXJuIGQoZnVuY3Rpb24oYil7cmV0dXJuIGI9K2IsZChmdW5jdGlvbihjLGQpe2Zvcih2YXIgZSxmPWEoW10sYy5sZW5ndGgsYiksZz1mLmxlbmd0aDtnLS07KWNbZT1mW2ddXSYmKGNbZV09IShkW2VdPWNbZV0pKX0pfSl9ZnVuY3Rpb24gayhhKXtyZXR1cm4gYSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUmJmF9ZnVuY3Rpb24gbCgpe31mdW5jdGlvbiBtKGEpe2Zvcih2YXIgYj0wLGM9YS5sZW5ndGgsZD1cIlwiO2M+YjtiKyspZCs9YVtiXS52YWx1ZTtyZXR1cm4gZH1mdW5jdGlvbiBuKGEsYixjKXt2YXIgZD1iLmRpcixlPWMmJlwicGFyZW50Tm9kZVwiPT09ZCxmPVErKztyZXR1cm4gYi5maXJzdD9mdW5jdGlvbihiLGMsZil7Zm9yKDtiPWJbZF07KWlmKDE9PT1iLm5vZGVUeXBlfHxlKXJldHVybiBhKGIsYyxmKX06ZnVuY3Rpb24oYixjLGcpe3ZhciBoLGksaj1bUCxmXTtpZihnKXtmb3IoO2I9YltkXTspaWYoKDE9PT1iLm5vZGVUeXBlfHxlKSYmYShiLGMsZykpcmV0dXJuITB9ZWxzZSBmb3IoO2I9YltkXTspaWYoMT09PWIubm9kZVR5cGV8fGUpe2lmKGk9YltOXXx8KGJbTl09e30pLChoPWlbZF0pJiZoWzBdPT09UCYmaFsxXT09PWYpcmV0dXJuIGpbMl09aFsyXTtpZihpW2RdPWosalsyXT1hKGIsYyxnKSlyZXR1cm4hMH19fWZ1bmN0aW9uIG8oYSl7cmV0dXJuIGEubGVuZ3RoPjE/ZnVuY3Rpb24oYixjLGQpe2Zvcih2YXIgZT1hLmxlbmd0aDtlLS07KWlmKCFhW2VdKGIsYyxkKSlyZXR1cm4hMTtyZXR1cm4hMH06YVswXX1mdW5jdGlvbiBwKGEsYyxkKXtmb3IodmFyIGU9MCxmPWMubGVuZ3RoO2Y+ZTtlKyspYihhLGNbZV0sZCk7cmV0dXJuIGR9ZnVuY3Rpb24gcShhLGIsYyxkLGUpe2Zvcih2YXIgZixnPVtdLGg9MCxpPWEubGVuZ3RoLGo9bnVsbCE9YjtpPmg7aCsrKShmPWFbaF0pJiYoIWN8fGMoZixkLGUpKSYmKGcucHVzaChmKSxqJiZiLnB1c2goaCkpO3JldHVybiBnfWZ1bmN0aW9uIHIoYSxiLGMsZSxmLGcpe3JldHVybiBlJiYhZVtOXSYmKGU9cihlKSksZiYmIWZbTl0mJihmPXIoZixnKSksZChmdW5jdGlvbihkLGcsaCxpKXt2YXIgaixrLGwsbT1bXSxuPVtdLG89Zy5sZW5ndGgscj1kfHxwKGJ8fFwiKlwiLGgubm9kZVR5cGU/W2hdOmgsW10pLHM9IWF8fCFkJiZiP3I6cShyLG0sYSxoLGkpLHQ9Yz9mfHwoZD9hOm98fGUpP1tdOmc6cztpZihjJiZjKHMsdCxoLGkpLGUpZm9yKGo9cSh0LG4pLGUoaixbXSxoLGkpLGs9ai5sZW5ndGg7ay0tOykobD1qW2tdKSYmKHRbbltrXV09IShzW25ba11dPWwpKTtpZihkKXtpZihmfHxhKXtpZihmKXtmb3Ioaj1bXSxrPXQubGVuZ3RoO2stLTspKGw9dFtrXSkmJmoucHVzaChzW2tdPWwpO2YobnVsbCx0PVtdLGosaSl9Zm9yKGs9dC5sZW5ndGg7ay0tOykobD10W2tdKSYmKGo9Zj9hYShkLGwpOm1ba10pPi0xJiYoZFtqXT0hKGdbal09bCkpfX1lbHNlIHQ9cSh0PT09Zz90LnNwbGljZShvLHQubGVuZ3RoKTp0KSxmP2YobnVsbCxnLHQsaSk6JC5hcHBseShnLHQpfSl9ZnVuY3Rpb24gcyhhKXtmb3IodmFyIGIsYyxkLGU9YS5sZW5ndGgsZj13LnJlbGF0aXZlW2FbMF0udHlwZV0sZz1mfHx3LnJlbGF0aXZlW1wiIFwiXSxoPWY/MTowLGk9bihmdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9LGcsITApLGo9bihmdW5jdGlvbihhKXtyZXR1cm4gYWEoYixhKT4tMX0sZywhMCksaz1bZnVuY3Rpb24oYSxjLGQpe3ZhciBlPSFmJiYoZHx8YyE9PUMpfHwoKGI9Yykubm9kZVR5cGU/aShhLGMsZCk6aihhLGMsZCkpO3JldHVybiBiPW51bGwsZX1dO2U+aDtoKyspaWYoYz13LnJlbGF0aXZlW2FbaF0udHlwZV0paz1bbihvKGspLGMpXTtlbHNle2lmKGM9dy5maWx0ZXJbYVtoXS50eXBlXS5hcHBseShudWxsLGFbaF0ubWF0Y2hlcyksY1tOXSl7Zm9yKGQ9KytoO2U+ZCYmIXcucmVsYXRpdmVbYVtkXS50eXBlXTtkKyspO3JldHVybiByKGg+MSYmbyhrKSxoPjEmJm0oYS5zbGljZSgwLGgtMSkuY29uY2F0KHt2YWx1ZTpcIiBcIj09PWFbaC0yXS50eXBlP1wiKlwiOlwiXCJ9KSkucmVwbGFjZShpYSxcIiQxXCIpLGMsZD5oJiZzKGEuc2xpY2UoaCxkKSksZT5kJiZzKGE9YS5zbGljZShkKSksZT5kJiZtKGEpKX1rLnB1c2goYyl9cmV0dXJuIG8oayl9ZnVuY3Rpb24gdChhLGMpe3ZhciBlPWMubGVuZ3RoPjAsZj1hLmxlbmd0aD4wLGc9ZnVuY3Rpb24oZCxnLGgsaSxqKXt2YXIgayxsLG0sbj0wLG89XCIwXCIscD1kJiZbXSxyPVtdLHM9Qyx0PWR8fGYmJncuZmluZC5UQUcoXCIqXCIsaiksdT1QKz1udWxsPT1zPzE6TWF0aC5yYW5kb20oKXx8LjEsdj10Lmxlbmd0aDtmb3IoaiYmKEM9ZyE9PUcmJmcpO28hPT12JiZudWxsIT0oaz10W29dKTtvKyspe2lmKGYmJmspe2ZvcihsPTA7bT1hW2wrK107KWlmKG0oayxnLGgpKXtpLnB1c2goayk7YnJlYWt9aiYmKFA9dSl9ZSYmKChrPSFtJiZrKSYmbi0tLGQmJnAucHVzaChrKSl9aWYobis9byxlJiZvIT09bil7Zm9yKGw9MDttPWNbbCsrXTspbShwLHIsZyxoKTtpZihkKXtpZihuPjApZm9yKDtvLS07KXBbb118fHJbb118fChyW29dPVkuY2FsbChpKSk7cj1xKHIpfSQuYXBwbHkoaSxyKSxqJiYhZCYmci5sZW5ndGg+MCYmbitjLmxlbmd0aD4xJiZiLnVuaXF1ZVNvcnQoaSl9cmV0dXJuIGomJihQPXUsQz1zKSxwfTtyZXR1cm4gZT9kKGcpOmd9dmFyIHUsdix3LHgseSx6LEEsQixDLEQsRSxGLEcsSCxJLEosSyxMLE0sTj1cInNpenpsZVwiKzEqbmV3IERhdGUsTz1hLmRvY3VtZW50LFA9MCxRPTAsUj1jKCksUz1jKCksVD1jKCksVT1mdW5jdGlvbihhLGIpe3JldHVybiBhPT09YiYmKEU9ITApLDB9LFY9MTw8MzEsVz17fS5oYXNPd25Qcm9wZXJ0eSxYPVtdLFk9WC5wb3AsWj1YLnB1c2gsJD1YLnB1c2gsXz1YLnNsaWNlLGFhPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTAsZD1hLmxlbmd0aDtkPmM7YysrKWlmKGFbY109PT1iKXJldHVybiBjO3JldHVybi0xfSxiYT1cImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsY2E9XCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLGRhPVwiKD86XFxcXFxcXFwufFtcXFxcdy1dfFteXFxcXHgwMC1cXFxceGEwXSkrXCIsZWE9ZGEucmVwbGFjZShcIndcIixcIncjXCIpLGZhPVwiXFxcXFtcIitjYStcIiooXCIrZGErXCIpKD86XCIrY2ErXCIqKFsqXiR8IX5dPz0pXCIrY2ErXCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIitlYStcIikpfClcIitjYStcIipcXFxcXVwiLGdhPVwiOihcIitkYStcIikoPzpcXFxcKCgoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXwoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIrZmErXCIpKil8LiopXFxcXCl8KVwiLGhhPW5ldyBSZWdFeHAoY2ErXCIrXCIsXCJnXCIpLGlhPW5ldyBSZWdFeHAoXCJeXCIrY2ErXCIrfCgoPzpefFteXFxcXFxcXFxdKSg/OlxcXFxcXFxcLikqKVwiK2NhK1wiKyRcIixcImdcIiksamE9bmV3IFJlZ0V4cChcIl5cIitjYStcIiosXCIrY2ErXCIqXCIpLGthPW5ldyBSZWdFeHAoXCJeXCIrY2ErXCIqKFs+K35dfFwiK2NhK1wiKVwiK2NhK1wiKlwiKSxsYT1uZXcgUmVnRXhwKFwiPVwiK2NhK1wiKihbXlxcXFxdJ1xcXCJdKj8pXCIrY2ErXCIqXFxcXF1cIixcImdcIiksbWE9bmV3IFJlZ0V4cChnYSksbmE9bmV3IFJlZ0V4cChcIl5cIitlYStcIiRcIiksb2E9e0lEOm5ldyBSZWdFeHAoXCJeIyhcIitkYStcIilcIiksQ0xBU1M6bmV3IFJlZ0V4cChcIl5cXFxcLihcIitkYStcIilcIiksVEFHOm5ldyBSZWdFeHAoXCJeKFwiK2RhLnJlcGxhY2UoXCJ3XCIsXCJ3KlwiKStcIilcIiksQVRUUjpuZXcgUmVnRXhwKFwiXlwiK2ZhKSxQU0VVRE86bmV3IFJlZ0V4cChcIl5cIitnYSksQ0hJTEQ6bmV3IFJlZ0V4cChcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIrY2ErXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIitjYStcIiooPzooWystXXwpXCIrY2ErXCIqKFxcXFxkKyl8KSlcIitjYStcIipcXFxcKXwpXCIsXCJpXCIpLGJvb2w6bmV3IFJlZ0V4cChcIl4oPzpcIitiYStcIikkXCIsXCJpXCIpLG5lZWRzQ29udGV4dDpuZXcgUmVnRXhwKFwiXlwiK2NhK1wiKls+K35dfDooZXZlbnxvZGR8ZXF8Z3R8bHR8bnRofGZpcnN0fGxhc3QpKD86XFxcXChcIitjYStcIiooKD86LVxcXFxkKT9cXFxcZCopXCIrY2ErXCIqXFxcXCl8KSg/PVteLV18JClcIixcImlcIil9LHBhPS9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2kscWE9L15oXFxkJC9pLHJhPS9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sc2E9L14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sdGE9L1srfl0vLHVhPS8nfFxcXFwvZyx2YT1uZXcgUmVnRXhwKFwiXFxcXFxcXFwoW1xcXFxkYS1mXXsxLDZ9XCIrY2ErXCI/fChcIitjYStcIil8LilcIixcImlnXCIpLHdhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1cIjB4XCIrYi02NTUzNjtyZXR1cm4gZCE9PWR8fGM/YjowPmQ/U3RyaW5nLmZyb21DaGFyQ29kZShkKzY1NTM2KTpTdHJpbmcuZnJvbUNoYXJDb2RlKGQ+PjEwfDU1Mjk2LDEwMjMmZHw1NjMyMCl9LHhhPWZ1bmN0aW9uKCl7RigpfTt0cnl7JC5hcHBseShYPV8uY2FsbChPLmNoaWxkTm9kZXMpLE8uY2hpbGROb2RlcyksWFtPLmNoaWxkTm9kZXMubGVuZ3RoXS5ub2RlVHlwZX1jYXRjaCh5YSl7JD17YXBwbHk6WC5sZW5ndGg/ZnVuY3Rpb24oYSxiKXtaLmFwcGx5KGEsXy5jYWxsKGIpKX06ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9YS5sZW5ndGgsZD0wO2FbYysrXT1iW2QrK107KTthLmxlbmd0aD1jLTF9fX12PWIuc3VwcG9ydD17fSx5PWIuaXNYTUw9ZnVuY3Rpb24oYSl7dmFyIGI9YSYmKGEub3duZXJEb2N1bWVudHx8YSkuZG9jdW1lbnRFbGVtZW50O3JldHVybiBiP1wiSFRNTFwiIT09Yi5ub2RlTmFtZTohMX0sRj1iLnNldERvY3VtZW50PWZ1bmN0aW9uKGEpe3ZhciBiLGMsZD1hP2Eub3duZXJEb2N1bWVudHx8YTpPO3JldHVybiBkIT09RyYmOT09PWQubm9kZVR5cGUmJmQuZG9jdW1lbnRFbGVtZW50PyhHPWQsSD1kLmRvY3VtZW50RWxlbWVudCxjPWQuZGVmYXVsdFZpZXcsYyYmYyE9PWMudG9wJiYoYy5hZGRFdmVudExpc3RlbmVyP2MuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLHhhLCExKTpjLmF0dGFjaEV2ZW50JiZjLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIix4YSkpLEk9IXkoZCksdi5hdHRyaWJ1dGVzPWUoZnVuY3Rpb24oYSl7cmV0dXJuIGEuY2xhc3NOYW1lPVwiaVwiLCFhLmdldEF0dHJpYnV0ZShcImNsYXNzTmFtZVwiKX0pLHYuZ2V0RWxlbWVudHNCeVRhZ05hbWU9ZShmdW5jdGlvbihhKXtyZXR1cm4gYS5hcHBlbmRDaGlsZChkLmNyZWF0ZUNvbW1lbnQoXCJcIikpLCFhLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKS5sZW5ndGh9KSx2LmdldEVsZW1lbnRzQnlDbGFzc05hbWU9cmEudGVzdChkLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpLHYuZ2V0QnlJZD1lKGZ1bmN0aW9uKGEpe3JldHVybiBILmFwcGVuZENoaWxkKGEpLmlkPU4sIWQuZ2V0RWxlbWVudHNCeU5hbWV8fCFkLmdldEVsZW1lbnRzQnlOYW1lKE4pLmxlbmd0aH0pLHYuZ2V0QnlJZD8ody5maW5kLklEPWZ1bmN0aW9uKGEsYil7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGIuZ2V0RWxlbWVudEJ5SWQmJkkpe3ZhciBjPWIuZ2V0RWxlbWVudEJ5SWQoYSk7cmV0dXJuIGMmJmMucGFyZW50Tm9kZT9bY106W119fSx3LmZpbHRlci5JRD1mdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UodmEsd2EpO3JldHVybiBmdW5jdGlvbihhKXtyZXR1cm4gYS5nZXRBdHRyaWJ1dGUoXCJpZFwiKT09PWJ9fSk6KGRlbGV0ZSB3LmZpbmQuSUQsdy5maWx0ZXIuSUQ9ZnVuY3Rpb24oYSl7dmFyIGI9YS5yZXBsYWNlKHZhLHdhKTtyZXR1cm4gZnVuY3Rpb24oYSl7dmFyIGM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0QXR0cmlidXRlTm9kZSYmYS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7cmV0dXJuIGMmJmMudmFsdWU9PT1ifX0pLHcuZmluZC5UQUc9di5nZXRFbGVtZW50c0J5VGFnTmFtZT9mdW5jdGlvbihhLGIpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmdldEVsZW1lbnRzQnlUYWdOYW1lP2IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk6di5xc2E/Yi5xdWVyeVNlbGVjdG9yQWxsKGEpOnZvaWQgMH06ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9MCxmPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk7aWYoXCIqXCI9PT1hKXtmb3IoO2M9ZltlKytdOykxPT09Yy5ub2RlVHlwZSYmZC5wdXNoKGMpO3JldHVybiBkfXJldHVybiBmfSx3LmZpbmQuQ0xBU1M9di5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZmdW5jdGlvbihhLGIpe3JldHVybiBJP2IuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShhKTp2b2lkIDB9LEs9W10sSj1bXSwodi5xc2E9cmEudGVzdChkLnF1ZXJ5U2VsZWN0b3JBbGwpKSYmKGUoZnVuY3Rpb24oYSl7SC5hcHBlbmRDaGlsZChhKS5pbm5lckhUTUw9XCI8YSBpZD0nXCIrTitcIic+PC9hPjxzZWxlY3QgaWQ9J1wiK04rXCItXFxmXScgbXNhbGxvd2NhcHR1cmU9Jyc+PG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIixhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiKS5sZW5ndGgmJkoucHVzaChcIlsqXiRdPVwiK2NhK1wiKig/OicnfFxcXCJcXFwiKVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbc2VsZWN0ZWRdXCIpLmxlbmd0aHx8Si5wdXNoKFwiXFxcXFtcIitjYStcIiooPzp2YWx1ZXxcIitiYStcIilcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiW2lkfj1cIitOK1wiLV1cIikubGVuZ3RofHxKLnB1c2goXCJ+PVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGh8fEoucHVzaChcIjpjaGVja2VkXCIpLGEucXVlcnlTZWxlY3RvckFsbChcImEjXCIrTitcIisqXCIpLmxlbmd0aHx8Si5wdXNoKFwiLiMuK1srfl1cIil9KSxlKGZ1bmN0aW9uKGEpe3ZhciBiPWQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO2Iuc2V0QXR0cmlidXRlKFwidHlwZVwiLFwiaGlkZGVuXCIpLGEuYXBwZW5kQ2hpbGQoYikuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwiRFwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbmFtZT1kXVwiKS5sZW5ndGgmJkoucHVzaChcIm5hbWVcIitjYStcIipbKl4kfCF+XT89XCIpLGEucXVlcnlTZWxlY3RvckFsbChcIjplbmFibGVkXCIpLmxlbmd0aHx8Si5wdXNoKFwiOmVuYWJsZWRcIixcIjpkaXNhYmxlZFwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqLDp4XCIpLEoucHVzaChcIiwuKjpcIil9KSksKHYubWF0Y2hlc1NlbGVjdG9yPXJhLnRlc3QoTD1ILm1hdGNoZXN8fEgud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxILm1vek1hdGNoZXNTZWxlY3Rvcnx8SC5vTWF0Y2hlc1NlbGVjdG9yfHxILm1zTWF0Y2hlc1NlbGVjdG9yKSkmJmUoZnVuY3Rpb24oYSl7di5kaXNjb25uZWN0ZWRNYXRjaD1MLmNhbGwoYSxcImRpdlwiKSxMLmNhbGwoYSxcIltzIT0nJ106eFwiKSxLLnB1c2goXCIhPVwiLGdhKX0pLEo9Si5sZW5ndGgmJm5ldyBSZWdFeHAoSi5qb2luKFwifFwiKSksSz1LLmxlbmd0aCYmbmV3IFJlZ0V4cChLLmpvaW4oXCJ8XCIpKSxiPXJhLnRlc3QoSC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiksTT1ifHxyYS50ZXN0KEguY29udGFpbnMpP2Z1bmN0aW9uKGEsYil7dmFyIGM9OT09PWEubm9kZVR5cGU/YS5kb2N1bWVudEVsZW1lbnQ6YSxkPWImJmIucGFyZW50Tm9kZTtyZXR1cm4gYT09PWR8fCEoIWR8fDEhPT1kLm5vZGVUeXBlfHwhKGMuY29udGFpbnM/Yy5jb250YWlucyhkKTphLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uJiYxNiZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGQpKSl9OmZ1bmN0aW9uKGEsYil7aWYoYilmb3IoO2I9Yi5wYXJlbnROb2RlOylpZihiPT09YSlyZXR1cm4hMDtyZXR1cm4hMX0sVT1iP2Z1bmN0aW9uKGEsYil7aWYoYT09PWIpcmV0dXJuIEU9ITAsMDt2YXIgYz0hYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbi0hYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtyZXR1cm4gYz9jOihjPShhLm93bmVyRG9jdW1lbnR8fGEpPT09KGIub3duZXJEb2N1bWVudHx8Yik/YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihiKToxLDEmY3x8IXYuc29ydERldGFjaGVkJiZiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGEpPT09Yz9hPT09ZHx8YS5vd25lckRvY3VtZW50PT09TyYmTShPLGEpPy0xOmI9PT1kfHxiLm93bmVyRG9jdW1lbnQ9PT1PJiZNKE8sYik/MTpEP2FhKEQsYSktYWEoRCxiKTowOjQmYz8tMToxKX06ZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4gRT0hMCwwO3ZhciBjLGU9MCxmPWEucGFyZW50Tm9kZSxoPWIucGFyZW50Tm9kZSxpPVthXSxqPVtiXTtpZighZnx8IWgpcmV0dXJuIGE9PT1kPy0xOmI9PT1kPzE6Zj8tMTpoPzE6RD9hYShELGEpLWFhKEQsYik6MDtpZihmPT09aClyZXR1cm4gZyhhLGIpO2ZvcihjPWE7Yz1jLnBhcmVudE5vZGU7KWkudW5zaGlmdChjKTtmb3IoYz1iO2M9Yy5wYXJlbnROb2RlOylqLnVuc2hpZnQoYyk7Zm9yKDtpW2VdPT09altlXTspZSsrO3JldHVybiBlP2coaVtlXSxqW2VdKTppW2VdPT09Tz8tMTpqW2VdPT09Tz8xOjB9LGQpOkd9LGIubWF0Y2hlcz1mdW5jdGlvbihhLGMpe3JldHVybiBiKGEsbnVsbCxudWxsLGMpfSxiLm1hdGNoZXNTZWxlY3Rvcj1mdW5jdGlvbihhLGMpe2lmKChhLm93bmVyRG9jdW1lbnR8fGEpIT09RyYmRihhKSxjPWMucmVwbGFjZShsYSxcIj0nJDEnXVwiKSwhKCF2Lm1hdGNoZXNTZWxlY3Rvcnx8IUl8fEsmJksudGVzdChjKXx8SiYmSi50ZXN0KGMpKSl0cnl7dmFyIGQ9TC5jYWxsKGEsYyk7aWYoZHx8di5kaXNjb25uZWN0ZWRNYXRjaHx8YS5kb2N1bWVudCYmMTEhPT1hLmRvY3VtZW50Lm5vZGVUeXBlKXJldHVybiBkfWNhdGNoKGUpe31yZXR1cm4gYihjLEcsbnVsbCxbYV0pLmxlbmd0aD4wfSxiLmNvbnRhaW5zPWZ1bmN0aW9uKGEsYil7cmV0dXJuKGEub3duZXJEb2N1bWVudHx8YSkhPT1HJiZGKGEpLE0oYSxiKX0sYi5hdHRyPWZ1bmN0aW9uKGEsYil7KGEub3duZXJEb2N1bWVudHx8YSkhPT1HJiZGKGEpO3ZhciBjPXcuYXR0ckhhbmRsZVtiLnRvTG93ZXJDYXNlKCldLGQ9YyYmVy5jYWxsKHcuYXR0ckhhbmRsZSxiLnRvTG93ZXJDYXNlKCkpP2MoYSxiLCFJKTp2b2lkIDA7cmV0dXJuIHZvaWQgMCE9PWQ/ZDp2LmF0dHJpYnV0ZXN8fCFJP2EuZ2V0QXR0cmlidXRlKGIpOihkPWEuZ2V0QXR0cmlidXRlTm9kZShiKSkmJmQuc3BlY2lmaWVkP2QudmFsdWU6bnVsbH0sYi5lcnJvcj1mdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIithKX0sYi51bmlxdWVTb3J0PWZ1bmN0aW9uKGEpe3ZhciBiLGM9W10sZD0wLGU9MDtpZihFPSF2LmRldGVjdER1cGxpY2F0ZXMsRD0hdi5zb3J0U3RhYmxlJiZhLnNsaWNlKDApLGEuc29ydChVKSxFKXtmb3IoO2I9YVtlKytdOyliPT09YVtlXSYmKGQ9Yy5wdXNoKGUpKTtmb3IoO2QtLTspYS5zcGxpY2UoY1tkXSwxKX1yZXR1cm4gRD1udWxsLGF9LHg9Yi5nZXRUZXh0PWZ1bmN0aW9uKGEpe3ZhciBiLGM9XCJcIixkPTAsZT1hLm5vZGVUeXBlO2lmKGUpe2lmKDE9PT1lfHw5PT09ZXx8MTE9PT1lKXtpZihcInN0cmluZ1wiPT10eXBlb2YgYS50ZXh0Q29udGVudClyZXR1cm4gYS50ZXh0Q29udGVudDtmb3IoYT1hLmZpcnN0Q2hpbGQ7YTthPWEubmV4dFNpYmxpbmcpYys9eChhKX1lbHNlIGlmKDM9PT1lfHw0PT09ZSlyZXR1cm4gYS5ub2RlVmFsdWV9ZWxzZSBmb3IoO2I9YVtkKytdOyljKz14KGIpO3JldHVybiBjfSx3PWIuc2VsZWN0b3JzPXtjYWNoZUxlbmd0aDo1MCxjcmVhdGVQc2V1ZG86ZCxtYXRjaDpvYSxhdHRySGFuZGxlOnt9LGZpbmQ6e30scmVsYXRpdmU6e1wiPlwiOntkaXI6XCJwYXJlbnROb2RlXCIsZmlyc3Q6ITB9LFwiIFwiOntkaXI6XCJwYXJlbnROb2RlXCJ9LFwiK1wiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIixmaXJzdDohMH0sXCJ+XCI6e2RpcjpcInByZXZpb3VzU2libGluZ1wifX0scHJlRmlsdGVyOntBVFRSOmZ1bmN0aW9uKGEpe3JldHVybiBhWzFdPWFbMV0ucmVwbGFjZSh2YSx3YSksYVszXT0oYVszXXx8YVs0XXx8YVs1XXx8XCJcIikucmVwbGFjZSh2YSx3YSksXCJ+PVwiPT09YVsyXSYmKGFbM109XCIgXCIrYVszXStcIiBcIiksYS5zbGljZSgwLDQpfSxDSElMRDpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnRvTG93ZXJDYXNlKCksXCJudGhcIj09PWFbMV0uc2xpY2UoMCwzKT8oYVszXXx8Yi5lcnJvcihhWzBdKSxhWzRdPSsoYVs0XT9hWzVdKyhhWzZdfHwxKToyKihcImV2ZW5cIj09PWFbM118fFwib2RkXCI9PT1hWzNdKSksYVs1XT0rKGFbN10rYVs4XXx8XCJvZGRcIj09PWFbM10pKTphWzNdJiZiLmVycm9yKGFbMF0pLGF9LFBTRVVETzpmdW5jdGlvbihhKXt2YXIgYixjPSFhWzZdJiZhWzJdO3JldHVybiBvYS5DSElMRC50ZXN0KGFbMF0pP251bGw6KGFbM10/YVsyXT1hWzRdfHxhWzVdfHxcIlwiOmMmJm1hLnRlc3QoYykmJihiPXooYywhMCkpJiYoYj1jLmluZGV4T2YoXCIpXCIsYy5sZW5ndGgtYiktYy5sZW5ndGgpJiYoYVswXT1hWzBdLnNsaWNlKDAsYiksYVsyXT1jLnNsaWNlKDAsYikpLGEuc2xpY2UoMCwzKSl9fSxmaWx0ZXI6e1RBRzpmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UodmEsd2EpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCIqXCI9PT1hP2Z1bmN0aW9uKCl7cmV0dXJuITB9OmZ1bmN0aW9uKGEpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1ifX0sQ0xBU1M6ZnVuY3Rpb24oYSl7dmFyIGI9UlthK1wiIFwiXTtyZXR1cm4gYnx8KGI9bmV3IFJlZ0V4cChcIihefFwiK2NhK1wiKVwiK2ErXCIoXCIrY2ErXCJ8JClcIikpJiZSKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGIudGVzdChcInN0cmluZ1wiPT10eXBlb2YgYS5jbGFzc05hbWUmJmEuY2xhc3NOYW1lfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5nZXRBdHRyaWJ1dGUmJmEuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCIpfSl9LEFUVFI6ZnVuY3Rpb24oYSxjLGQpe3JldHVybiBmdW5jdGlvbihlKXt2YXIgZj1iLmF0dHIoZSxhKTtyZXR1cm4gbnVsbD09Zj9cIiE9XCI9PT1jOmM/KGYrPVwiXCIsXCI9XCI9PT1jP2Y9PT1kOlwiIT1cIj09PWM/ZiE9PWQ6XCJePVwiPT09Yz9kJiYwPT09Zi5pbmRleE9mKGQpOlwiKj1cIj09PWM/ZCYmZi5pbmRleE9mKGQpPi0xOlwiJD1cIj09PWM/ZCYmZi5zbGljZSgtZC5sZW5ndGgpPT09ZDpcIn49XCI9PT1jPyhcIiBcIitmLnJlcGxhY2UoaGEsXCIgXCIpK1wiIFwiKS5pbmRleE9mKGQpPi0xOlwifD1cIj09PWM/Zj09PWR8fGYuc2xpY2UoMCxkLmxlbmd0aCsxKT09PWQrXCItXCI6ITEpOiEwfX0sQ0hJTEQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1cIm50aFwiIT09YS5zbGljZSgwLDMpLGc9XCJsYXN0XCIhPT1hLnNsaWNlKC00KSxoPVwib2YtdHlwZVwiPT09YjtyZXR1cm4gMT09PWQmJjA9PT1lP2Z1bmN0aW9uKGEpe3JldHVybiEhYS5wYXJlbnROb2RlfTpmdW5jdGlvbihiLGMsaSl7dmFyIGosayxsLG0sbixvLHA9ZiE9PWc/XCJuZXh0U2libGluZ1wiOlwicHJldmlvdXNTaWJsaW5nXCIscT1iLnBhcmVudE5vZGUscj1oJiZiLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkscz0haSYmIWg7aWYocSl7aWYoZil7Zm9yKDtwOyl7Zm9yKGw9YjtsPWxbcF07KWlmKGg/bC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpPT09cjoxPT09bC5ub2RlVHlwZSlyZXR1cm4hMTtvPXA9XCJvbmx5XCI9PT1hJiYhbyYmXCJuZXh0U2libGluZ1wifXJldHVybiEwfWlmKG89W2c/cS5maXJzdENoaWxkOnEubGFzdENoaWxkXSxnJiZzKXtmb3Ioaz1xW05dfHwocVtOXT17fSksaj1rW2FdfHxbXSxuPWpbMF09PT1QJiZqWzFdLG09alswXT09PVAmJmpbMl0sbD1uJiZxLmNoaWxkTm9kZXNbbl07bD0rK24mJmwmJmxbcF18fChtPW49MCl8fG8ucG9wKCk7KWlmKDE9PT1sLm5vZGVUeXBlJiYrK20mJmw9PT1iKXtrW2FdPVtQLG4sbV07YnJlYWt9fWVsc2UgaWYocyYmKGo9KGJbTl18fChiW05dPXt9KSlbYV0pJiZqWzBdPT09UCltPWpbMV07ZWxzZSBmb3IoOyhsPSsrbiYmbCYmbFtwXXx8KG09bj0wKXx8by5wb3AoKSkmJigoaD9sLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkhPT1yOjEhPT1sLm5vZGVUeXBlKXx8ISsrbXx8KHMmJigobFtOXXx8KGxbTl09e30pKVthXT1bUCxtXSksbCE9PWIpKTspO3JldHVybiBtLT1lLG09PT1kfHxtJWQ9PT0wJiZtL2Q+PTB9fX0sUFNFVURPOmZ1bmN0aW9uKGEsYyl7dmFyIGUsZj13LnBzZXVkb3NbYV18fHcuc2V0RmlsdGVyc1thLnRvTG93ZXJDYXNlKCldfHxiLmVycm9yKFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIithKTtyZXR1cm4gZltOXT9mKGMpOmYubGVuZ3RoPjE/KGU9W2EsYSxcIlwiLGNdLHcuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eShhLnRvTG93ZXJDYXNlKCkpP2QoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGQsZT1mKGEsYyksZz1lLmxlbmd0aDtnLS07KWQ9YWEoYSxlW2ddKSxhW2RdPSEoYltkXT1lW2ddKX0pOmZ1bmN0aW9uKGEpe3JldHVybiBmKGEsMCxlKX0pOmZ9fSxwc2V1ZG9zOntub3Q6ZChmdW5jdGlvbihhKXt2YXIgYj1bXSxjPVtdLGU9QShhLnJlcGxhY2UoaWEsXCIkMVwiKSk7cmV0dXJuIGVbTl0/ZChmdW5jdGlvbihhLGIsYyxkKXtmb3IodmFyIGYsZz1lKGEsbnVsbCxkLFtdKSxoPWEubGVuZ3RoO2gtLTspKGY9Z1toXSkmJihhW2hdPSEoYltoXT1mKSl9KTpmdW5jdGlvbihhLGQsZil7cmV0dXJuIGJbMF09YSxlKGIsbnVsbCxmLGMpLGJbMF09bnVsbCwhYy5wb3AoKX19KSxoYXM6ZChmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYyl7cmV0dXJuIGIoYSxjKS5sZW5ndGg+MH19KSxjb250YWluczpkKGZ1bmN0aW9uKGEpe3JldHVybiBhPWEucmVwbGFjZSh2YSx3YSksZnVuY3Rpb24oYil7cmV0dXJuKGIudGV4dENvbnRlbnR8fGIuaW5uZXJUZXh0fHx4KGIpKS5pbmRleE9mKGEpPi0xfX0pLGxhbmc6ZChmdW5jdGlvbihhKXtyZXR1cm4gbmEudGVzdChhfHxcIlwiKXx8Yi5lcnJvcihcInVuc3VwcG9ydGVkIGxhbmc6IFwiK2EpLGE9YS5yZXBsYWNlKHZhLHdhKS50b0xvd2VyQ2FzZSgpLGZ1bmN0aW9uKGIpe3ZhciBjO2RvIGlmKGM9ST9iLmxhbmc6Yi5nZXRBdHRyaWJ1dGUoXCJ4bWw6bGFuZ1wiKXx8Yi5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKXJldHVybiBjPWMudG9Mb3dlckNhc2UoKSxjPT09YXx8MD09PWMuaW5kZXhPZihhK1wiLVwiKTt3aGlsZSgoYj1iLnBhcmVudE5vZGUpJiYxPT09Yi5ub2RlVHlwZSk7cmV0dXJuITF9fSksdGFyZ2V0OmZ1bmN0aW9uKGIpe3ZhciBjPWEubG9jYXRpb24mJmEubG9jYXRpb24uaGFzaDtyZXR1cm4gYyYmYy5zbGljZSgxKT09PWIuaWR9LHJvb3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1IfSxmb2N1czpmdW5jdGlvbihhKXtyZXR1cm4gYT09PUcuYWN0aXZlRWxlbWVudCYmKCFHLmhhc0ZvY3VzfHxHLmhhc0ZvY3VzKCkpJiYhIShhLnR5cGV8fGEuaHJlZnx8fmEudGFiSW5kZXgpfSxlbmFibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITF9LGRpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITB9LGNoZWNrZWQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWImJiEhYS5jaGVja2VkfHxcIm9wdGlvblwiPT09YiYmISFhLnNlbGVjdGVkfSxzZWxlY3RlZDpmdW5jdGlvbihhKXtyZXR1cm4gYS5wYXJlbnROb2RlJiZhLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCxhLnNlbGVjdGVkPT09ITB9LGVtcHR5OmZ1bmN0aW9uKGEpe2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZylpZihhLm5vZGVUeXBlPDYpcmV0dXJuITE7cmV0dXJuITB9LHBhcmVudDpmdW5jdGlvbihhKXtyZXR1cm4hdy5wc2V1ZG9zLmVtcHR5KGEpfSxoZWFkZXI6ZnVuY3Rpb24oYSl7cmV0dXJuIHFhLnRlc3QoYS5ub2RlTmFtZSl9LGlucHV0OmZ1bmN0aW9uKGEpe3JldHVybiBwYS50ZXN0KGEubm9kZU5hbWUpfSxidXR0b246ZnVuY3Rpb24oYSl7dmFyIGI9YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWImJlwiYnV0dG9uXCI9PT1hLnR5cGV8fFwiYnV0dG9uXCI9PT1ifSx0ZXh0OmZ1bmN0aW9uKGEpe3ZhciBiO3JldHVyblwiaW5wdXRcIj09PWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKSYmXCJ0ZXh0XCI9PT1hLnR5cGUmJihudWxsPT0oYj1hLmdldEF0dHJpYnV0ZShcInR5cGVcIikpfHxcInRleHRcIj09PWIudG9Mb3dlckNhc2UoKSl9LGZpcnN0OmooZnVuY3Rpb24oKXtyZXR1cm5bMF19KSxsYXN0OmooZnVuY3Rpb24oYSxiKXtyZXR1cm5bYi0xXX0pLGVxOmooZnVuY3Rpb24oYSxiLGMpe3JldHVyblswPmM/YytiOmNdfSksZXZlbjpqKGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPTA7Yj5jO2MrPTIpYS5wdXNoKGMpO3JldHVybiBhfSksb2RkOmooZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MTtiPmM7Yys9MilhLnB1c2goYyk7cmV0dXJuIGF9KSxsdDpqKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9MD5jP2MrYjpjOy0tZD49MDspYS5wdXNoKGQpO3JldHVybiBhfSksZ3Q6aihmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPTA+Yz9jK2I6YzsrK2Q8YjspYS5wdXNoKGQpO3JldHVybiBhfSl9fSx3LnBzZXVkb3MubnRoPXcucHNldWRvcy5lcTtmb3IodSBpbntyYWRpbzohMCxjaGVja2JveDohMCxmaWxlOiEwLHBhc3N3b3JkOiEwLGltYWdlOiEwfSl3LnBzZXVkb3NbdV09aCh1KTtmb3IodSBpbntzdWJtaXQ6ITAscmVzZXQ6ITB9KXcucHNldWRvc1t1XT1pKHUpO3JldHVybiBsLnByb3RvdHlwZT13LmZpbHRlcnM9dy5wc2V1ZG9zLHcuc2V0RmlsdGVycz1uZXcgbCx6PWIudG9rZW5pemU9ZnVuY3Rpb24oYSxjKXt2YXIgZCxlLGYsZyxoLGksaixrPVNbYStcIiBcIl07aWYoaylyZXR1cm4gYz8wOmsuc2xpY2UoMCk7Zm9yKGg9YSxpPVtdLGo9dy5wcmVGaWx0ZXI7aDspeyghZHx8KGU9amEuZXhlYyhoKSkpJiYoZSYmKGg9aC5zbGljZShlWzBdLmxlbmd0aCl8fGgpLGkucHVzaChmPVtdKSksZD0hMSwoZT1rYS5leGVjKGgpKSYmKGQ9ZS5zaGlmdCgpLGYucHVzaCh7dmFsdWU6ZCx0eXBlOmVbMF0ucmVwbGFjZShpYSxcIiBcIil9KSxoPWguc2xpY2UoZC5sZW5ndGgpKTtmb3IoZyBpbiB3LmZpbHRlcikhKGU9b2FbZ10uZXhlYyhoKSl8fGpbZ10mJiEoZT1qW2ddKGUpKXx8KGQ9ZS5zaGlmdCgpLGYucHVzaCh7dmFsdWU6ZCx0eXBlOmcsbWF0Y2hlczplfSksaD1oLnNsaWNlKGQubGVuZ3RoKSk7aWYoIWQpYnJlYWt9cmV0dXJuIGM/aC5sZW5ndGg6aD9iLmVycm9yKGEpOlMoYSxpKS5zbGljZSgwKX0sQT1iLmNvbXBpbGU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9W10sZj1UW2ErXCIgXCJdO2lmKCFmKXtmb3IoYnx8KGI9eihhKSksYz1iLmxlbmd0aDtjLS07KWY9cyhiW2NdKSxmW05dP2QucHVzaChmKTplLnB1c2goZik7Zj1UKGEsdChlLGQpKSxmLnNlbGVjdG9yPWF9cmV0dXJuIGZ9LEI9Yi5zZWxlY3Q9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGUsZixnLGgsaSxqPVwiZnVuY3Rpb25cIj09dHlwZW9mIGEmJmEsbD0hZCYmeihhPWouc2VsZWN0b3J8fGEpO2lmKGM9Y3x8W10sMT09PWwubGVuZ3RoKXtpZihmPWxbMF09bFswXS5zbGljZSgwKSxmLmxlbmd0aD4yJiZcIklEXCI9PT0oZz1mWzBdKS50eXBlJiZ2LmdldEJ5SWQmJjk9PT1iLm5vZGVUeXBlJiZJJiZ3LnJlbGF0aXZlW2ZbMV0udHlwZV0pe2lmKGI9KHcuZmluZC5JRChnLm1hdGNoZXNbMF0ucmVwbGFjZSh2YSx3YSksYil8fFtdKVswXSwhYilyZXR1cm4gYztqJiYoYj1iLnBhcmVudE5vZGUpLGE9YS5zbGljZShmLnNoaWZ0KCkudmFsdWUubGVuZ3RoKX1mb3IoZT1vYS5uZWVkc0NvbnRleHQudGVzdChhKT8wOmYubGVuZ3RoO2UtLSYmKGc9ZltlXSwhdy5yZWxhdGl2ZVtoPWcudHlwZV0pOylpZigoaT13LmZpbmRbaF0pJiYoZD1pKGcubWF0Y2hlc1swXS5yZXBsYWNlKHZhLHdhKSx0YS50ZXN0KGZbMF0udHlwZSkmJmsoYi5wYXJlbnROb2RlKXx8YikpKXtpZihmLnNwbGljZShlLDEpLGE9ZC5sZW5ndGgmJm0oZiksIWEpcmV0dXJuICQuYXBwbHkoYyxkKSxjO2JyZWFrfX1yZXR1cm4oanx8QShhLGwpKShkLGIsIUksYyx0YS50ZXN0KGEpJiZrKGIucGFyZW50Tm9kZSl8fGIpLGN9LHYuc29ydFN0YWJsZT1OLnNwbGl0KFwiXCIpLnNvcnQoVSkuam9pbihcIlwiKT09PU4sdi5kZXRlY3REdXBsaWNhdGVzPSEhRSxGKCksdi5zb3J0RGV0YWNoZWQ9ZShmdW5jdGlvbihhKXtyZXR1cm4gMSZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKEcuY3JlYXRlRWxlbWVudChcImRpdlwiKSl9KSxlKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlubmVySFRNTD1cIjxhIGhyZWY9JyMnPjwvYT5cIixcIiNcIj09PWEuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfSl8fGYoXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsZnVuY3Rpb24oYSxiLGMpe3JldHVybiBjP3ZvaWQgMDphLmdldEF0dHJpYnV0ZShiLFwidHlwZVwiPT09Yi50b0xvd2VyQ2FzZSgpPzE6Mil9KSx2LmF0dHJpYnV0ZXMmJmUoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaW5uZXJIVE1MPVwiPGlucHV0Lz5cIixhLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiKSxcIlwiPT09YS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpfSl8fGYoXCJ2YWx1ZVwiLGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gY3x8XCJpbnB1dFwiIT09YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpP3ZvaWQgMDphLmRlZmF1bHRWYWx1ZX0pLGUoZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PWEuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIil9KXx8ZihiYSxmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIGM/dm9pZCAwOmFbYl09PT0hMD9iLnRvTG93ZXJDYXNlKCk6KGQ9YS5nZXRBdHRyaWJ1dGVOb2RlKGIpKSYmZC5zcGVjaWZpZWQ/ZC52YWx1ZTpudWxsfSksYn0oYSk7Xy5maW5kPWVhLF8uZXhwcj1lYS5zZWxlY3RvcnMsXy5leHByW1wiOlwiXT1fLmV4cHIucHNldWRvcyxfLnVuaXF1ZT1lYS51bmlxdWVTb3J0LF8udGV4dD1lYS5nZXRUZXh0LF8uaXNYTUxEb2M9ZWEuaXNYTUwsXy5jb250YWlucz1lYS5jb250YWluczt2YXIgZmE9Xy5leHByLm1hdGNoLm5lZWRzQ29udGV4dCxnYT0vXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPnwpJC8saGE9L14uW146I1xcW1xcLixdKiQvO18uZmlsdGVyPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1iWzBdO3JldHVybiBjJiYoYT1cIjpub3QoXCIrYStcIilcIiksMT09PWIubGVuZ3RoJiYxPT09ZC5ub2RlVHlwZT9fLmZpbmQubWF0Y2hlc1NlbGVjdG9yKGQsYSk/W2RdOltdOl8uZmluZC5tYXRjaGVzKGEsXy5ncmVwKGIsZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLm5vZGVUeXBlfSkpfSxfLmZuLmV4dGVuZCh7ZmluZDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMubGVuZ3RoLGQ9W10sZT10aGlzO2lmKFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiB0aGlzLnB1c2hTdGFjayhfKGEpLmZpbHRlcihmdW5jdGlvbigpe2ZvcihiPTA7Yz5iO2IrKylpZihfLmNvbnRhaW5zKGVbYl0sdGhpcykpcmV0dXJuITB9KSk7Zm9yKGI9MDtjPmI7YisrKV8uZmluZChhLGVbYl0sZCk7cmV0dXJuIGQ9dGhpcy5wdXNoU3RhY2soYz4xP18udW5pcXVlKGQpOmQpLGQuc2VsZWN0b3I9dGhpcy5zZWxlY3Rvcj90aGlzLnNlbGVjdG9yK1wiIFwiK2E6YSxkfSxmaWx0ZXI6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGQodGhpcyxhfHxbXSwhMSkpfSxub3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKGQodGhpcyxhfHxbXSwhMCkpfSxpczpmdW5jdGlvbihhKXtyZXR1cm4hIWQodGhpcyxcInN0cmluZ1wiPT10eXBlb2YgYSYmZmEudGVzdChhKT9fKGEpOmF8fFtdLCExKS5sZW5ndGh9fSk7dmFyIGlhLGphPS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLGthPV8uZm4uaW5pdD1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7aWYoIWEpcmV0dXJuIHRoaXM7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEpe2lmKGM9XCI8XCI9PT1hWzBdJiZcIj5cIj09PWFbYS5sZW5ndGgtMV0mJmEubGVuZ3RoPj0zP1tudWxsLGEsbnVsbF06amEuZXhlYyhhKSwhY3x8IWNbMV0mJmIpcmV0dXJuIWJ8fGIuanF1ZXJ5PyhifHxpYSkuZmluZChhKTp0aGlzLmNvbnN0cnVjdG9yKGIpLmZpbmQoYSk7aWYoY1sxXSl7aWYoYj1iIGluc3RhbmNlb2YgXz9iWzBdOmIsXy5tZXJnZSh0aGlzLF8ucGFyc2VIVE1MKGNbMV0sYiYmYi5ub2RlVHlwZT9iLm93bmVyRG9jdW1lbnR8fGI6WiwhMCkpLGdhLnRlc3QoY1sxXSkmJl8uaXNQbGFpbk9iamVjdChiKSlmb3IoYyBpbiBiKV8uaXNGdW5jdGlvbih0aGlzW2NdKT90aGlzW2NdKGJbY10pOnRoaXMuYXR0cihjLGJbY10pO3JldHVybiB0aGlzfXJldHVybiBkPVouZ2V0RWxlbWVudEJ5SWQoY1syXSksZCYmZC5wYXJlbnROb2RlJiYodGhpcy5sZW5ndGg9MSx0aGlzWzBdPWQpLHRoaXMuY29udGV4dD1aLHRoaXMuc2VsZWN0b3I9YSx0aGlzfXJldHVybiBhLm5vZGVUeXBlPyh0aGlzLmNvbnRleHQ9dGhpc1swXT1hLHRoaXMubGVuZ3RoPTEsdGhpcyk6Xy5pc0Z1bmN0aW9uKGEpP1widW5kZWZpbmVkXCIhPXR5cGVvZiBpYS5yZWFkeT9pYS5yZWFkeShhKTphKF8pOih2b2lkIDAhPT1hLnNlbGVjdG9yJiYodGhpcy5zZWxlY3Rvcj1hLnNlbGVjdG9yLHRoaXMuY29udGV4dD1hLmNvbnRleHQpLF8ubWFrZUFycmF5KGEsdGhpcykpfTtrYS5wcm90b3R5cGU9Xy5mbixpYT1fKFopO3ZhciBsYT0vXig/OnBhcmVudHN8cHJldig/OlVudGlsfEFsbCkpLyxtYT17Y2hpbGRyZW46ITAsY29udGVudHM6ITAsbmV4dDohMCxwcmV2OiEwfTtfLmV4dGVuZCh7ZGlyOmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9W10sZT12b2lkIDAhPT1jOyhhPWFbYl0pJiY5IT09YS5ub2RlVHlwZTspaWYoMT09PWEubm9kZVR5cGUpe2lmKGUmJl8oYSkuaXMoYykpYnJlYWs7ZC5wdXNoKGEpfXJldHVybiBkfSxzaWJsaW5nOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPVtdO2E7YT1hLm5leHRTaWJsaW5nKTE9PT1hLm5vZGVUeXBlJiZhIT09YiYmYy5wdXNoKGEpO3JldHVybiBjfX0pLF8uZm4uZXh0ZW5kKHtoYXM6ZnVuY3Rpb24oYSl7dmFyIGI9XyhhLHRoaXMpLGM9Yi5sZW5ndGg7cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7Yz5hO2ErKylpZihfLmNvbnRhaW5zKHRoaXMsYlthXSkpcmV0dXJuITB9KX0sY2xvc2VzdDpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYyxkPTAsZT10aGlzLmxlbmd0aCxmPVtdLGc9ZmEudGVzdChhKXx8XCJzdHJpbmdcIiE9dHlwZW9mIGE/XyhhLGJ8fHRoaXMuY29udGV4dCk6MDtlPmQ7ZCsrKWZvcihjPXRoaXNbZF07YyYmYyE9PWI7Yz1jLnBhcmVudE5vZGUpaWYoYy5ub2RlVHlwZTwxMSYmKGc/Zy5pbmRleChjKT4tMToxPT09Yy5ub2RlVHlwZSYmXy5maW5kLm1hdGNoZXNTZWxlY3RvcihjLGEpKSl7Zi5wdXNoKGMpO2JyZWFrfXJldHVybiB0aGlzLnB1c2hTdGFjayhmLmxlbmd0aD4xP18udW5pcXVlKGYpOmYpfSxpbmRleDpmdW5jdGlvbihhKXtyZXR1cm4gYT9cInN0cmluZ1wiPT10eXBlb2YgYT9VLmNhbGwoXyhhKSx0aGlzWzBdKTpVLmNhbGwodGhpcyxhLmpxdWVyeT9hWzBdOmEpOnRoaXNbMF0mJnRoaXNbMF0ucGFyZW50Tm9kZT90aGlzLmZpcnN0KCkucHJldkFsbCgpLmxlbmd0aDotMX0sYWRkOmZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucHVzaFN0YWNrKF8udW5pcXVlKF8ubWVyZ2UodGhpcy5nZXQoKSxfKGEsYikpKSl9LGFkZEJhY2s6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuYWRkKG51bGw9PWE/dGhpcy5wcmV2T2JqZWN0OnRoaXMucHJldk9iamVjdC5maWx0ZXIoYSkpfX0pLF8uZWFjaCh7cGFyZW50OmZ1bmN0aW9uKGEpe3ZhciBiPWEucGFyZW50Tm9kZTtyZXR1cm4gYiYmMTEhPT1iLm5vZGVUeXBlP2I6bnVsbH0scGFyZW50czpmdW5jdGlvbihhKXtyZXR1cm4gXy5kaXIoYSxcInBhcmVudE5vZGVcIil9LHBhcmVudHNVbnRpbDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIF8uZGlyKGEsXCJwYXJlbnROb2RlXCIsYyl9LG5leHQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGUoYSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2OmZ1bmN0aW9uKGEpe3JldHVybiBlKGEsXCJwcmV2aW91c1NpYmxpbmdcIil9LG5leHRBbGw6ZnVuY3Rpb24oYSl7cmV0dXJuIF8uZGlyKGEsXCJuZXh0U2libGluZ1wiKX0scHJldkFsbDpmdW5jdGlvbihhKXtyZXR1cm4gXy5kaXIoYSxcInByZXZpb3VzU2libGluZ1wiKX0sbmV4dFVudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gXy5kaXIoYSxcIm5leHRTaWJsaW5nXCIsYyl9LHByZXZVbnRpbDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIF8uZGlyKGEsXCJwcmV2aW91c1NpYmxpbmdcIixjKX0sc2libGluZ3M6ZnVuY3Rpb24oYSl7cmV0dXJuIF8uc2libGluZygoYS5wYXJlbnROb2RlfHx7fSkuZmlyc3RDaGlsZCxhKX0sY2hpbGRyZW46ZnVuY3Rpb24oYSl7cmV0dXJuIF8uc2libGluZyhhLmZpcnN0Q2hpbGQpfSxjb250ZW50czpmdW5jdGlvbihhKXtyZXR1cm4gYS5jb250ZW50RG9jdW1lbnR8fF8ubWVyZ2UoW10sYS5jaGlsZE5vZGVzKX19LGZ1bmN0aW9uKGEsYil7Xy5mblthXT1mdW5jdGlvbihjLGQpe3ZhciBlPV8ubWFwKHRoaXMsYixjKTtyZXR1cm5cIlVudGlsXCIhPT1hLnNsaWNlKC01KSYmKGQ9YyksZCYmXCJzdHJpbmdcIj09dHlwZW9mIGQmJihlPV8uZmlsdGVyKGQsZSkpLHRoaXMubGVuZ3RoPjEmJihtYVthXXx8Xy51bmlxdWUoZSksbGEudGVzdChhKSYmZS5yZXZlcnNlKCkpLHRoaXMucHVzaFN0YWNrKGUpfX0pO3ZhciBuYT0vXFxTKy9nLG9hPXt9O18uQ2FsbGJhY2tzPWZ1bmN0aW9uKGEpe2E9XCJzdHJpbmdcIj09dHlwZW9mIGE/b2FbYV18fGYoYSk6Xy5leHRlbmQoe30sYSk7dmFyIGIsYyxkLGUsZyxoLGk9W10saj0hYS5vbmNlJiZbXSxrPWZ1bmN0aW9uKGYpe2ZvcihiPWEubWVtb3J5JiZmLGM9ITAsaD1lfHwwLGU9MCxnPWkubGVuZ3RoLGQ9ITA7aSYmZz5oO2grKylpZihpW2hdLmFwcGx5KGZbMF0sZlsxXSk9PT0hMSYmYS5zdG9wT25GYWxzZSl7Yj0hMTticmVha31kPSExLGkmJihqP2oubGVuZ3RoJiZrKGouc2hpZnQoKSk6Yj9pPVtdOmwuZGlzYWJsZSgpKX0sbD17YWRkOmZ1bmN0aW9uKCl7aWYoaSl7dmFyIGM9aS5sZW5ndGg7IWZ1bmN0aW9uIGYoYil7Xy5lYWNoKGIsZnVuY3Rpb24oYixjKXt2YXIgZD1fLnR5cGUoYyk7XCJmdW5jdGlvblwiPT09ZD9hLnVuaXF1ZSYmbC5oYXMoYyl8fGkucHVzaChjKTpjJiZjLmxlbmd0aCYmXCJzdHJpbmdcIiE9PWQmJmYoYyl9KX0oYXJndW1lbnRzKSxkP2c9aS5sZW5ndGg6YiYmKGU9YyxrKGIpKX1yZXR1cm4gdGhpc30scmVtb3ZlOmZ1bmN0aW9uKCl7cmV0dXJuIGkmJl8uZWFjaChhcmd1bWVudHMsZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM7KGM9Xy5pbkFycmF5KGIsaSxjKSk+LTE7KWkuc3BsaWNlKGMsMSksZCYmKGc+PWMmJmctLSxoPj1jJiZoLS0pfSksdGhpc30saGFzOmZ1bmN0aW9uKGEpe3JldHVybiBhP18uaW5BcnJheShhLGkpPi0xOiEoIWl8fCFpLmxlbmd0aCl9LGVtcHR5OmZ1bmN0aW9uKCl7cmV0dXJuIGk9W10sZz0wLHRoaXN9LGRpc2FibGU6ZnVuY3Rpb24oKXtyZXR1cm4gaT1qPWI9dm9pZCAwLHRoaXN9LGRpc2FibGVkOmZ1bmN0aW9uKCl7cmV0dXJuIWl9LGxvY2s6ZnVuY3Rpb24oKXtyZXR1cm4gaj12b2lkIDAsYnx8bC5kaXNhYmxlKCksdGhpc30sbG9ja2VkOmZ1bmN0aW9uKCl7cmV0dXJuIWp9LGZpcmVXaXRoOmZ1bmN0aW9uKGEsYil7cmV0dXJuIWl8fGMmJiFqfHwoYj1ifHxbXSxiPVthLGIuc2xpY2U/Yi5zbGljZSgpOmJdLGQ/ai5wdXNoKGIpOmsoYikpLHRoaXN9LGZpcmU6ZnVuY3Rpb24oKXtyZXR1cm4gbC5maXJlV2l0aCh0aGlzLGFyZ3VtZW50cyksdGhpc30sZmlyZWQ6ZnVuY3Rpb24oKXtyZXR1cm4hIWN9fTtyZXR1cm4gbH0sXy5leHRlbmQoe0RlZmVycmVkOmZ1bmN0aW9uKGEpe3ZhciBiPVtbXCJyZXNvbHZlXCIsXCJkb25lXCIsXy5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxcInJlc29sdmVkXCJdLFtcInJlamVjdFwiLFwiZmFpbFwiLF8uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZWplY3RlZFwiXSxbXCJub3RpZnlcIixcInByb2dyZXNzXCIsXy5DYWxsYmFja3MoXCJtZW1vcnlcIildXSxjPVwicGVuZGluZ1wiLGQ9e3N0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuIGN9LGFsd2F5czpmdW5jdGlvbigpe3JldHVybiBlLmRvbmUoYXJndW1lbnRzKS5mYWlsKGFyZ3VtZW50cyksdGhpc30sdGhlbjpmdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cztyZXR1cm4gXy5EZWZlcnJlZChmdW5jdGlvbihjKXtfLmVhY2goYixmdW5jdGlvbihiLGYpe3ZhciBnPV8uaXNGdW5jdGlvbihhW2JdKSYmYVtiXTtlW2ZbMV1dKGZ1bmN0aW9uKCl7dmFyIGE9ZyYmZy5hcHBseSh0aGlzLGFyZ3VtZW50cyk7YSYmXy5pc0Z1bmN0aW9uKGEucHJvbWlzZSk/YS5wcm9taXNlKCkuZG9uZShjLnJlc29sdmUpLmZhaWwoYy5yZWplY3QpLnByb2dyZXNzKGMubm90aWZ5KTpjW2ZbMF0rXCJXaXRoXCJdKHRoaXM9PT1kP2MucHJvbWlzZSgpOnRoaXMsZz9bYV06YXJndW1lbnRzKX0pfSksYT1udWxsfSkucHJvbWlzZSgpfSxwcm9taXNlOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hP18uZXh0ZW5kKGEsZCk6ZH19LGU9e307cmV0dXJuIGQucGlwZT1kLnRoZW4sXy5lYWNoKGIsZnVuY3Rpb24oYSxmKXt2YXIgZz1mWzJdLGg9ZlszXTtkW2ZbMV1dPWcuYWRkLGgmJmcuYWRkKGZ1bmN0aW9uKCl7Yz1ofSxiWzFeYV1bMl0uZGlzYWJsZSxiWzJdWzJdLmxvY2spLGVbZlswXV09ZnVuY3Rpb24oKXtyZXR1cm4gZVtmWzBdK1wiV2l0aFwiXSh0aGlzPT09ZT9kOnRoaXMsYXJndW1lbnRzKSx0aGlzfSxlW2ZbMF0rXCJXaXRoXCJdPWcuZmlyZVdpdGh9KSxkLnByb21pc2UoZSksYSYmYS5jYWxsKGUsZSksZX0sd2hlbjpmdW5jdGlvbihhKXt2YXIgYixjLGQsZT0wLGY9Ui5jYWxsKGFyZ3VtZW50cyksZz1mLmxlbmd0aCxoPTEhPT1nfHxhJiZfLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9nOjAsaT0xPT09aD9hOl8uRGVmZXJyZWQoKSxqPWZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gZnVuY3Rpb24oZSl7Y1thXT10aGlzLGRbYV09YXJndW1lbnRzLmxlbmd0aD4xP1IuY2FsbChhcmd1bWVudHMpOmUsZD09PWI/aS5ub3RpZnlXaXRoKGMsZCk6LS1ofHxpLnJlc29sdmVXaXRoKGMsZCl9fTtpZihnPjEpZm9yKGI9bmV3IEFycmF5KGcpLGM9bmV3IEFycmF5KGcpLGQ9bmV3IEFycmF5KGcpO2c+ZTtlKyspZltlXSYmXy5pc0Z1bmN0aW9uKGZbZV0ucHJvbWlzZSk/ZltlXS5wcm9taXNlKCkuZG9uZShqKGUsZCxmKSkuZmFpbChpLnJlamVjdCkucHJvZ3Jlc3MoaihlLGMsYikpOi0taDtyZXR1cm4gaHx8aS5yZXNvbHZlV2l0aChkLGYpLGkucHJvbWlzZSgpfX0pO3ZhciBwYTtfLmZuLnJlYWR5PWZ1bmN0aW9uKGEpe3JldHVybiBfLnJlYWR5LnByb21pc2UoKS5kb25lKGEpLHRoaXN9LF8uZXh0ZW5kKHtpc1JlYWR5OiExLHJlYWR5V2FpdDoxLGhvbGRSZWFkeTpmdW5jdGlvbihhKXthP18ucmVhZHlXYWl0Kys6Xy5yZWFkeSghMCl9LHJlYWR5OmZ1bmN0aW9uKGEpeyhhPT09ITA/LS1fLnJlYWR5V2FpdDpfLmlzUmVhZHkpfHwoXy5pc1JlYWR5PSEwLGEhPT0hMCYmLS1fLnJlYWR5V2FpdD4wfHwocGEucmVzb2x2ZVdpdGgoWixbX10pLF8uZm4udHJpZ2dlckhhbmRsZXImJihfKFopLnRyaWdnZXJIYW5kbGVyKFwicmVhZHlcIiksXyhaKS5vZmYoXCJyZWFkeVwiKSkpKX19KSxfLnJlYWR5LnByb21pc2U9ZnVuY3Rpb24oYil7cmV0dXJuIHBhfHwocGE9Xy5EZWZlcnJlZCgpLFwiY29tcGxldGVcIj09PVoucmVhZHlTdGF0ZT9zZXRUaW1lb3V0KF8ucmVhZHkpOihaLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZywhMSksYS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGcsITEpKSkscGEucHJvbWlzZShiKX0sXy5yZWFkeS5wcm9taXNlKCk7dmFyIHFhPV8uYWNjZXNzPWZ1bmN0aW9uKGEsYixjLGQsZSxmLGcpe3ZhciBoPTAsaT1hLmxlbmd0aCxqPW51bGw9PWM7aWYoXCJvYmplY3RcIj09PV8udHlwZShjKSl7ZT0hMDtmb3IoaCBpbiBjKV8uYWNjZXNzKGEsYixoLGNbaF0sITAsZixnKX1lbHNlIGlmKHZvaWQgMCE9PWQmJihlPSEwLF8uaXNGdW5jdGlvbihkKXx8KGc9ITApLGomJihnPyhiLmNhbGwoYSxkKSxiPW51bGwpOihqPWIsYj1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIGouY2FsbChfKGEpLGMpfSkpLGIpKWZvcig7aT5oO2grKyliKGFbaF0sYyxnP2Q6ZC5jYWxsKGFbaF0saCxiKGFbaF0sYykpKTtyZXR1cm4gZT9hOmo/Yi5jYWxsKGEpOmk/YihhWzBdLGMpOmZ9O18uYWNjZXB0RGF0YT1mdW5jdGlvbihhKXtyZXR1cm4gMT09PWEubm9kZVR5cGV8fDk9PT1hLm5vZGVUeXBlfHwhK2Eubm9kZVR5cGV9LGgudWlkPTEsaC5hY2NlcHRzPV8uYWNjZXB0RGF0YSxoLnByb3RvdHlwZT17a2V5OmZ1bmN0aW9uKGEpe2lmKCFoLmFjY2VwdHMoYSkpcmV0dXJuIDA7dmFyIGI9e30sYz1hW3RoaXMuZXhwYW5kb107aWYoIWMpe2M9aC51aWQrKzt0cnl7Ylt0aGlzLmV4cGFuZG9dPXt2YWx1ZTpjfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhhLGIpfWNhdGNoKGQpe2JbdGhpcy5leHBhbmRvXT1jLF8uZXh0ZW5kKGEsYil9fXJldHVybiB0aGlzLmNhY2hlW2NdfHwodGhpcy5jYWNoZVtjXT17fSksY30sc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlPXRoaXMua2V5KGEpLGY9dGhpcy5jYWNoZVtlXTtpZihcInN0cmluZ1wiPT10eXBlb2YgYilmW2JdPWM7ZWxzZSBpZihfLmlzRW1wdHlPYmplY3QoZikpXy5leHRlbmQodGhpcy5jYWNoZVtlXSxiKTtlbHNlIGZvcihkIGluIGIpZltkXT1iW2RdO3JldHVybiBmfSxnZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmNhY2hlW3RoaXMua2V5KGEpXTtyZXR1cm4gdm9pZCAwPT09Yj9jOmNbYl19LGFjY2VzczpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIHZvaWQgMD09PWJ8fGImJlwic3RyaW5nXCI9PXR5cGVvZiBiJiZ2b2lkIDA9PT1jPyhkPXRoaXMuZ2V0KGEsYiksdm9pZCAwIT09ZD9kOnRoaXMuZ2V0KGEsXy5jYW1lbENhc2UoYikpKToodGhpcy5zZXQoYSxiLGMpLHZvaWQgMCE9PWM/YzpiKX0scmVtb3ZlOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpcy5rZXkoYSksZz10aGlzLmNhY2hlW2ZdO2lmKHZvaWQgMD09PWIpdGhpcy5jYWNoZVtmXT17fTtlbHNle18uaXNBcnJheShiKT9kPWIuY29uY2F0KGIubWFwKF8uY2FtZWxDYXNlKSk6KGU9Xy5jYW1lbENhc2UoYiksYiBpbiBnP2Q9W2IsZV06KGQ9ZSxkPWQgaW4gZz9bZF06ZC5tYXRjaChuYSl8fFtdKSksYz1kLmxlbmd0aDtmb3IoO2MtLTspZGVsZXRlIGdbZFtjXV19fSxoYXNEYXRhOmZ1bmN0aW9uKGEpe3JldHVybiFfLmlzRW1wdHlPYmplY3QodGhpcy5jYWNoZVthW3RoaXMuZXhwYW5kb11dfHx7fSl9LGRpc2NhcmQ6ZnVuY3Rpb24oYSl7YVt0aGlzLmV4cGFuZG9dJiZkZWxldGUgdGhpcy5jYWNoZVthW3RoaXMuZXhwYW5kb11dfX07dmFyIHJhPW5ldyBoLHNhPW5ldyBoLHRhPS9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLyx1YT0vKFtBLVpdKS9nO18uZXh0ZW5kKHtoYXNEYXRhOmZ1bmN0aW9uKGEpe3JldHVybiBzYS5oYXNEYXRhKGEpfHxyYS5oYXNEYXRhKGEpfSxkYXRhOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gc2EuYWNjZXNzKGEsYixjKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihhLGIpe3NhLnJlbW92ZShhLGIpfSxfZGF0YTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIHJhLmFjY2VzcyhhLGIsYyl9LF9yZW1vdmVEYXRhOmZ1bmN0aW9uKGEsYil7cmEucmVtb3ZlKGEsYil9fSksXy5mbi5leHRlbmQoe2RhdGE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZj10aGlzWzBdLGc9ZiYmZi5hdHRyaWJ1dGVzO2lmKHZvaWQgMD09PWEpe2lmKHRoaXMubGVuZ3RoJiYoZT1zYS5nZXQoZiksMT09PWYubm9kZVR5cGUmJiFyYS5nZXQoZixcImhhc0RhdGFBdHRyc1wiKSkpe2ZvcihjPWcubGVuZ3RoO2MtLTspZ1tjXSYmKGQ9Z1tjXS5uYW1lLDA9PT1kLmluZGV4T2YoXCJkYXRhLVwiKSYmKGQ9Xy5jYW1lbENhc2UoZC5zbGljZSg1KSksaShmLGQsZVtkXSkpKTtyYS5zZXQoZixcImhhc0RhdGFBdHRyc1wiLCEwKX1yZXR1cm4gZX1yZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgYT90aGlzLmVhY2goZnVuY3Rpb24oKXtzYS5zZXQodGhpcyxhKX0pOnFhKHRoaXMsZnVuY3Rpb24oYil7dmFyIGMsZD1fLmNhbWVsQ2FzZShhKTtpZihmJiZ2b2lkIDA9PT1iKXtpZihjPXNhLmdldChmLGEpLHZvaWQgMCE9PWMpcmV0dXJuIGM7aWYoYz1zYS5nZXQoZixkKSx2b2lkIDAhPT1jKXJldHVybiBjO2lmKGM9aShmLGQsdm9pZCAwKSx2b2lkIDAhPT1jKXJldHVybiBjfWVsc2UgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9c2EuZ2V0KHRoaXMsZCk7c2Euc2V0KHRoaXMsZCxiKSwtMSE9PWEuaW5kZXhPZihcIi1cIikmJnZvaWQgMCE9PWMmJnNhLnNldCh0aGlzLGEsYil9KX0sbnVsbCxiLGFyZ3VtZW50cy5sZW5ndGg+MSxudWxsLCEwKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7c2EucmVtb3ZlKHRoaXMsYSl9KX19KSxfLmV4dGVuZCh7cXVldWU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO3JldHVybiBhPyhiPShifHxcImZ4XCIpK1wicXVldWVcIixkPXJhLmdldChhLGIpLGMmJighZHx8Xy5pc0FycmF5KGMpP2Q9cmEuYWNjZXNzKGEsYixfLm1ha2VBcnJheShjKSk6ZC5wdXNoKGMpKSxkfHxbXSk6dm9pZCAwfSxkZXF1ZXVlOmZ1bmN0aW9uKGEsYil7Yj1ifHxcImZ4XCI7dmFyIGM9Xy5xdWV1ZShhLGIpLGQ9Yy5sZW5ndGgsZT1jLnNoaWZ0KCksZj1fLl9xdWV1ZUhvb2tzKGEsYiksZz1mdW5jdGlvbigpe18uZGVxdWV1ZShhLGIpfTtcImlucHJvZ3Jlc3NcIj09PWUmJihlPWMuc2hpZnQoKSxkLS0pLGUmJihcImZ4XCI9PT1iJiZjLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpLGRlbGV0ZSBmLnN0b3AsZS5jYWxsKGEsZyxmKSksIWQmJmYmJmYuZW1wdHkuZmlyZSgpfSxfcXVldWVIb29rczpmdW5jdGlvbihhLGIpe3ZhciBjPWIrXCJxdWV1ZUhvb2tzXCI7cmV0dXJuIHJhLmdldChhLGMpfHxyYS5hY2Nlc3MoYSxjLHtlbXB0eTpfLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLmFkZChmdW5jdGlvbigpe3JhLnJlbW92ZShhLFtiK1wicXVldWVcIixjXSl9KX0pfX0pLF8uZm4uZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihhLGIpe3ZhciBjPTI7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGEmJihiPWEsYT1cImZ4XCIsYy0tKSxhcmd1bWVudHMubGVuZ3RoPGM/Xy5xdWV1ZSh0aGlzWzBdLGEpOnZvaWQgMD09PWI/dGhpczp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1fLnF1ZXVlKHRoaXMsYSxiKTtfLl9xdWV1ZUhvb2tzKHRoaXMsYSksXCJmeFwiPT09YSYmXCJpbnByb2dyZXNzXCIhPT1jWzBdJiZfLmRlcXVldWUodGhpcyxhKX0pfSxkZXF1ZXVlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtfLmRlcXVldWUodGhpcyxhKX0pfSxjbGVhclF1ZXVlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnF1ZXVlKGF8fFwiZnhcIixbXSl9LHByb21pc2U6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPTEsZT1fLkRlZmVycmVkKCksZj10aGlzLGc9dGhpcy5sZW5ndGgsaD1mdW5jdGlvbigpey0tZHx8ZS5yZXNvbHZlV2l0aChmLFtmXSl9O2ZvcihcInN0cmluZ1wiIT10eXBlb2YgYSYmKGI9YSxhPXZvaWQgMCksYT1hfHxcImZ4XCI7Zy0tOyljPXJhLmdldChmW2ddLGErXCJxdWV1ZUhvb2tzXCIpLGMmJmMuZW1wdHkmJihkKyssYy5lbXB0eS5hZGQoaCkpO3JldHVybiBoKCksZS5wcm9taXNlKGIpfX0pO3ZhciB2YT0vWystXT8oPzpcXGQqXFwufClcXGQrKD86W2VFXVsrLV0/XFxkK3wpLy5zb3VyY2Usd2E9W1wiVG9wXCIsXCJSaWdodFwiLFwiQm90dG9tXCIsXCJMZWZ0XCJdLHhhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9Ynx8YSxcIm5vbmVcIj09PV8uY3NzKGEsXCJkaXNwbGF5XCIpfHwhXy5jb250YWlucyhhLm93bmVyRG9jdW1lbnQsYSl9LHlhPS9eKD86Y2hlY2tib3h8cmFkaW8pJC9pOyFmdW5jdGlvbigpe3ZhciBhPVouY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGI9YS5hcHBlbmRDaGlsZChaLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLGM9Wi5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7Yy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJyYWRpb1wiKSxjLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIixcImNoZWNrZWRcIiksYy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJ0XCIpLGIuYXBwZW5kQ2hpbGQoYyksWS5jaGVja0Nsb25lPWIuY2xvbmVOb2RlKCEwKS5jbG9uZU5vZGUoITApLmxhc3RDaGlsZC5jaGVja2VkLGIuaW5uZXJIVE1MPVwiPHRleHRhcmVhPng8L3RleHRhcmVhPlwiLFkubm9DbG9uZUNoZWNrZWQ9ISFiLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZX0oKTt2YXIgemE9XCJ1bmRlZmluZWRcIjtZLmZvY3VzaW5CdWJibGVzPVwib25mb2N1c2luXCJpbiBhO3ZhciBBYT0vXmtleS8sQmE9L14oPzptb3VzZXxwb2ludGVyfGNvbnRleHRtZW51KXxjbGljay8sQ2E9L14oPzpmb2N1c2luZm9jdXN8Zm9jdXNvdXRibHVyKSQvLERhPS9eKFteLl0qKSg/OlxcLiguKyl8KSQvO18uZXZlbnQ9e2dsb2JhbDp7fSxhZGQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnLGgsaSxqLGssbCxtLG4sbyxwLHE9cmEuZ2V0KGEpO2lmKHEpZm9yKGMuaGFuZGxlciYmKGY9YyxjPWYuaGFuZGxlcixlPWYuc2VsZWN0b3IpLGMuZ3VpZHx8KGMuZ3VpZD1fLmd1aWQrKyksKGk9cS5ldmVudHMpfHwoaT1xLmV2ZW50cz17fSksKGc9cS5oYW5kbGUpfHwoZz1xLmhhbmRsZT1mdW5jdGlvbihiKXtyZXR1cm4gdHlwZW9mIF8hPT16YSYmXy5ldmVudC50cmlnZ2VyZWQhPT1iLnR5cGU/Xy5ldmVudC5kaXNwYXRjaC5hcHBseShhLGFyZ3VtZW50cyk6dm9pZCAwfSksYj0oYnx8XCJcIikubWF0Y2gobmEpfHxbXCJcIl0saj1iLmxlbmd0aDtqLS07KWg9RGEuZXhlYyhiW2pdKXx8W10sbj1wPWhbMV0sbz0oaFsyXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxuJiYobD1fLmV2ZW50LnNwZWNpYWxbbl18fHt9LG49KGU/bC5kZWxlZ2F0ZVR5cGU6bC5iaW5kVHlwZSl8fG4sbD1fLmV2ZW50LnNwZWNpYWxbbl18fHt9LGs9Xy5leHRlbmQoe3R5cGU6bixvcmlnVHlwZTpwLGRhdGE6ZCxoYW5kbGVyOmMsZ3VpZDpjLmd1aWQsc2VsZWN0b3I6ZSxuZWVkc0NvbnRleHQ6ZSYmXy5leHByLm1hdGNoLm5lZWRzQ29udGV4dC50ZXN0KGUpLG5hbWVzcGFjZTpvLmpvaW4oXCIuXCIpfSxmKSwobT1pW25dKXx8KG09aVtuXT1bXSxtLmRlbGVnYXRlQ291bnQ9MCxsLnNldHVwJiZsLnNldHVwLmNhbGwoYSxkLG8sZykhPT0hMXx8YS5hZGRFdmVudExpc3RlbmVyJiZhLmFkZEV2ZW50TGlzdGVuZXIobixnLCExKSksbC5hZGQmJihsLmFkZC5jYWxsKGEsayksay5oYW5kbGVyLmd1aWR8fChrLmhhbmRsZXIuZ3VpZD1jLmd1aWQpKSxlP20uc3BsaWNlKG0uZGVsZWdhdGVDb3VudCsrLDAsayk6bS5wdXNoKGspLF8uZXZlbnQuZ2xvYmFsW25dPSEwKX0scmVtb3ZlOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGYsZyxoLGksaixrLGwsbSxuLG8scCxxPXJhLmhhc0RhdGEoYSkmJnJhLmdldChhKTtpZihxJiYoaT1xLmV2ZW50cykpe2ZvcihiPShifHxcIlwiKS5tYXRjaChuYSl8fFtcIlwiXSxqPWIubGVuZ3RoO2otLTspaWYoaD1EYS5leGVjKGJbal0pfHxbXSxuPXA9aFsxXSxvPShoWzJdfHxcIlwiKS5zcGxpdChcIi5cIikuc29ydCgpLG4pe2ZvcihsPV8uZXZlbnQuc3BlY2lhbFtuXXx8e30sbj0oZD9sLmRlbGVnYXRlVHlwZTpsLmJpbmRUeXBlKXx8bixtPWlbbl18fFtdLGg9aFsyXSYmbmV3IFJlZ0V4cChcIihefFxcXFwuKVwiK28uam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpK1wiKFxcXFwufCQpXCIpLGc9Zj1tLmxlbmd0aDtmLS07KWs9bVtmXSwhZSYmcCE9PWsub3JpZ1R5cGV8fGMmJmMuZ3VpZCE9PWsuZ3VpZHx8aCYmIWgudGVzdChrLm5hbWVzcGFjZSl8fGQmJmQhPT1rLnNlbGVjdG9yJiYoXCIqKlwiIT09ZHx8IWsuc2VsZWN0b3IpfHwobS5zcGxpY2UoZiwxKSxrLnNlbGVjdG9yJiZtLmRlbGVnYXRlQ291bnQtLSxsLnJlbW92ZSYmbC5yZW1vdmUuY2FsbChhLGspKTtnJiYhbS5sZW5ndGgmJihsLnRlYXJkb3duJiZsLnRlYXJkb3duLmNhbGwoYSxvLHEuaGFuZGxlKSE9PSExfHxfLnJlbW92ZUV2ZW50KGEsbixxLmhhbmRsZSksZGVsZXRlIGlbbl0pfWVsc2UgZm9yKG4gaW4gaSlfLmV2ZW50LnJlbW92ZShhLG4rYltqXSxjLGQsITApO18uaXNFbXB0eU9iamVjdChpKSYmKGRlbGV0ZSBxLmhhbmRsZSxyYS5yZW1vdmUoYSxcImV2ZW50c1wiKSl9fSx0cmlnZ2VyOmZ1bmN0aW9uKGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG09W2R8fFpdLG49WC5jYWxsKGIsXCJ0eXBlXCIpP2IudHlwZTpiLG89WC5jYWxsKGIsXCJuYW1lc3BhY2VcIik/Yi5uYW1lc3BhY2Uuc3BsaXQoXCIuXCIpOltdO2lmKGc9aD1kPWR8fFosMyE9PWQubm9kZVR5cGUmJjghPT1kLm5vZGVUeXBlJiYhQ2EudGVzdChuK18uZXZlbnQudHJpZ2dlcmVkKSYmKG4uaW5kZXhPZihcIi5cIik+PTAmJihvPW4uc3BsaXQoXCIuXCIpLG49by5zaGlmdCgpLG8uc29ydCgpKSxqPW4uaW5kZXhPZihcIjpcIik8MCYmXCJvblwiK24sYj1iW18uZXhwYW5kb10/YjpuZXcgXy5FdmVudChuLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKSxiLmlzVHJpZ2dlcj1lPzI6MyxiLm5hbWVzcGFjZT1vLmpvaW4oXCIuXCIpLGIubmFtZXNwYWNlX3JlPWIubmFtZXNwYWNlP25ldyBSZWdFeHAoXCIoXnxcXFxcLilcIitvLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKTpudWxsLGIucmVzdWx0PXZvaWQgMCxiLnRhcmdldHx8KGIudGFyZ2V0PWQpLFxuYz1udWxsPT1jP1tiXTpfLm1ha2VBcnJheShjLFtiXSksbD1fLmV2ZW50LnNwZWNpYWxbbl18fHt9LGV8fCFsLnRyaWdnZXJ8fGwudHJpZ2dlci5hcHBseShkLGMpIT09ITEpKXtpZighZSYmIWwubm9CdWJibGUmJiFfLmlzV2luZG93KGQpKXtmb3IoaT1sLmRlbGVnYXRlVHlwZXx8bixDYS50ZXN0KGkrbil8fChnPWcucGFyZW50Tm9kZSk7ZztnPWcucGFyZW50Tm9kZSltLnB1c2goZyksaD1nO2g9PT0oZC5vd25lckRvY3VtZW50fHxaKSYmbS5wdXNoKGguZGVmYXVsdFZpZXd8fGgucGFyZW50V2luZG93fHxhKX1mb3IoZj0wOyhnPW1bZisrXSkmJiFiLmlzUHJvcGFnYXRpb25TdG9wcGVkKCk7KWIudHlwZT1mPjE/aTpsLmJpbmRUeXBlfHxuLGs9KHJhLmdldChnLFwiZXZlbnRzXCIpfHx7fSlbYi50eXBlXSYmcmEuZ2V0KGcsXCJoYW5kbGVcIiksayYmay5hcHBseShnLGMpLGs9aiYmZ1tqXSxrJiZrLmFwcGx5JiZfLmFjY2VwdERhdGEoZykmJihiLnJlc3VsdD1rLmFwcGx5KGcsYyksYi5yZXN1bHQ9PT0hMSYmYi5wcmV2ZW50RGVmYXVsdCgpKTtyZXR1cm4gYi50eXBlPW4sZXx8Yi5pc0RlZmF1bHRQcmV2ZW50ZWQoKXx8bC5fZGVmYXVsdCYmbC5fZGVmYXVsdC5hcHBseShtLnBvcCgpLGMpIT09ITF8fCFfLmFjY2VwdERhdGEoZCl8fGomJl8uaXNGdW5jdGlvbihkW25dKSYmIV8uaXNXaW5kb3coZCkmJihoPWRbal0saCYmKGRbal09bnVsbCksXy5ldmVudC50cmlnZ2VyZWQ9bixkW25dKCksXy5ldmVudC50cmlnZ2VyZWQ9dm9pZCAwLGgmJihkW2pdPWgpKSxiLnJlc3VsdH19LGRpc3BhdGNoOmZ1bmN0aW9uKGEpe2E9Xy5ldmVudC5maXgoYSk7dmFyIGIsYyxkLGUsZixnPVtdLGg9Ui5jYWxsKGFyZ3VtZW50cyksaT0ocmEuZ2V0KHRoaXMsXCJldmVudHNcIil8fHt9KVthLnR5cGVdfHxbXSxqPV8uZXZlbnQuc3BlY2lhbFthLnR5cGVdfHx7fTtpZihoWzBdPWEsYS5kZWxlZ2F0ZVRhcmdldD10aGlzLCFqLnByZURpc3BhdGNofHxqLnByZURpc3BhdGNoLmNhbGwodGhpcyxhKSE9PSExKXtmb3IoZz1fLmV2ZW50LmhhbmRsZXJzLmNhbGwodGhpcyxhLGkpLGI9MDsoZT1nW2IrK10pJiYhYS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpOylmb3IoYS5jdXJyZW50VGFyZ2V0PWUuZWxlbSxjPTA7KGY9ZS5oYW5kbGVyc1tjKytdKSYmIWEuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKTspKCFhLm5hbWVzcGFjZV9yZXx8YS5uYW1lc3BhY2VfcmUudGVzdChmLm5hbWVzcGFjZSkpJiYoYS5oYW5kbGVPYmo9ZixhLmRhdGE9Zi5kYXRhLGQ9KChfLmV2ZW50LnNwZWNpYWxbZi5vcmlnVHlwZV18fHt9KS5oYW5kbGV8fGYuaGFuZGxlcikuYXBwbHkoZS5lbGVtLGgpLHZvaWQgMCE9PWQmJihhLnJlc3VsdD1kKT09PSExJiYoYS5wcmV2ZW50RGVmYXVsdCgpLGEuc3RvcFByb3BhZ2F0aW9uKCkpKTtyZXR1cm4gai5wb3N0RGlzcGF0Y2gmJmoucG9zdERpc3BhdGNoLmNhbGwodGhpcyxhKSxhLnJlc3VsdH19LGhhbmRsZXJzOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGYsZz1bXSxoPWIuZGVsZWdhdGVDb3VudCxpPWEudGFyZ2V0O2lmKGgmJmkubm9kZVR5cGUmJighYS5idXR0b258fFwiY2xpY2tcIiE9PWEudHlwZSkpZm9yKDtpIT09dGhpcztpPWkucGFyZW50Tm9kZXx8dGhpcylpZihpLmRpc2FibGVkIT09ITB8fFwiY2xpY2tcIiE9PWEudHlwZSl7Zm9yKGQ9W10sYz0wO2g+YztjKyspZj1iW2NdLGU9Zi5zZWxlY3RvcitcIiBcIix2b2lkIDA9PT1kW2VdJiYoZFtlXT1mLm5lZWRzQ29udGV4dD9fKGUsdGhpcykuaW5kZXgoaSk+PTA6Xy5maW5kKGUsdGhpcyxudWxsLFtpXSkubGVuZ3RoKSxkW2VdJiZkLnB1c2goZik7ZC5sZW5ndGgmJmcucHVzaCh7ZWxlbTppLGhhbmRsZXJzOmR9KX1yZXR1cm4gaDxiLmxlbmd0aCYmZy5wdXNoKHtlbGVtOnRoaXMsaGFuZGxlcnM6Yi5zbGljZShoKX0pLGd9LHByb3BzOlwiYWx0S2V5IGJ1YmJsZXMgY2FuY2VsYWJsZSBjdHJsS2V5IGN1cnJlbnRUYXJnZXQgZXZlbnRQaGFzZSBtZXRhS2V5IHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgdGFyZ2V0IHRpbWVTdGFtcCB2aWV3IHdoaWNoXCIuc3BsaXQoXCIgXCIpLGZpeEhvb2tzOnt9LGtleUhvb2tzOntwcm9wczpcImNoYXIgY2hhckNvZGUga2V5IGtleUNvZGVcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGw9PWEud2hpY2gmJihhLndoaWNoPW51bGwhPWIuY2hhckNvZGU/Yi5jaGFyQ29kZTpiLmtleUNvZGUpLGF9fSxtb3VzZUhvb2tzOntwcm9wczpcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiLnNwbGl0KFwiIFwiKSxmaWx0ZXI6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZj1iLmJ1dHRvbjtyZXR1cm4gbnVsbD09YS5wYWdlWCYmbnVsbCE9Yi5jbGllbnRYJiYoYz1hLnRhcmdldC5vd25lckRvY3VtZW50fHxaLGQ9Yy5kb2N1bWVudEVsZW1lbnQsZT1jLmJvZHksYS5wYWdlWD1iLmNsaWVudFgrKGQmJmQuc2Nyb2xsTGVmdHx8ZSYmZS5zY3JvbGxMZWZ0fHwwKS0oZCYmZC5jbGllbnRMZWZ0fHxlJiZlLmNsaWVudExlZnR8fDApLGEucGFnZVk9Yi5jbGllbnRZKyhkJiZkLnNjcm9sbFRvcHx8ZSYmZS5zY3JvbGxUb3B8fDApLShkJiZkLmNsaWVudFRvcHx8ZSYmZS5jbGllbnRUb3B8fDApKSxhLndoaWNofHx2b2lkIDA9PT1mfHwoYS53aGljaD0xJmY/MToyJmY/Mzo0JmY/MjowKSxhfX0sZml4OmZ1bmN0aW9uKGEpe2lmKGFbXy5leHBhbmRvXSlyZXR1cm4gYTt2YXIgYixjLGQsZT1hLnR5cGUsZj1hLGc9dGhpcy5maXhIb29rc1tlXTtmb3IoZ3x8KHRoaXMuZml4SG9va3NbZV09Zz1CYS50ZXN0KGUpP3RoaXMubW91c2VIb29rczpBYS50ZXN0KGUpP3RoaXMua2V5SG9va3M6e30pLGQ9Zy5wcm9wcz90aGlzLnByb3BzLmNvbmNhdChnLnByb3BzKTp0aGlzLnByb3BzLGE9bmV3IF8uRXZlbnQoZiksYj1kLmxlbmd0aDtiLS07KWM9ZFtiXSxhW2NdPWZbY107cmV0dXJuIGEudGFyZ2V0fHwoYS50YXJnZXQ9WiksMz09PWEudGFyZ2V0Lm5vZGVUeXBlJiYoYS50YXJnZXQ9YS50YXJnZXQucGFyZW50Tm9kZSksZy5maWx0ZXI/Zy5maWx0ZXIoYSxmKTphfSxzcGVjaWFsOntsb2FkOntub0J1YmJsZTohMH0sZm9jdXM6e3RyaWdnZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcyE9PWwoKSYmdGhpcy5mb2N1cz8odGhpcy5mb2N1cygpLCExKTp2b2lkIDB9LGRlbGVnYXRlVHlwZTpcImZvY3VzaW5cIn0sYmx1cjp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzPT09bCgpJiZ0aGlzLmJsdXI/KHRoaXMuYmx1cigpLCExKTp2b2lkIDB9LGRlbGVnYXRlVHlwZTpcImZvY3Vzb3V0XCJ9LGNsaWNrOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuXCJjaGVja2JveFwiPT09dGhpcy50eXBlJiZ0aGlzLmNsaWNrJiZfLm5vZGVOYW1lKHRoaXMsXCJpbnB1dFwiKT8odGhpcy5jbGljaygpLCExKTp2b2lkIDB9LF9kZWZhdWx0OmZ1bmN0aW9uKGEpe3JldHVybiBfLm5vZGVOYW1lKGEudGFyZ2V0LFwiYVwiKX19LGJlZm9yZXVubG9hZDp7cG9zdERpc3BhdGNoOmZ1bmN0aW9uKGEpe3ZvaWQgMCE9PWEucmVzdWx0JiZhLm9yaWdpbmFsRXZlbnQmJihhLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWU9YS5yZXN1bHQpfX19LHNpbXVsYXRlOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPV8uZXh0ZW5kKG5ldyBfLkV2ZW50LGMse3R5cGU6YSxpc1NpbXVsYXRlZDohMCxvcmlnaW5hbEV2ZW50Ont9fSk7ZD9fLmV2ZW50LnRyaWdnZXIoZSxudWxsLGIpOl8uZXZlbnQuZGlzcGF0Y2guY2FsbChiLGUpLGUuaXNEZWZhdWx0UHJldmVudGVkKCkmJmMucHJldmVudERlZmF1bHQoKX19LF8ucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oYSxiLGMpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lciYmYS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYywhMSl9LF8uRXZlbnQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF8uRXZlbnQ/KGEmJmEudHlwZT8odGhpcy5vcmlnaW5hbEV2ZW50PWEsdGhpcy50eXBlPWEudHlwZSx0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD1hLmRlZmF1bHRQcmV2ZW50ZWR8fHZvaWQgMD09PWEuZGVmYXVsdFByZXZlbnRlZCYmYS5yZXR1cm5WYWx1ZT09PSExP2o6ayk6dGhpcy50eXBlPWEsYiYmXy5leHRlbmQodGhpcyxiKSx0aGlzLnRpbWVTdGFtcD1hJiZhLnRpbWVTdGFtcHx8Xy5ub3coKSx2b2lkKHRoaXNbXy5leHBhbmRvXT0hMCkpOm5ldyBfLkV2ZW50KGEsYil9LF8uRXZlbnQucHJvdG90eXBlPXtpc0RlZmF1bHRQcmV2ZW50ZWQ6ayxpc1Byb3BhZ2F0aW9uU3RvcHBlZDprLGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOmsscHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9yaWdpbmFsRXZlbnQ7dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9aixhJiZhLnByZXZlbnREZWZhdWx0JiZhLnByZXZlbnREZWZhdWx0KCl9LHN0b3BQcm9wYWdhdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkPWosYSYmYS5zdG9wUHJvcGFnYXRpb24mJmEuc3RvcFByb3BhZ2F0aW9uKCl9LHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkPWosYSYmYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24mJmEuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksdGhpcy5zdG9wUHJvcGFnYXRpb24oKX19LF8uZWFjaCh7bW91c2VlbnRlcjpcIm1vdXNlb3ZlclwiLG1vdXNlbGVhdmU6XCJtb3VzZW91dFwiLHBvaW50ZXJlbnRlcjpcInBvaW50ZXJvdmVyXCIscG9pbnRlcmxlYXZlOlwicG9pbnRlcm91dFwifSxmdW5jdGlvbihhLGIpe18uZXZlbnQuc3BlY2lhbFthXT17ZGVsZWdhdGVUeXBlOmIsYmluZFR5cGU6YixoYW5kbGU6ZnVuY3Rpb24oYSl7dmFyIGMsZD10aGlzLGU9YS5yZWxhdGVkVGFyZ2V0LGY9YS5oYW5kbGVPYmo7cmV0dXJuKCFlfHxlIT09ZCYmIV8uY29udGFpbnMoZCxlKSkmJihhLnR5cGU9Zi5vcmlnVHlwZSxjPWYuaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyksYS50eXBlPWIpLGN9fX0pLFkuZm9jdXNpbkJ1YmJsZXN8fF8uZWFjaCh7Zm9jdXM6XCJmb2N1c2luXCIsYmx1cjpcImZvY3Vzb3V0XCJ9LGZ1bmN0aW9uKGEsYil7dmFyIGM9ZnVuY3Rpb24oYSl7Xy5ldmVudC5zaW11bGF0ZShiLGEudGFyZ2V0LF8uZXZlbnQuZml4KGEpLCEwKX07Xy5ldmVudC5zcGVjaWFsW2JdPXtzZXR1cDpmdW5jdGlvbigpe3ZhciBkPXRoaXMub3duZXJEb2N1bWVudHx8dGhpcyxlPXJhLmFjY2VzcyhkLGIpO2V8fGQuYWRkRXZlbnRMaXN0ZW5lcihhLGMsITApLHJhLmFjY2VzcyhkLGIsKGV8fDApKzEpfSx0ZWFyZG93bjpmdW5jdGlvbigpe3ZhciBkPXRoaXMub3duZXJEb2N1bWVudHx8dGhpcyxlPXJhLmFjY2VzcyhkLGIpLTE7ZT9yYS5hY2Nlc3MoZCxiLGUpOihkLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSxjLCEwKSxyYS5yZW1vdmUoZCxiKSl9fX0pLF8uZm4uZXh0ZW5kKHtvbjpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGc7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEpe1wic3RyaW5nXCIhPXR5cGVvZiBiJiYoYz1jfHxiLGI9dm9pZCAwKTtmb3IoZyBpbiBhKXRoaXMub24oZyxiLGMsYVtnXSxlKTtyZXR1cm4gdGhpc31pZihudWxsPT1jJiZudWxsPT1kPyhkPWIsYz1iPXZvaWQgMCk6bnVsbD09ZCYmKFwic3RyaW5nXCI9PXR5cGVvZiBiPyhkPWMsYz12b2lkIDApOihkPWMsYz1iLGI9dm9pZCAwKSksZD09PSExKWQ9aztlbHNlIGlmKCFkKXJldHVybiB0aGlzO3JldHVybiAxPT09ZSYmKGY9ZCxkPWZ1bmN0aW9uKGEpe3JldHVybiBfKCkub2ZmKGEpLGYuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxkLmd1aWQ9Zi5ndWlkfHwoZi5ndWlkPV8uZ3VpZCsrKSksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7Xy5ldmVudC5hZGQodGhpcyxhLGQsYyxiKX0pfSxvbmU6ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIHRoaXMub24oYSxiLGMsZCwxKX0sb2ZmOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2lmKGEmJmEucHJldmVudERlZmF1bHQmJmEuaGFuZGxlT2JqKXJldHVybiBkPWEuaGFuZGxlT2JqLF8oYS5kZWxlZ2F0ZVRhcmdldCkub2ZmKGQubmFtZXNwYWNlP2Qub3JpZ1R5cGUrXCIuXCIrZC5uYW1lc3BhY2U6ZC5vcmlnVHlwZSxkLnNlbGVjdG9yLGQuaGFuZGxlciksdGhpcztpZihcIm9iamVjdFwiPT10eXBlb2YgYSl7Zm9yKGUgaW4gYSl0aGlzLm9mZihlLGIsYVtlXSk7cmV0dXJuIHRoaXN9cmV0dXJuKGI9PT0hMXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYikmJihjPWIsYj12b2lkIDApLGM9PT0hMSYmKGM9ayksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7Xy5ldmVudC5yZW1vdmUodGhpcyxhLGMsYil9KX0sdHJpZ2dlcjpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtfLmV2ZW50LnRyaWdnZXIoYSxiLHRoaXMpfSl9LHRyaWdnZXJIYW5kbGVyOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpc1swXTtyZXR1cm4gYz9fLmV2ZW50LnRyaWdnZXIoYSxiLGMsITApOnZvaWQgMH19KTt2YXIgRWE9LzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzpdKylbXj5dKilcXC8+L2dpLEZhPS88KFtcXHc6XSspLyxHYT0vPHwmIz9cXHcrOy8sSGE9LzwoPzpzY3JpcHR8c3R5bGV8bGluaykvaSxJYT0vY2hlY2tlZFxccyooPzpbXj1dfD1cXHMqLmNoZWNrZWQuKS9pLEphPS9eJHxcXC8oPzpqYXZhfGVjbWEpc2NyaXB0L2ksS2E9L150cnVlXFwvKC4qKS8sTGE9L15cXHMqPCEoPzpcXFtDREFUQVxcW3wtLSl8KD86XFxdXFxdfC0tKT5cXHMqJC9nLE1hPXtvcHRpb246WzEsXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsXCI8L3NlbGVjdD5cIl0sdGhlYWQ6WzEsXCI8dGFibGU+XCIsXCI8L3RhYmxlPlwiXSxjb2w6WzIsXCI8dGFibGU+PGNvbGdyb3VwPlwiLFwiPC9jb2xncm91cD48L3RhYmxlPlwiXSx0cjpbMixcIjx0YWJsZT48dGJvZHk+XCIsXCI8L3Rib2R5PjwvdGFibGU+XCJdLHRkOlszLFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sX2RlZmF1bHQ6WzAsXCJcIixcIlwiXX07TWEub3B0Z3JvdXA9TWEub3B0aW9uLE1hLnRib2R5PU1hLnRmb290PU1hLmNvbGdyb3VwPU1hLmNhcHRpb249TWEudGhlYWQsTWEudGg9TWEudGQsXy5leHRlbmQoe2Nsb25lOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuY2xvbmVOb2RlKCEwKSxpPV8uY29udGFpbnMoYS5vd25lckRvY3VtZW50LGEpO2lmKCEoWS5ub0Nsb25lQ2hlY2tlZHx8MSE9PWEubm9kZVR5cGUmJjExIT09YS5ub2RlVHlwZXx8Xy5pc1hNTERvYyhhKSkpZm9yKGc9cihoKSxmPXIoYSksZD0wLGU9Zi5sZW5ndGg7ZT5kO2QrKylzKGZbZF0sZ1tkXSk7aWYoYilpZihjKWZvcihmPWZ8fHIoYSksZz1nfHxyKGgpLGQ9MCxlPWYubGVuZ3RoO2U+ZDtkKyspcShmW2RdLGdbZF0pO2Vsc2UgcShhLGgpO3JldHVybiBnPXIoaCxcInNjcmlwdFwiKSxnLmxlbmd0aD4wJiZwKGcsIWkmJnIoYSxcInNjcmlwdFwiKSksaH0sYnVpbGRGcmFnbWVudDpmdW5jdGlvbihhLGIsYyxkKXtmb3IodmFyIGUsZixnLGgsaSxqLGs9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksbD1bXSxtPTAsbj1hLmxlbmd0aDtuPm07bSsrKWlmKGU9YVttXSxlfHwwPT09ZSlpZihcIm9iamVjdFwiPT09Xy50eXBlKGUpKV8ubWVyZ2UobCxlLm5vZGVUeXBlP1tlXTplKTtlbHNlIGlmKEdhLnRlc3QoZSkpe2ZvcihmPWZ8fGsuYXBwZW5kQ2hpbGQoYi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKSxnPShGYS5leGVjKGUpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKSxoPU1hW2ddfHxNYS5fZGVmYXVsdCxmLmlubmVySFRNTD1oWzFdK2UucmVwbGFjZShFYSxcIjwkMT48LyQyPlwiKStoWzJdLGo9aFswXTtqLS07KWY9Zi5sYXN0Q2hpbGQ7Xy5tZXJnZShsLGYuY2hpbGROb2RlcyksZj1rLmZpcnN0Q2hpbGQsZi50ZXh0Q29udGVudD1cIlwifWVsc2UgbC5wdXNoKGIuY3JlYXRlVGV4dE5vZGUoZSkpO2ZvcihrLnRleHRDb250ZW50PVwiXCIsbT0wO2U9bFttKytdOylpZigoIWR8fC0xPT09Xy5pbkFycmF5KGUsZCkpJiYoaT1fLmNvbnRhaW5zKGUub3duZXJEb2N1bWVudCxlKSxmPXIoay5hcHBlbmRDaGlsZChlKSxcInNjcmlwdFwiKSxpJiZwKGYpLGMpKWZvcihqPTA7ZT1mW2orK107KUphLnRlc3QoZS50eXBlfHxcIlwiKSYmYy5wdXNoKGUpO3JldHVybiBrfSxjbGVhbkRhdGE6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGMsZCxlLGY9Xy5ldmVudC5zcGVjaWFsLGc9MDt2b2lkIDAhPT0oYz1hW2ddKTtnKyspe2lmKF8uYWNjZXB0RGF0YShjKSYmKGU9Y1tyYS5leHBhbmRvXSxlJiYoYj1yYS5jYWNoZVtlXSkpKXtpZihiLmV2ZW50cylmb3IoZCBpbiBiLmV2ZW50cylmW2RdP18uZXZlbnQucmVtb3ZlKGMsZCk6Xy5yZW1vdmVFdmVudChjLGQsYi5oYW5kbGUpO3JhLmNhY2hlW2VdJiZkZWxldGUgcmEuY2FjaGVbZV19ZGVsZXRlIHNhLmNhY2hlW2Nbc2EuZXhwYW5kb11dfX19KSxfLmZuLmV4dGVuZCh7dGV4dDpmdW5jdGlvbihhKXtyZXR1cm4gcWEodGhpcyxmdW5jdGlvbihhKXtyZXR1cm4gdm9pZCAwPT09YT9fLnRleHQodGhpcyk6dGhpcy5lbXB0eSgpLmVhY2goZnVuY3Rpb24oKXsoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpJiYodGhpcy50ZXh0Q29udGVudD1hKX0pfSxudWxsLGEsYXJndW1lbnRzLmxlbmd0aCl9LGFwcGVuZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cyxmdW5jdGlvbihhKXtpZigxPT09dGhpcy5ub2RlVHlwZXx8MTE9PT10aGlzLm5vZGVUeXBlfHw5PT09dGhpcy5ub2RlVHlwZSl7dmFyIGI9bSh0aGlzLGEpO2IuYXBwZW5kQ2hpbGQoYSl9fSl9LHByZXBlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oYSl7aWYoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpe3ZhciBiPW0odGhpcyxhKTtiLmluc2VydEJlZm9yZShhLGIuZmlyc3RDaGlsZCl9fSl9LGJlZm9yZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cyxmdW5jdGlvbihhKXt0aGlzLnBhcmVudE5vZGUmJnRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSx0aGlzKX0pfSxhZnRlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRvbU1hbmlwKGFyZ3VtZW50cyxmdW5jdGlvbihhKXt0aGlzLnBhcmVudE5vZGUmJnRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSx0aGlzLm5leHRTaWJsaW5nKX0pfSxyZW1vdmU6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGMsZD1hP18uZmlsdGVyKGEsdGhpcyk6dGhpcyxlPTA7bnVsbCE9KGM9ZFtlXSk7ZSsrKWJ8fDEhPT1jLm5vZGVUeXBlfHxfLmNsZWFuRGF0YShyKGMpKSxjLnBhcmVudE5vZGUmJihiJiZfLmNvbnRhaW5zKGMub3duZXJEb2N1bWVudCxjKSYmcChyKGMsXCJzY3JpcHRcIikpLGMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjKSk7cmV0dXJuIHRoaXN9LGVtcHR5OmZ1bmN0aW9uKCl7Zm9yKHZhciBhLGI9MDtudWxsIT0oYT10aGlzW2JdKTtiKyspMT09PWEubm9kZVR5cGUmJihfLmNsZWFuRGF0YShyKGEsITEpKSxhLnRleHRDb250ZW50PVwiXCIpO3JldHVybiB0aGlzfSxjbG9uZTpmdW5jdGlvbihhLGIpe3JldHVybiBhPW51bGw9PWE/ITE6YSxiPW51bGw9PWI/YTpiLHRoaXMubWFwKGZ1bmN0aW9uKCl7cmV0dXJuIF8uY2xvbmUodGhpcyxhLGIpfSl9LGh0bWw6ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKHRoaXMsZnVuY3Rpb24oYSl7dmFyIGI9dGhpc1swXXx8e30sYz0wLGQ9dGhpcy5sZW5ndGg7aWYodm9pZCAwPT09YSYmMT09PWIubm9kZVR5cGUpcmV0dXJuIGIuaW5uZXJIVE1MO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhJiYhSGEudGVzdChhKSYmIU1hWyhGYS5leGVjKGEpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKV0pe2E9YS5yZXBsYWNlKEVhLFwiPCQxPjwvJDI+XCIpO3RyeXtmb3IoO2Q+YztjKyspYj10aGlzW2NdfHx7fSwxPT09Yi5ub2RlVHlwZSYmKF8uY2xlYW5EYXRhKHIoYiwhMSkpLGIuaW5uZXJIVE1MPWEpO2I9MH1jYXRjaChlKXt9fWImJnRoaXMuZW1wdHkoKS5hcHBlbmQoYSl9LG51bGwsYSxhcmd1bWVudHMubGVuZ3RoKX0scmVwbGFjZVdpdGg6ZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHNbMF07cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGIpe2E9dGhpcy5wYXJlbnROb2RlLF8uY2xlYW5EYXRhKHIodGhpcykpLGEmJmEucmVwbGFjZUNoaWxkKGIsdGhpcyl9KSxhJiYoYS5sZW5ndGh8fGEubm9kZVR5cGUpP3RoaXM6dGhpcy5yZW1vdmUoKX0sZGV0YWNoOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnJlbW92ZShhLCEwKX0sZG9tTWFuaXA6ZnVuY3Rpb24oYSxiKXthPVMuYXBwbHkoW10sYSk7dmFyIGMsZCxlLGYsZyxoLGk9MCxqPXRoaXMubGVuZ3RoLGs9dGhpcyxsPWotMSxtPWFbMF0scD1fLmlzRnVuY3Rpb24obSk7aWYocHx8aj4xJiZcInN0cmluZ1wiPT10eXBlb2YgbSYmIVkuY2hlY2tDbG9uZSYmSWEudGVzdChtKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe3ZhciBkPWsuZXEoYyk7cCYmKGFbMF09bS5jYWxsKHRoaXMsYyxkLmh0bWwoKSkpLGQuZG9tTWFuaXAoYSxiKX0pO2lmKGomJihjPV8uYnVpbGRGcmFnbWVudChhLHRoaXNbMF0ub3duZXJEb2N1bWVudCwhMSx0aGlzKSxkPWMuZmlyc3RDaGlsZCwxPT09Yy5jaGlsZE5vZGVzLmxlbmd0aCYmKGM9ZCksZCkpe2ZvcihlPV8ubWFwKHIoYyxcInNjcmlwdFwiKSxuKSxmPWUubGVuZ3RoO2o+aTtpKyspZz1jLGkhPT1sJiYoZz1fLmNsb25lKGcsITAsITApLGYmJl8ubWVyZ2UoZSxyKGcsXCJzY3JpcHRcIikpKSxiLmNhbGwodGhpc1tpXSxnLGkpO2lmKGYpZm9yKGg9ZVtlLmxlbmd0aC0xXS5vd25lckRvY3VtZW50LF8ubWFwKGUsbyksaT0wO2Y+aTtpKyspZz1lW2ldLEphLnRlc3QoZy50eXBlfHxcIlwiKSYmIXJhLmFjY2VzcyhnLFwiZ2xvYmFsRXZhbFwiKSYmXy5jb250YWlucyhoLGcpJiYoZy5zcmM/Xy5fZXZhbFVybCYmXy5fZXZhbFVybChnLnNyYyk6Xy5nbG9iYWxFdmFsKGcudGV4dENvbnRlbnQucmVwbGFjZShMYSxcIlwiKSkpfXJldHVybiB0aGlzfX0pLF8uZWFjaCh7YXBwZW5kVG86XCJhcHBlbmRcIixwcmVwZW5kVG86XCJwcmVwZW5kXCIsaW5zZXJ0QmVmb3JlOlwiYmVmb3JlXCIsaW5zZXJ0QWZ0ZXI6XCJhZnRlclwiLHJlcGxhY2VBbGw6XCJyZXBsYWNlV2l0aFwifSxmdW5jdGlvbihhLGIpe18uZm5bYV09ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGQ9W10sZT1fKGEpLGY9ZS5sZW5ndGgtMSxnPTA7Zj49ZztnKyspYz1nPT09Zj90aGlzOnRoaXMuY2xvbmUoITApLF8oZVtnXSlbYl0oYyksVC5hcHBseShkLGMuZ2V0KCkpO3JldHVybiB0aGlzLnB1c2hTdGFjayhkKX19KTt2YXIgTmEsT2E9e30sUGE9L15tYXJnaW4vLFFhPW5ldyBSZWdFeHAoXCJeKFwiK3ZhK1wiKSg/IXB4KVthLXolXSskXCIsXCJpXCIpLFJhPWZ1bmN0aW9uKGIpe3JldHVybiBiLm93bmVyRG9jdW1lbnQuZGVmYXVsdFZpZXcub3BlbmVyP2Iub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCk6YS5nZXRDb21wdXRlZFN0eWxlKGIsbnVsbCl9OyFmdW5jdGlvbigpe2Z1bmN0aW9uIGIoKXtnLnN0eWxlLmNzc1RleHQ9XCItd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTpibG9jazttYXJnaW4tdG9wOjElO3RvcDoxJTtib3JkZXI6MXB4O3BhZGRpbmc6MXB4O3dpZHRoOjRweDtwb3NpdGlvbjphYnNvbHV0ZVwiLGcuaW5uZXJIVE1MPVwiXCIsZS5hcHBlbmRDaGlsZChmKTt2YXIgYj1hLmdldENvbXB1dGVkU3R5bGUoZyxudWxsKTtjPVwiMSVcIiE9PWIudG9wLGQ9XCI0cHhcIj09PWIud2lkdGgsZS5yZW1vdmVDaGlsZChmKX12YXIgYyxkLGU9Wi5kb2N1bWVudEVsZW1lbnQsZj1aLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksZz1aLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zy5zdHlsZSYmKGcuc3R5bGUuYmFja2dyb3VuZENsaXA9XCJjb250ZW50LWJveFwiLGcuY2xvbmVOb2RlKCEwKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcD1cIlwiLFkuY2xlYXJDbG9uZVN0eWxlPVwiY29udGVudC1ib3hcIj09PWcuc3R5bGUuYmFja2dyb3VuZENsaXAsZi5zdHlsZS5jc3NUZXh0PVwiYm9yZGVyOjA7d2lkdGg6MDtoZWlnaHQ6MDt0b3A6MDtsZWZ0Oi05OTk5cHg7bWFyZ2luLXRvcDoxcHg7cG9zaXRpb246YWJzb2x1dGVcIixmLmFwcGVuZENoaWxkKGcpLGEuZ2V0Q29tcHV0ZWRTdHlsZSYmXy5leHRlbmQoWSx7cGl4ZWxQb3NpdGlvbjpmdW5jdGlvbigpe3JldHVybiBiKCksY30sYm94U2l6aW5nUmVsaWFibGU6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbD09ZCYmYigpLGR9LHJlbGlhYmxlTWFyZ2luUmlnaHQ6ZnVuY3Rpb24oKXt2YXIgYixjPWcuYXBwZW5kQ2hpbGQoWi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtyZXR1cm4gYy5zdHlsZS5jc3NUZXh0PWcuc3R5bGUuY3NzVGV4dD1cIi13ZWJraXQtYm94LXNpemluZzpjb250ZW50LWJveDstbW96LWJveC1zaXppbmc6Y29udGVudC1ib3g7Ym94LXNpemluZzpjb250ZW50LWJveDtkaXNwbGF5OmJsb2NrO21hcmdpbjowO2JvcmRlcjowO3BhZGRpbmc6MFwiLGMuc3R5bGUubWFyZ2luUmlnaHQ9Yy5zdHlsZS53aWR0aD1cIjBcIixnLnN0eWxlLndpZHRoPVwiMXB4XCIsZS5hcHBlbmRDaGlsZChmKSxiPSFwYXJzZUZsb2F0KGEuZ2V0Q29tcHV0ZWRTdHlsZShjLG51bGwpLm1hcmdpblJpZ2h0KSxlLnJlbW92ZUNoaWxkKGYpLGcucmVtb3ZlQ2hpbGQoYyksYn19KSl9KCksXy5zd2FwPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlLGYsZz17fTtmb3IoZiBpbiBiKWdbZl09YS5zdHlsZVtmXSxhLnN0eWxlW2ZdPWJbZl07ZT1jLmFwcGx5KGEsZHx8W10pO2ZvcihmIGluIGIpYS5zdHlsZVtmXT1nW2ZdO3JldHVybiBlfTt2YXIgU2E9L14obm9uZXx0YWJsZSg/IS1jW2VhXSkuKykvLFRhPW5ldyBSZWdFeHAoXCJeKFwiK3ZhK1wiKSguKikkXCIsXCJpXCIpLFVhPW5ldyBSZWdFeHAoXCJeKFsrLV0pPShcIit2YStcIilcIixcImlcIiksVmE9e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCIsZGlzcGxheTpcImJsb2NrXCJ9LFdhPXtsZXR0ZXJTcGFjaW5nOlwiMFwiLGZvbnRXZWlnaHQ6XCI0MDBcIn0sWGE9W1wiV2Via2l0XCIsXCJPXCIsXCJNb3pcIixcIm1zXCJdO18uZXh0ZW5kKHtjc3NIb29rczp7b3BhY2l0eTp7Z2V0OmZ1bmN0aW9uKGEsYil7aWYoYil7dmFyIGM9dihhLFwib3BhY2l0eVwiKTtyZXR1cm5cIlwiPT09Yz9cIjFcIjpjfX19fSxjc3NOdW1iZXI6e2NvbHVtbkNvdW50OiEwLGZpbGxPcGFjaXR5OiEwLGZsZXhHcm93OiEwLGZsZXhTaHJpbms6ITAsZm9udFdlaWdodDohMCxsaW5lSGVpZ2h0OiEwLG9wYWNpdHk6ITAsb3JkZXI6ITAsb3JwaGFuczohMCx3aWRvd3M6ITAsekluZGV4OiEwLHpvb206ITB9LGNzc1Byb3BzOntcImZsb2F0XCI6XCJjc3NGbG9hdFwifSxzdHlsZTpmdW5jdGlvbihhLGIsYyxkKXtpZihhJiYzIT09YS5ub2RlVHlwZSYmOCE9PWEubm9kZVR5cGUmJmEuc3R5bGUpe3ZhciBlLGYsZyxoPV8uY2FtZWxDYXNlKGIpLGk9YS5zdHlsZTtyZXR1cm4gYj1fLmNzc1Byb3BzW2hdfHwoXy5jc3NQcm9wc1toXT14KGksaCkpLGc9Xy5jc3NIb29rc1tiXXx8Xy5jc3NIb29rc1toXSx2b2lkIDA9PT1jP2cmJlwiZ2V0XCJpbiBnJiZ2b2lkIDAhPT0oZT1nLmdldChhLCExLGQpKT9lOmlbYl06KGY9dHlwZW9mIGMsXCJzdHJpbmdcIj09PWYmJihlPVVhLmV4ZWMoYykpJiYoYz0oZVsxXSsxKSplWzJdK3BhcnNlRmxvYXQoXy5jc3MoYSxiKSksZj1cIm51bWJlclwiKSxudWxsIT1jJiZjPT09YyYmKFwibnVtYmVyXCIhPT1mfHxfLmNzc051bWJlcltoXXx8KGMrPVwicHhcIiksWS5jbGVhckNsb25lU3R5bGV8fFwiXCIhPT1jfHwwIT09Yi5pbmRleE9mKFwiYmFja2dyb3VuZFwiKXx8KGlbYl09XCJpbmhlcml0XCIpLGcmJlwic2V0XCJpbiBnJiZ2b2lkIDA9PT0oYz1nLnNldChhLGMsZCkpfHwoaVtiXT1jKSksdm9pZCAwKX19LGNzczpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZSxmLGcsaD1fLmNhbWVsQ2FzZShiKTtyZXR1cm4gYj1fLmNzc1Byb3BzW2hdfHwoXy5jc3NQcm9wc1toXT14KGEuc3R5bGUsaCkpLGc9Xy5jc3NIb29rc1tiXXx8Xy5jc3NIb29rc1toXSxnJiZcImdldFwiaW4gZyYmKGU9Zy5nZXQoYSwhMCxjKSksdm9pZCAwPT09ZSYmKGU9dihhLGIsZCkpLFwibm9ybWFsXCI9PT1lJiZiIGluIFdhJiYoZT1XYVtiXSksXCJcIj09PWN8fGM/KGY9cGFyc2VGbG9hdChlKSxjPT09ITB8fF8uaXNOdW1lcmljKGYpP2Z8fDA6ZSk6ZX19KSxfLmVhY2goW1wiaGVpZ2h0XCIsXCJ3aWR0aFwiXSxmdW5jdGlvbihhLGIpe18uY3NzSG9va3NbYl09e2dldDpmdW5jdGlvbihhLGMsZCl7cmV0dXJuIGM/U2EudGVzdChfLmNzcyhhLFwiZGlzcGxheVwiKSkmJjA9PT1hLm9mZnNldFdpZHRoP18uc3dhcChhLFZhLGZ1bmN0aW9uKCl7cmV0dXJuIEEoYSxiLGQpfSk6QShhLGIsZCk6dm9pZCAwfSxzZXQ6ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWQmJlJhKGEpO3JldHVybiB5KGEsYyxkP3ooYSxiLGQsXCJib3JkZXItYm94XCI9PT1fLmNzcyhhLFwiYm94U2l6aW5nXCIsITEsZSksZSk6MCl9fX0pLF8uY3NzSG9va3MubWFyZ2luUmlnaHQ9dyhZLnJlbGlhYmxlTWFyZ2luUmlnaHQsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj9fLnN3YXAoYSx7ZGlzcGxheTpcImlubGluZS1ibG9ja1wifSx2LFthLFwibWFyZ2luUmlnaHRcIl0pOnZvaWQgMH0pLF8uZWFjaCh7bWFyZ2luOlwiXCIscGFkZGluZzpcIlwiLGJvcmRlcjpcIldpZHRoXCJ9LGZ1bmN0aW9uKGEsYil7Xy5jc3NIb29rc1thK2JdPXtleHBhbmQ6ZnVuY3Rpb24oYyl7Zm9yKHZhciBkPTAsZT17fSxmPVwic3RyaW5nXCI9PXR5cGVvZiBjP2Muc3BsaXQoXCIgXCIpOltjXTs0PmQ7ZCsrKWVbYSt3YVtkXStiXT1mW2RdfHxmW2QtMl18fGZbMF07cmV0dXJuIGV9fSxQYS50ZXN0KGEpfHwoXy5jc3NIb29rc1thK2JdLnNldD15KX0pLF8uZm4uZXh0ZW5kKHtjc3M6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gcWEodGhpcyxmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmPXt9LGc9MDtpZihfLmlzQXJyYXkoYikpe2ZvcihkPVJhKGEpLGU9Yi5sZW5ndGg7ZT5nO2crKylmW2JbZ11dPV8uY3NzKGEsYltnXSwhMSxkKTtyZXR1cm4gZn1yZXR1cm4gdm9pZCAwIT09Yz9fLnN0eWxlKGEsYixjKTpfLmNzcyhhLGIpfSxhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0sc2hvdzpmdW5jdGlvbigpe3JldHVybiBCKHRoaXMsITApfSxoaWRlOmZ1bmN0aW9uKCl7cmV0dXJuIEIodGhpcyl9LHRvZ2dsZTpmdW5jdGlvbihhKXtyZXR1cm5cImJvb2xlYW5cIj09dHlwZW9mIGE/YT90aGlzLnNob3coKTp0aGlzLmhpZGUoKTp0aGlzLmVhY2goZnVuY3Rpb24oKXt4YSh0aGlzKT9fKHRoaXMpLnNob3coKTpfKHRoaXMpLmhpZGUoKX0pfX0pLF8uVHdlZW49QyxDLnByb3RvdHlwZT17Y29uc3RydWN0b3I6Qyxpbml0OmZ1bmN0aW9uKGEsYixjLGQsZSxmKXt0aGlzLmVsZW09YSx0aGlzLnByb3A9Yyx0aGlzLmVhc2luZz1lfHxcInN3aW5nXCIsdGhpcy5vcHRpb25zPWIsdGhpcy5zdGFydD10aGlzLm5vdz10aGlzLmN1cigpLHRoaXMuZW5kPWQsdGhpcy51bml0PWZ8fChfLmNzc051bWJlcltjXT9cIlwiOlwicHhcIil9LGN1cjpmdW5jdGlvbigpe3ZhciBhPUMucHJvcEhvb2tzW3RoaXMucHJvcF07cmV0dXJuIGEmJmEuZ2V0P2EuZ2V0KHRoaXMpOkMucHJvcEhvb2tzLl9kZWZhdWx0LmdldCh0aGlzKX0scnVuOmZ1bmN0aW9uKGEpe3ZhciBiLGM9Qy5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gdGhpcy5vcHRpb25zLmR1cmF0aW9uP3RoaXMucG9zPWI9Xy5lYXNpbmdbdGhpcy5lYXNpbmddKGEsdGhpcy5vcHRpb25zLmR1cmF0aW9uKmEsMCwxLHRoaXMub3B0aW9ucy5kdXJhdGlvbik6dGhpcy5wb3M9Yj1hLHRoaXMubm93PSh0aGlzLmVuZC10aGlzLnN0YXJ0KSpiK3RoaXMuc3RhcnQsdGhpcy5vcHRpb25zLnN0ZXAmJnRoaXMub3B0aW9ucy5zdGVwLmNhbGwodGhpcy5lbGVtLHRoaXMubm93LHRoaXMpLGMmJmMuc2V0P2Muc2V0KHRoaXMpOkMucHJvcEhvb2tzLl9kZWZhdWx0LnNldCh0aGlzKSx0aGlzfX0sQy5wcm90b3R5cGUuaW5pdC5wcm90b3R5cGU9Qy5wcm90b3R5cGUsQy5wcm9wSG9va3M9e19kZWZhdWx0OntnZXQ6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIG51bGw9PWEuZWxlbVthLnByb3BdfHxhLmVsZW0uc3R5bGUmJm51bGwhPWEuZWxlbS5zdHlsZVthLnByb3BdPyhiPV8uY3NzKGEuZWxlbSxhLnByb3AsXCJcIiksYiYmXCJhdXRvXCIhPT1iP2I6MCk6YS5lbGVtW2EucHJvcF19LHNldDpmdW5jdGlvbihhKXtfLmZ4LnN0ZXBbYS5wcm9wXT9fLmZ4LnN0ZXBbYS5wcm9wXShhKTphLmVsZW0uc3R5bGUmJihudWxsIT1hLmVsZW0uc3R5bGVbXy5jc3NQcm9wc1thLnByb3BdXXx8Xy5jc3NIb29rc1thLnByb3BdKT9fLnN0eWxlKGEuZWxlbSxhLnByb3AsYS5ub3crYS51bml0KTphLmVsZW1bYS5wcm9wXT1hLm5vd319fSxDLnByb3BIb29rcy5zY3JvbGxUb3A9Qy5wcm9wSG9va3Muc2Nyb2xsTGVmdD17c2V0OmZ1bmN0aW9uKGEpe2EuZWxlbS5ub2RlVHlwZSYmYS5lbGVtLnBhcmVudE5vZGUmJihhLmVsZW1bYS5wcm9wXT1hLm5vdyl9fSxfLmVhc2luZz17bGluZWFyOmZ1bmN0aW9uKGEpe3JldHVybiBhfSxzd2luZzpmdW5jdGlvbihhKXtyZXR1cm4uNS1NYXRoLmNvcyhhKk1hdGguUEkpLzJ9fSxfLmZ4PUMucHJvdG90eXBlLmluaXQsXy5meC5zdGVwPXt9O3ZhciBZYSxaYSwkYT0vXig/OnRvZ2dsZXxzaG93fGhpZGUpJC8sX2E9bmV3IFJlZ0V4cChcIl4oPzooWystXSk9fCkoXCIrdmErXCIpKFthLXolXSopJFwiLFwiaVwiKSxhYj0vcXVldWVIb29rcyQvLGJiPVtHXSxjYj17XCIqXCI6W2Z1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5jcmVhdGVUd2VlbihhLGIpLGQ9Yy5jdXIoKSxlPV9hLmV4ZWMoYiksZj1lJiZlWzNdfHwoXy5jc3NOdW1iZXJbYV0/XCJcIjpcInB4XCIpLGc9KF8uY3NzTnVtYmVyW2FdfHxcInB4XCIhPT1mJiYrZCkmJl9hLmV4ZWMoXy5jc3MoYy5lbGVtLGEpKSxoPTEsaT0yMDtpZihnJiZnWzNdIT09Zil7Zj1mfHxnWzNdLGU9ZXx8W10sZz0rZHx8MTtkbyBoPWh8fFwiLjVcIixnLz1oLF8uc3R5bGUoYy5lbGVtLGEsZytmKTt3aGlsZShoIT09KGg9Yy5jdXIoKS9kKSYmMSE9PWgmJi0taSl9cmV0dXJuIGUmJihnPWMuc3RhcnQ9K2d8fCtkfHwwLGMudW5pdD1mLGMuZW5kPWVbMV0/ZysoZVsxXSsxKSplWzJdOitlWzJdKSxjfV19O18uQW5pbWF0aW9uPV8uZXh0ZW5kKEkse3R3ZWVuZXI6ZnVuY3Rpb24oYSxiKXtfLmlzRnVuY3Rpb24oYSk/KGI9YSxhPVtcIipcIl0pOmE9YS5zcGxpdChcIiBcIik7Zm9yKHZhciBjLGQ9MCxlPWEubGVuZ3RoO2U+ZDtkKyspYz1hW2RdLGNiW2NdPWNiW2NdfHxbXSxjYltjXS51bnNoaWZ0KGIpfSxwcmVmaWx0ZXI6ZnVuY3Rpb24oYSxiKXtiP2JiLnVuc2hpZnQoYSk6YmIucHVzaChhKX19KSxfLnNwZWVkPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hJiZcIm9iamVjdFwiPT10eXBlb2YgYT9fLmV4dGVuZCh7fSxhKTp7Y29tcGxldGU6Y3x8IWMmJmJ8fF8uaXNGdW5jdGlvbihhKSYmYSxkdXJhdGlvbjphLGVhc2luZzpjJiZifHxiJiYhXy5pc0Z1bmN0aW9uKGIpJiZifTtyZXR1cm4gZC5kdXJhdGlvbj1fLmZ4Lm9mZj8wOlwibnVtYmVyXCI9PXR5cGVvZiBkLmR1cmF0aW9uP2QuZHVyYXRpb246ZC5kdXJhdGlvbiBpbiBfLmZ4LnNwZWVkcz9fLmZ4LnNwZWVkc1tkLmR1cmF0aW9uXTpfLmZ4LnNwZWVkcy5fZGVmYXVsdCwobnVsbD09ZC5xdWV1ZXx8ZC5xdWV1ZT09PSEwKSYmKGQucXVldWU9XCJmeFwiKSxkLm9sZD1kLmNvbXBsZXRlLGQuY29tcGxldGU9ZnVuY3Rpb24oKXtfLmlzRnVuY3Rpb24oZC5vbGQpJiZkLm9sZC5jYWxsKHRoaXMpLGQucXVldWUmJl8uZGVxdWV1ZSh0aGlzLGQucXVldWUpfSxkfSxfLmZuLmV4dGVuZCh7ZmFkZVRvOmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiB0aGlzLmZpbHRlcih4YSkuY3NzKFwib3BhY2l0eVwiLDApLnNob3coKS5lbmQoKS5hbmltYXRlKHtvcGFjaXR5OmJ9LGEsYyxkKX0sYW5pbWF0ZTpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1fLmlzRW1wdHlPYmplY3QoYSksZj1fLnNwZWVkKGIsYyxkKSxnPWZ1bmN0aW9uKCl7dmFyIGI9SSh0aGlzLF8uZXh0ZW5kKHt9LGEpLGYpOyhlfHxyYS5nZXQodGhpcyxcImZpbmlzaFwiKSkmJmIuc3RvcCghMCl9O3JldHVybiBnLmZpbmlzaD1nLGV8fGYucXVldWU9PT0hMT90aGlzLmVhY2goZyk6dGhpcy5xdWV1ZShmLnF1ZXVlLGcpfSxzdG9wOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1mdW5jdGlvbihhKXt2YXIgYj1hLnN0b3A7ZGVsZXRlIGEuc3RvcCxiKGMpfTtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgYSYmKGM9YixiPWEsYT12b2lkIDApLGImJmEhPT0hMSYmdGhpcy5xdWV1ZShhfHxcImZ4XCIsW10pLHRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBiPSEwLGU9bnVsbCE9YSYmYStcInF1ZXVlSG9va3NcIixmPV8udGltZXJzLGc9cmEuZ2V0KHRoaXMpO2lmKGUpZ1tlXSYmZ1tlXS5zdG9wJiZkKGdbZV0pO2Vsc2UgZm9yKGUgaW4gZylnW2VdJiZnW2VdLnN0b3AmJmFiLnRlc3QoZSkmJmQoZ1tlXSk7Zm9yKGU9Zi5sZW5ndGg7ZS0tOylmW2VdLmVsZW0hPT10aGlzfHxudWxsIT1hJiZmW2VdLnF1ZXVlIT09YXx8KGZbZV0uYW5pbS5zdG9wKGMpLGI9ITEsZi5zcGxpY2UoZSwxKSk7KGJ8fCFjKSYmXy5kZXF1ZXVlKHRoaXMsYSl9KX0sZmluaXNoOmZ1bmN0aW9uKGEpe3JldHVybiBhIT09ITEmJihhPWF8fFwiZnhcIiksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGIsYz1yYS5nZXQodGhpcyksZD1jW2ErXCJxdWV1ZVwiXSxlPWNbYStcInF1ZXVlSG9va3NcIl0sZj1fLnRpbWVycyxnPWQ/ZC5sZW5ndGg6MDtmb3IoYy5maW5pc2g9ITAsXy5xdWV1ZSh0aGlzLGEsW10pLGUmJmUuc3RvcCYmZS5zdG9wLmNhbGwodGhpcywhMCksYj1mLmxlbmd0aDtiLS07KWZbYl0uZWxlbT09PXRoaXMmJmZbYl0ucXVldWU9PT1hJiYoZltiXS5hbmltLnN0b3AoITApLGYuc3BsaWNlKGIsMSkpO2ZvcihiPTA7Zz5iO2IrKylkW2JdJiZkW2JdLmZpbmlzaCYmZFtiXS5maW5pc2guY2FsbCh0aGlzKTtkZWxldGUgYy5maW5pc2h9KX19KSxfLmVhY2goW1widG9nZ2xlXCIsXCJzaG93XCIsXCJoaWRlXCJdLGZ1bmN0aW9uKGEsYil7dmFyIGM9Xy5mbltiXTtfLmZuW2JdPWZ1bmN0aW9uKGEsZCxlKXtyZXR1cm4gbnVsbD09YXx8XCJib29sZWFuXCI9PXR5cGVvZiBhP2MuYXBwbHkodGhpcyxhcmd1bWVudHMpOnRoaXMuYW5pbWF0ZShFKGIsITApLGEsZCxlKX19KSxfLmVhY2goe3NsaWRlRG93bjpFKFwic2hvd1wiKSxzbGlkZVVwOkUoXCJoaWRlXCIpLHNsaWRlVG9nZ2xlOkUoXCJ0b2dnbGVcIiksZmFkZUluOntvcGFjaXR5Olwic2hvd1wifSxmYWRlT3V0OntvcGFjaXR5OlwiaGlkZVwifSxmYWRlVG9nZ2xlOntvcGFjaXR5OlwidG9nZ2xlXCJ9fSxmdW5jdGlvbihhLGIpe18uZm5bYV09ZnVuY3Rpb24oYSxjLGQpe3JldHVybiB0aGlzLmFuaW1hdGUoYixhLGMsZCl9fSksXy50aW1lcnM9W10sXy5meC50aWNrPWZ1bmN0aW9uKCl7dmFyIGEsYj0wLGM9Xy50aW1lcnM7Zm9yKFlhPV8ubm93KCk7YjxjLmxlbmd0aDtiKyspYT1jW2JdLGEoKXx8Y1tiXSE9PWF8fGMuc3BsaWNlKGItLSwxKTtjLmxlbmd0aHx8Xy5meC5zdG9wKCksWWE9dm9pZCAwfSxfLmZ4LnRpbWVyPWZ1bmN0aW9uKGEpe18udGltZXJzLnB1c2goYSksYSgpP18uZnguc3RhcnQoKTpfLnRpbWVycy5wb3AoKX0sXy5meC5pbnRlcnZhbD0xMyxfLmZ4LnN0YXJ0PWZ1bmN0aW9uKCl7WmF8fChaYT1zZXRJbnRlcnZhbChfLmZ4LnRpY2ssXy5meC5pbnRlcnZhbCkpfSxfLmZ4LnN0b3A9ZnVuY3Rpb24oKXtjbGVhckludGVydmFsKFphKSxaYT1udWxsfSxfLmZ4LnNwZWVkcz17c2xvdzo2MDAsZmFzdDoyMDAsX2RlZmF1bHQ6NDAwfSxfLmZuLmRlbGF5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9Xy5meD9fLmZ4LnNwZWVkc1thXXx8YTphLGI9Ynx8XCJmeFwiLHRoaXMucXVldWUoYixmdW5jdGlvbihiLGMpe3ZhciBkPXNldFRpbWVvdXQoYixhKTtjLnN0b3A9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZCl9fSl9LGZ1bmN0aW9uKCl7dmFyIGE9Wi5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksYj1aLmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIiksYz1iLmFwcGVuZENoaWxkKFouY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSk7YS50eXBlPVwiY2hlY2tib3hcIixZLmNoZWNrT249XCJcIiE9PWEudmFsdWUsWS5vcHRTZWxlY3RlZD1jLnNlbGVjdGVkLGIuZGlzYWJsZWQ9ITAsWS5vcHREaXNhYmxlZD0hYy5kaXNhYmxlZCxhPVouY3JlYXRlRWxlbWVudChcImlucHV0XCIpLGEudmFsdWU9XCJ0XCIsYS50eXBlPVwicmFkaW9cIixZLnJhZGlvVmFsdWU9XCJ0XCI9PT1hLnZhbHVlfSgpO3ZhciBkYixlYixmYj1fLmV4cHIuYXR0ckhhbmRsZTtfLmZuLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihhLGIpe3JldHVybiBxYSh0aGlzLF8uYXR0cixhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0scmVtb3ZlQXR0cjpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7Xy5yZW1vdmVBdHRyKHRoaXMsYSl9KX19KSxfLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmPWEubm9kZVR5cGU7aWYoYSYmMyE9PWYmJjghPT1mJiYyIT09ZilyZXR1cm4gdHlwZW9mIGEuZ2V0QXR0cmlidXRlPT09emE/Xy5wcm9wKGEsYixjKTooMT09PWYmJl8uaXNYTUxEb2MoYSl8fChiPWIudG9Mb3dlckNhc2UoKSxkPV8uYXR0ckhvb2tzW2JdfHwoXy5leHByLm1hdGNoLmJvb2wudGVzdChiKT9lYjpkYikpLHZvaWQgMD09PWM/ZCYmXCJnZXRcImluIGQmJm51bGwhPT0oZT1kLmdldChhLGIpKT9lOihlPV8uZmluZC5hdHRyKGEsYiksbnVsbD09ZT92b2lkIDA6ZSk6bnVsbCE9PWM/ZCYmXCJzZXRcImluIGQmJnZvaWQgMCE9PShlPWQuc2V0KGEsYyxiKSk/ZTooYS5zZXRBdHRyaWJ1dGUoYixjK1wiXCIpLGMpOnZvaWQgXy5yZW1vdmVBdHRyKGEsYikpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlPTAsZj1iJiZiLm1hdGNoKG5hKTtpZihmJiYxPT09YS5ub2RlVHlwZSlmb3IoO2M9ZltlKytdOylkPV8ucHJvcEZpeFtjXXx8YyxfLmV4cHIubWF0Y2guYm9vbC50ZXN0KGMpJiYoYVtkXT0hMSksYS5yZW1vdmVBdHRyaWJ1dGUoYyl9LGF0dHJIb29rczp7dHlwZTp7c2V0OmZ1bmN0aW9uKGEsYil7aWYoIVkucmFkaW9WYWx1ZSYmXCJyYWRpb1wiPT09YiYmXy5ub2RlTmFtZShhLFwiaW5wdXRcIikpe3ZhciBjPWEudmFsdWU7cmV0dXJuIGEuc2V0QXR0cmlidXRlKFwidHlwZVwiLGIpLGMmJihhLnZhbHVlPWMpLGJ9fX19fSksZWI9e3NldDpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGI9PT0hMT9fLnJlbW92ZUF0dHIoYSxjKTphLnNldEF0dHJpYnV0ZShjLGMpLGN9fSxfLmVhY2goXy5leHByLm1hdGNoLmJvb2wuc291cmNlLm1hdGNoKC9cXHcrL2cpLGZ1bmN0aW9uKGEsYil7dmFyIGM9ZmJbYl18fF8uZmluZC5hdHRyO2ZiW2JdPWZ1bmN0aW9uKGEsYixkKXt2YXIgZSxmO3JldHVybiBkfHwoZj1mYltiXSxmYltiXT1lLGU9bnVsbCE9YyhhLGIsZCk/Yi50b0xvd2VyQ2FzZSgpOm51bGwsZmJbYl09ZiksZX19KTt2YXIgZ2I9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaTtfLmZuLmV4dGVuZCh7cHJvcDpmdW5jdGlvbihhLGIpe3JldHVybiBxYSh0aGlzLF8ucHJvcCxhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0scmVtb3ZlUHJvcDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7ZGVsZXRlIHRoaXNbXy5wcm9wRml4W2FdfHxhXX0pfX0pLF8uZXh0ZW5kKHtwcm9wRml4OntcImZvclwiOlwiaHRtbEZvclwiLFwiY2xhc3NcIjpcImNsYXNzTmFtZVwifSxwcm9wOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZz1hLm5vZGVUeXBlO2lmKGEmJjMhPT1nJiY4IT09ZyYmMiE9PWcpcmV0dXJuIGY9MSE9PWd8fCFfLmlzWE1MRG9jKGEpLGYmJihiPV8ucHJvcEZpeFtiXXx8YixlPV8ucHJvcEhvb2tzW2JdKSx2b2lkIDAhPT1jP2UmJlwic2V0XCJpbiBlJiZ2b2lkIDAhPT0oZD1lLnNldChhLGMsYikpP2Q6YVtiXT1jOmUmJlwiZ2V0XCJpbiBlJiZudWxsIT09KGQ9ZS5nZXQoYSxiKSk/ZDphW2JdfSxwcm9wSG9va3M6e3RhYkluZGV4OntnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIGEuaGFzQXR0cmlidXRlKFwidGFiaW5kZXhcIil8fGdiLnRlc3QoYS5ub2RlTmFtZSl8fGEuaHJlZj9hLnRhYkluZGV4Oi0xfX19fSksWS5vcHRTZWxlY3RlZHx8KF8ucHJvcEhvb2tzLnNlbGVjdGVkPXtnZXQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5wYXJlbnROb2RlO3JldHVybiBiJiZiLnBhcmVudE5vZGUmJmIucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4LG51bGx9fSksXy5lYWNoKFtcInRhYkluZGV4XCIsXCJyZWFkT25seVwiLFwibWF4TGVuZ3RoXCIsXCJjZWxsU3BhY2luZ1wiLFwiY2VsbFBhZGRpbmdcIixcInJvd1NwYW5cIixcImNvbFNwYW5cIixcInVzZU1hcFwiLFwiZnJhbWVCb3JkZXJcIixcImNvbnRlbnRFZGl0YWJsZVwiXSxmdW5jdGlvbigpe18ucHJvcEZpeFt0aGlzLnRvTG93ZXJDYXNlKCldPXRoaXN9KTt2YXIgaGI9L1tcXHRcXHJcXG5cXGZdL2c7Xy5mbi5leHRlbmQoe2FkZENsYXNzOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoPVwic3RyaW5nXCI9PXR5cGVvZiBhJiZhLGk9MCxqPXRoaXMubGVuZ3RoO2lmKF8uaXNGdW5jdGlvbihhKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGIpe18odGhpcykuYWRkQ2xhc3MoYS5jYWxsKHRoaXMsYix0aGlzLmNsYXNzTmFtZSkpfSk7aWYoaClmb3IoYj0oYXx8XCJcIikubWF0Y2gobmEpfHxbXTtqPmk7aSsrKWlmKGM9dGhpc1tpXSxkPTE9PT1jLm5vZGVUeXBlJiYoYy5jbGFzc05hbWU/KFwiIFwiK2MuY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKGhiLFwiIFwiKTpcIiBcIikpe2ZvcihmPTA7ZT1iW2YrK107KWQuaW5kZXhPZihcIiBcIitlK1wiIFwiKTwwJiYoZCs9ZStcIiBcIik7Zz1fLnRyaW0oZCksYy5jbGFzc05hbWUhPT1nJiYoYy5jbGFzc05hbWU9Zyl9cmV0dXJuIHRoaXN9LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoPTA9PT1hcmd1bWVudHMubGVuZ3RofHxcInN0cmluZ1wiPT10eXBlb2YgYSYmYSxpPTAsaj10aGlzLmxlbmd0aDtpZihfLmlzRnVuY3Rpb24oYSkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihiKXtfKHRoaXMpLnJlbW92ZUNsYXNzKGEuY2FsbCh0aGlzLGIsdGhpcy5jbGFzc05hbWUpKX0pO2lmKGgpZm9yKGI9KGF8fFwiXCIpLm1hdGNoKG5hKXx8W107aj5pO2krKylpZihjPXRoaXNbaV0sZD0xPT09Yy5ub2RlVHlwZSYmKGMuY2xhc3NOYW1lPyhcIiBcIitjLmNsYXNzTmFtZStcIiBcIikucmVwbGFjZShoYixcIiBcIik6XCJcIikpe2ZvcihmPTA7ZT1iW2YrK107KWZvcig7ZC5pbmRleE9mKFwiIFwiK2UrXCIgXCIpPj0wOylkPWQucmVwbGFjZShcIiBcIitlK1wiIFwiLFwiIFwiKTtnPWE/Xy50cmltKGQpOlwiXCIsYy5jbGFzc05hbWUhPT1nJiYoYy5jbGFzc05hbWU9Zyl9cmV0dXJuIHRoaXN9LHRvZ2dsZUNsYXNzOmZ1bmN0aW9uKGEsYil7dmFyIGM9dHlwZW9mIGE7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBiJiZcInN0cmluZ1wiPT09Yz9iP3RoaXMuYWRkQ2xhc3MoYSk6dGhpcy5yZW1vdmVDbGFzcyhhKTp0aGlzLmVhY2goXy5pc0Z1bmN0aW9uKGEpP2Z1bmN0aW9uKGMpe18odGhpcykudG9nZ2xlQ2xhc3MoYS5jYWxsKHRoaXMsYyx0aGlzLmNsYXNzTmFtZSxiKSxiKX06ZnVuY3Rpb24oKXtpZihcInN0cmluZ1wiPT09Yylmb3IodmFyIGIsZD0wLGU9Xyh0aGlzKSxmPWEubWF0Y2gobmEpfHxbXTtiPWZbZCsrXTspZS5oYXNDbGFzcyhiKT9lLnJlbW92ZUNsYXNzKGIpOmUuYWRkQ2xhc3MoYik7ZWxzZShjPT09emF8fFwiYm9vbGVhblwiPT09YykmJih0aGlzLmNsYXNzTmFtZSYmcmEuc2V0KHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIsdGhpcy5jbGFzc05hbWUpLHRoaXMuY2xhc3NOYW1lPXRoaXMuY2xhc3NOYW1lfHxhPT09ITE/XCJcIjpyYS5nZXQodGhpcyxcIl9fY2xhc3NOYW1lX19cIil8fFwiXCIpfSl9LGhhc0NsYXNzOmZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1cIiBcIithK1wiIFwiLGM9MCxkPXRoaXMubGVuZ3RoO2Q+YztjKyspaWYoMT09PXRoaXNbY10ubm9kZVR5cGUmJihcIiBcIit0aGlzW2NdLmNsYXNzTmFtZStcIiBcIikucmVwbGFjZShoYixcIiBcIikuaW5kZXhPZihiKT49MClyZXR1cm4hMDtyZXR1cm4hMX19KTt2YXIgaWI9L1xcci9nO18uZm4uZXh0ZW5kKHt2YWw6ZnVuY3Rpb24oYSl7dmFyIGIsYyxkLGU9dGhpc1swXTt7aWYoYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZD1fLmlzRnVuY3Rpb24oYSksdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe3ZhciBlOzE9PT10aGlzLm5vZGVUeXBlJiYoZT1kP2EuY2FsbCh0aGlzLGMsXyh0aGlzKS52YWwoKSk6YSxudWxsPT1lP2U9XCJcIjpcIm51bWJlclwiPT10eXBlb2YgZT9lKz1cIlwiOl8uaXNBcnJheShlKSYmKGU9Xy5tYXAoZSxmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT9cIlwiOmErXCJcIn0pKSxiPV8udmFsSG9va3NbdGhpcy50eXBlXXx8Xy52YWxIb29rc1t0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLGImJlwic2V0XCJpbiBiJiZ2b2lkIDAhPT1iLnNldCh0aGlzLGUsXCJ2YWx1ZVwiKXx8KHRoaXMudmFsdWU9ZSkpfSk7aWYoZSlyZXR1cm4gYj1fLnZhbEhvb2tzW2UudHlwZV18fF8udmFsSG9va3NbZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXSxiJiZcImdldFwiaW4gYiYmdm9pZCAwIT09KGM9Yi5nZXQoZSxcInZhbHVlXCIpKT9jOihjPWUudmFsdWUsXCJzdHJpbmdcIj09dHlwZW9mIGM/Yy5yZXBsYWNlKGliLFwiXCIpOm51bGw9PWM/XCJcIjpjKX19fSksXy5leHRlbmQoe3ZhbEhvb2tzOntvcHRpb246e2dldDpmdW5jdGlvbihhKXt2YXIgYj1fLmZpbmQuYXR0cihhLFwidmFsdWVcIik7cmV0dXJuIG51bGwhPWI/YjpfLnRyaW0oXy50ZXh0KGEpKX19LHNlbGVjdDp7Z2V0OmZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjLGQ9YS5vcHRpb25zLGU9YS5zZWxlY3RlZEluZGV4LGY9XCJzZWxlY3Qtb25lXCI9PT1hLnR5cGV8fDA+ZSxnPWY/bnVsbDpbXSxoPWY/ZSsxOmQubGVuZ3RoLGk9MD5lP2g6Zj9lOjA7aD5pO2krKylpZihjPWRbaV0sISghYy5zZWxlY3RlZCYmaSE9PWV8fChZLm9wdERpc2FibGVkP2MuZGlzYWJsZWQ6bnVsbCE9PWMuZ2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIikpfHxjLnBhcmVudE5vZGUuZGlzYWJsZWQmJl8ubm9kZU5hbWUoYy5wYXJlbnROb2RlLFwib3B0Z3JvdXBcIikpKXtpZihiPV8oYykudmFsKCksZilyZXR1cm4gYjtnLnB1c2goYil9cmV0dXJuIGd9LHNldDpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYyxkLGU9YS5vcHRpb25zLGY9Xy5tYWtlQXJyYXkoYiksZz1lLmxlbmd0aDtnLS07KWQ9ZVtnXSwoZC5zZWxlY3RlZD1fLmluQXJyYXkoZC52YWx1ZSxmKT49MCkmJihjPSEwKTtyZXR1cm4gY3x8KGEuc2VsZWN0ZWRJbmRleD0tMSksZn19fX0pLF8uZWFjaChbXCJyYWRpb1wiLFwiY2hlY2tib3hcIl0sZnVuY3Rpb24oKXtfLnZhbEhvb2tzW3RoaXNdPXtzZXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gXy5pc0FycmF5KGIpP2EuY2hlY2tlZD1fLmluQXJyYXkoXyhhKS52YWwoKSxiKT49MDp2b2lkIDB9fSxZLmNoZWNrT258fChfLnZhbEhvb2tzW3RoaXNdLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09PWEuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik/XCJvblwiOmEudmFsdWV9KX0pLF8uZWFjaChcImJsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlIGNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSxiKXtfLmZuW2JdPWZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+MD90aGlzLm9uKGIsbnVsbCxhLGMpOnRoaXMudHJpZ2dlcihiKX19KSxfLmZuLmV4dGVuZCh7aG92ZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5tb3VzZWVudGVyKGEpLm1vdXNlbGVhdmUoYnx8YSl9LGJpbmQ6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLm9uKGEsbnVsbCxiLGMpfSx1bmJpbmQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5vZmYoYSxudWxsLGIpfSxkZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gdGhpcy5vbihiLGEsYyxkKX0sdW5kZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIDE9PT1hcmd1bWVudHMubGVuZ3RoP3RoaXMub2ZmKGEsXCIqKlwiKTp0aGlzLm9mZihiLGF8fFwiKipcIixjKX19KTt2YXIgamI9Xy5ub3coKSxrYj0vXFw/LztfLnBhcnNlSlNPTj1mdW5jdGlvbihhKXtyZXR1cm4gSlNPTi5wYXJzZShhK1wiXCIpfSxfLnBhcnNlWE1MPWZ1bmN0aW9uKGEpe3ZhciBiLGM7aWYoIWF8fFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiBudWxsO3RyeXtjPW5ldyBET01QYXJzZXIsYj1jLnBhcnNlRnJvbVN0cmluZyhhLFwidGV4dC94bWxcIil9Y2F0Y2goZCl7Yj12b2lkIDB9cmV0dXJuKCFifHxiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicGFyc2VyZXJyb3JcIikubGVuZ3RoKSYmXy5lcnJvcihcIkludmFsaWQgWE1MOiBcIithKSxifTt2YXIgbGI9LyMuKiQvLG1iPS8oWz8mXSlfPVteJl0qLyxuYj0vXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL2dtLG9iPS9eKD86YWJvdXR8YXBwfGFwcC1zdG9yYWdlfC4rLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLHBiPS9eKD86R0VUfEhFQUQpJC8scWI9L15cXC9cXC8vLHJiPS9eKFtcXHcuKy1dKzopKD86XFwvXFwvKD86W15cXC8/I10qQHwpKFteXFwvPyM6XSopKD86OihcXGQrKXwpfCkvLHNiPXt9LHRiPXt9LHViPVwiKi9cIi5jb25jYXQoXCIqXCIpLHZiPWEubG9jYXRpb24uaHJlZix3Yj1yYi5leGVjKHZiLnRvTG93ZXJDYXNlKCkpfHxbXTtfLmV4dGVuZCh7YWN0aXZlOjAsbGFzdE1vZGlmaWVkOnt9LGV0YWc6e30sYWpheFNldHRpbmdzOnt1cmw6dmIsdHlwZTpcIkdFVFwiLGlzTG9jYWw6b2IudGVzdCh3YlsxXSksZ2xvYmFsOiEwLHByb2Nlc3NEYXRhOiEwLGFzeW5jOiEwLGNvbnRlbnRUeXBlOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCIsYWNjZXB0czp7XCIqXCI6dWIsdGV4dDpcInRleHQvcGxhaW5cIixodG1sOlwidGV4dC9odG1sXCIseG1sOlwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLGpzb246XCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIn0sY29udGVudHM6e3htbDoveG1sLyxodG1sOi9odG1sLyxqc29uOi9qc29uL30scmVzcG9uc2VGaWVsZHM6e3htbDpcInJlc3BvbnNlWE1MXCIsdGV4dDpcInJlc3BvbnNlVGV4dFwiLGpzb246XCJyZXNwb25zZUpTT05cIn0sY29udmVydGVyczp7XCIqIHRleHRcIjpTdHJpbmcsXCJ0ZXh0IGh0bWxcIjohMCxcInRleHQganNvblwiOl8ucGFyc2VKU09OLFwidGV4dCB4bWxcIjpfLnBhcnNlWE1MfSxmbGF0T3B0aW9uczp7dXJsOiEwLGNvbnRleHQ6ITB9fSxhamF4U2V0dXA6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj9MKEwoYSxfLmFqYXhTZXR0aW5ncyksYik6TChfLmFqYXhTZXR0aW5ncyxhKX0sYWpheFByZWZpbHRlcjpKKHNiKSxhamF4VHJhbnNwb3J0OkoodGIpLGFqYXg6ZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGEsYixjLGcpe3ZhciBpLGsscixzLHUsdz1iOzIhPT10JiYodD0yLGgmJmNsZWFyVGltZW91dChoKSxkPXZvaWQgMCxmPWd8fFwiXCIsdi5yZWFkeVN0YXRlPWE+MD80OjAsaT1hPj0yMDAmJjMwMD5hfHwzMDQ9PT1hLGMmJihzPU0obCx2LGMpKSxzPU4obCxzLHYsaSksaT8obC5pZk1vZGlmaWVkJiYodT12LmdldFJlc3BvbnNlSGVhZGVyKFwiTGFzdC1Nb2RpZmllZFwiKSx1JiYoXy5sYXN0TW9kaWZpZWRbZV09dSksdT12LmdldFJlc3BvbnNlSGVhZGVyKFwiZXRhZ1wiKSx1JiYoXy5ldGFnW2VdPXUpKSwyMDQ9PT1hfHxcIkhFQURcIj09PWwudHlwZT93PVwibm9jb250ZW50XCI6MzA0PT09YT93PVwibm90bW9kaWZpZWRcIjoodz1zLnN0YXRlLGs9cy5kYXRhLHI9cy5lcnJvcixpPSFyKSk6KHI9dywoYXx8IXcpJiYodz1cImVycm9yXCIsMD5hJiYoYT0wKSkpLHYuc3RhdHVzPWEsdi5zdGF0dXNUZXh0PShifHx3KStcIlwiLGk/by5yZXNvbHZlV2l0aChtLFtrLHcsdl0pOm8ucmVqZWN0V2l0aChtLFt2LHcscl0pLHYuc3RhdHVzQ29kZShxKSxxPXZvaWQgMCxqJiZuLnRyaWdnZXIoaT9cImFqYXhTdWNjZXNzXCI6XCJhamF4RXJyb3JcIixbdixsLGk/azpyXSkscC5maXJlV2l0aChtLFt2LHddKSxqJiYobi50cmlnZ2VyKFwiYWpheENvbXBsZXRlXCIsW3YsbF0pLC0tXy5hY3RpdmV8fF8uZXZlbnQudHJpZ2dlcihcImFqYXhTdG9wXCIpKSl9XCJvYmplY3RcIj09dHlwZW9mIGEmJihiPWEsYT12b2lkIDApLGI9Ynx8e307dmFyIGQsZSxmLGcsaCxpLGosayxsPV8uYWpheFNldHVwKHt9LGIpLG09bC5jb250ZXh0fHxsLG49bC5jb250ZXh0JiYobS5ub2RlVHlwZXx8bS5qcXVlcnkpP18obSk6Xy5ldmVudCxvPV8uRGVmZXJyZWQoKSxwPV8uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIikscT1sLnN0YXR1c0NvZGV8fHt9LHI9e30scz17fSx0PTAsdT1cImNhbmNlbGVkXCIsdj17cmVhZHlTdGF0ZTowLGdldFJlc3BvbnNlSGVhZGVyOmZ1bmN0aW9uKGEpe3ZhciBiO2lmKDI9PT10KXtpZighZylmb3IoZz17fTtiPW5iLmV4ZWMoZik7KWdbYlsxXS50b0xvd2VyQ2FzZSgpXT1iWzJdO2I9Z1thLnRvTG93ZXJDYXNlKCldfXJldHVybiBudWxsPT1iP251bGw6Yn0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIDI9PT10P2Y6bnVsbH0sc2V0UmVxdWVzdEhlYWRlcjpmdW5jdGlvbihhLGIpe3ZhciBjPWEudG9Mb3dlckNhc2UoKTtyZXR1cm4gdHx8KGE9c1tjXT1zW2NdfHxhLHJbYV09YiksdGhpc30sb3ZlcnJpZGVNaW1lVHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gdHx8KGwubWltZVR5cGU9YSksdGhpc30sc3RhdHVzQ29kZTpmdW5jdGlvbihhKXt2YXIgYjtpZihhKWlmKDI+dClmb3IoYiBpbiBhKXFbYl09W3FbYl0sYVtiXV07ZWxzZSB2LmFsd2F5cyhhW3Yuc3RhdHVzXSk7cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGEpe3ZhciBiPWF8fHU7cmV0dXJuIGQmJmQuYWJvcnQoYiksYygwLGIpLHRoaXN9fTtpZihvLnByb21pc2UodikuY29tcGxldGU9cC5hZGQsdi5zdWNjZXNzPXYuZG9uZSx2LmVycm9yPXYuZmFpbCxsLnVybD0oKGF8fGwudXJsfHx2YikrXCJcIikucmVwbGFjZShsYixcIlwiKS5yZXBsYWNlKHFiLHdiWzFdK1wiLy9cIiksbC50eXBlPWIubWV0aG9kfHxiLnR5cGV8fGwubWV0aG9kfHxsLnR5cGUsbC5kYXRhVHlwZXM9Xy50cmltKGwuZGF0YVR5cGV8fFwiKlwiKS50b0xvd2VyQ2FzZSgpLm1hdGNoKG5hKXx8W1wiXCJdLG51bGw9PWwuY3Jvc3NEb21haW4mJihpPXJiLmV4ZWMobC51cmwudG9Mb3dlckNhc2UoKSksbC5jcm9zc0RvbWFpbj0hKCFpfHxpWzFdPT09d2JbMV0mJmlbMl09PT13YlsyXSYmKGlbM118fChcImh0dHA6XCI9PT1pWzFdP1wiODBcIjpcIjQ0M1wiKSk9PT0od2JbM118fChcImh0dHA6XCI9PT13YlsxXT9cIjgwXCI6XCI0NDNcIikpKSksbC5kYXRhJiZsLnByb2Nlc3NEYXRhJiZcInN0cmluZ1wiIT10eXBlb2YgbC5kYXRhJiYobC5kYXRhPV8ucGFyYW0obC5kYXRhLGwudHJhZGl0aW9uYWwpKSxLKHNiLGwsYix2KSwyPT09dClyZXR1cm4gdjtqPV8uZXZlbnQmJmwuZ2xvYmFsLGomJjA9PT1fLmFjdGl2ZSsrJiZfLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RhcnRcIiksbC50eXBlPWwudHlwZS50b1VwcGVyQ2FzZSgpLGwuaGFzQ29udGVudD0hcGIudGVzdChsLnR5cGUpLGU9bC51cmwsbC5oYXNDb250ZW50fHwobC5kYXRhJiYoZT1sLnVybCs9KGtiLnRlc3QoZSk/XCImXCI6XCI/XCIpK2wuZGF0YSxkZWxldGUgbC5kYXRhKSxsLmNhY2hlPT09ITEmJihsLnVybD1tYi50ZXN0KGUpP2UucmVwbGFjZShtYixcIiQxXz1cIitqYisrKTplKyhrYi50ZXN0KGUpP1wiJlwiOlwiP1wiKStcIl89XCIramIrKykpLGwuaWZNb2RpZmllZCYmKF8ubGFzdE1vZGlmaWVkW2VdJiZ2LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Nb2RpZmllZC1TaW5jZVwiLF8ubGFzdE1vZGlmaWVkW2VdKSxfLmV0YWdbZV0mJnYuc2V0UmVxdWVzdEhlYWRlcihcIklmLU5vbmUtTWF0Y2hcIixfLmV0YWdbZV0pKSwobC5kYXRhJiZsLmhhc0NvbnRlbnQmJmwuY29udGVudFR5cGUhPT0hMXx8Yi5jb250ZW50VHlwZSkmJnYuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLGwuY29udGVudFR5cGUpLHYuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLGwuZGF0YVR5cGVzWzBdJiZsLmFjY2VwdHNbbC5kYXRhVHlwZXNbMF1dP2wuYWNjZXB0c1tsLmRhdGFUeXBlc1swXV0rKFwiKlwiIT09bC5kYXRhVHlwZXNbMF0/XCIsIFwiK3ViK1wiOyBxPTAuMDFcIjpcIlwiKTpsLmFjY2VwdHNbXCIqXCJdKTtmb3IoayBpbiBsLmhlYWRlcnMpdi5zZXRSZXF1ZXN0SGVhZGVyKGssbC5oZWFkZXJzW2tdKTtpZihsLmJlZm9yZVNlbmQmJihsLmJlZm9yZVNlbmQuY2FsbChtLHYsbCk9PT0hMXx8Mj09PXQpKXJldHVybiB2LmFib3J0KCk7dT1cImFib3J0XCI7Zm9yKGsgaW57c3VjY2VzczoxLGVycm9yOjEsY29tcGxldGU6MX0pdltrXShsW2tdKTtpZihkPUsodGIsbCxiLHYpKXt2LnJlYWR5U3RhdGU9MSxqJiZuLnRyaWdnZXIoXCJhamF4U2VuZFwiLFt2LGxdKSxsLmFzeW5jJiZsLnRpbWVvdXQ+MCYmKGg9c2V0VGltZW91dChmdW5jdGlvbigpe3YuYWJvcnQoXCJ0aW1lb3V0XCIpfSxsLnRpbWVvdXQpKTt0cnl7dD0xLGQuc2VuZChyLGMpfWNhdGNoKHcpe2lmKCEoMj50KSl0aHJvdyB3O2MoLTEsdyl9fWVsc2UgYygtMSxcIk5vIFRyYW5zcG9ydFwiKTtyZXR1cm4gdn0sZ2V0SlNPTjpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIF8uZ2V0KGEsYixjLFwianNvblwiKX0sZ2V0U2NyaXB0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIF8uZ2V0KGEsdm9pZCAwLGIsXCJzY3JpcHRcIil9fSksXy5lYWNoKFtcImdldFwiLFwicG9zdFwiXSxmdW5jdGlvbihhLGIpe19bYl09ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIF8uaXNGdW5jdGlvbihjKSYmKGU9ZXx8ZCxkPWMsYz12b2lkIDApLF8uYWpheCh7dXJsOmEsdHlwZTpiLGRhdGFUeXBlOmUsZGF0YTpjLHN1Y2Nlc3M6ZH0pfX0pLF8uX2V2YWxVcmw9ZnVuY3Rpb24oYSl7cmV0dXJuIF8uYWpheCh7dXJsOmEsdHlwZTpcIkdFVFwiLGRhdGFUeXBlOlwic2NyaXB0XCIsYXN5bmM6ITEsZ2xvYmFsOiExLFwidGhyb3dzXCI6ITB9KX0sXy5mbi5leHRlbmQoe3dyYXBBbGw6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIF8uaXNGdW5jdGlvbihhKT90aGlzLmVhY2goZnVuY3Rpb24oYil7Xyh0aGlzKS53cmFwQWxsKGEuY2FsbCh0aGlzLGIpKX0pOih0aGlzWzBdJiYoYj1fKGEsdGhpc1swXS5vd25lckRvY3VtZW50KS5lcSgwKS5jbG9uZSghMCksdGhpc1swXS5wYXJlbnROb2RlJiZiLmluc2VydEJlZm9yZSh0aGlzWzBdKSxiLm1hcChmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzO2EuZmlyc3RFbGVtZW50Q2hpbGQ7KWE9YS5maXJzdEVsZW1lbnRDaGlsZDtyZXR1cm4gYX0pLmFwcGVuZCh0aGlzKSksdGhpcyl9LHdyYXBJbm5lcjpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKF8uaXNGdW5jdGlvbihhKT9mdW5jdGlvbihiKXtfKHRoaXMpLndyYXBJbm5lcihhLmNhbGwodGhpcyxiKSl9OmZ1bmN0aW9uKCl7dmFyIGI9Xyh0aGlzKSxjPWIuY29udGVudHMoKTtjLmxlbmd0aD9jLndyYXBBbGwoYSk6Yi5hcHBlbmQoYSl9KX0sd3JhcDpmdW5jdGlvbihhKXt2YXIgYj1fLmlzRnVuY3Rpb24oYSk7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihjKXtfKHRoaXMpLndyYXBBbGwoYj9hLmNhbGwodGhpcyxjKTphKX0pfSx1bndyYXA6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQoKS5lYWNoKGZ1bmN0aW9uKCl7Xy5ub2RlTmFtZSh0aGlzLFwiYm9keVwiKXx8Xyh0aGlzKS5yZXBsYWNlV2l0aCh0aGlzLmNoaWxkTm9kZXMpfSkuZW5kKCl9fSksXy5leHByLmZpbHRlcnMuaGlkZGVuPWZ1bmN0aW9uKGEpe3JldHVybiBhLm9mZnNldFdpZHRoPD0wJiZhLm9mZnNldEhlaWdodDw9MH0sXy5leHByLmZpbHRlcnMudmlzaWJsZT1mdW5jdGlvbihhKXtyZXR1cm4hXy5leHByLmZpbHRlcnMuaGlkZGVuKGEpfTt2YXIgeGI9LyUyMC9nLHliPS9cXFtcXF0kLyx6Yj0vXFxyP1xcbi9nLEFiPS9eKD86c3VibWl0fGJ1dHRvbnxpbWFnZXxyZXNldHxmaWxlKSQvaSxCYj0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxrZXlnZW4pL2k7Xy5wYXJhbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9W10sZT1mdW5jdGlvbihhLGIpe2I9Xy5pc0Z1bmN0aW9uKGIpP2IoKTpudWxsPT1iP1wiXCI6YixkW2QubGVuZ3RoXT1lbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGIpO1xuXG59O2lmKHZvaWQgMD09PWImJihiPV8uYWpheFNldHRpbmdzJiZfLmFqYXhTZXR0aW5ncy50cmFkaXRpb25hbCksXy5pc0FycmF5KGEpfHxhLmpxdWVyeSYmIV8uaXNQbGFpbk9iamVjdChhKSlfLmVhY2goYSxmdW5jdGlvbigpe2UodGhpcy5uYW1lLHRoaXMudmFsdWUpfSk7ZWxzZSBmb3IoYyBpbiBhKU8oYyxhW2NdLGIsZSk7cmV0dXJuIGQuam9pbihcIiZcIikucmVwbGFjZSh4YixcIitcIil9LF8uZm4uZXh0ZW5kKHtzZXJpYWxpemU6ZnVuY3Rpb24oKXtyZXR1cm4gXy5wYXJhbSh0aGlzLnNlcmlhbGl6ZUFycmF5KCkpfSxzZXJpYWxpemVBcnJheTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe3ZhciBhPV8ucHJvcCh0aGlzLFwiZWxlbWVudHNcIik7cmV0dXJuIGE/Xy5tYWtlQXJyYXkoYSk6dGhpc30pLmZpbHRlcihmdW5jdGlvbigpe3ZhciBhPXRoaXMudHlwZTtyZXR1cm4gdGhpcy5uYW1lJiYhXyh0aGlzKS5pcyhcIjpkaXNhYmxlZFwiKSYmQmIudGVzdCh0aGlzLm5vZGVOYW1lKSYmIUFiLnRlc3QoYSkmJih0aGlzLmNoZWNrZWR8fCF5YS50ZXN0KGEpKX0pLm1hcChmdW5jdGlvbihhLGIpe3ZhciBjPV8odGhpcykudmFsKCk7cmV0dXJuIG51bGw9PWM/bnVsbDpfLmlzQXJyYXkoYyk/Xy5tYXAoYyxmdW5jdGlvbihhKXtyZXR1cm57bmFtZTpiLm5hbWUsdmFsdWU6YS5yZXBsYWNlKHpiLFwiXFxyXFxuXCIpfX0pOntuYW1lOmIubmFtZSx2YWx1ZTpjLnJlcGxhY2UoemIsXCJcXHJcXG5cIil9fSkuZ2V0KCl9fSksXy5hamF4U2V0dGluZ3MueGhyPWZ1bmN0aW9uKCl7dHJ5e3JldHVybiBuZXcgWE1MSHR0cFJlcXVlc3R9Y2F0Y2goYSl7fX07dmFyIENiPTAsRGI9e30sRWI9ezA6MjAwLDEyMjM6MjA0fSxGYj1fLmFqYXhTZXR0aW5ncy54aHIoKTthLmF0dGFjaEV2ZW50JiZhLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIixmdW5jdGlvbigpe2Zvcih2YXIgYSBpbiBEYilEYlthXSgpfSksWS5jb3JzPSEhRmImJlwid2l0aENyZWRlbnRpYWxzXCJpbiBGYixZLmFqYXg9RmI9ISFGYixfLmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIFkuY29yc3x8RmImJiFhLmNyb3NzRG9tYWluP3tzZW5kOmZ1bmN0aW9uKGMsZCl7dmFyIGUsZj1hLnhocigpLGc9KytDYjtpZihmLm9wZW4oYS50eXBlLGEudXJsLGEuYXN5bmMsYS51c2VybmFtZSxhLnBhc3N3b3JkKSxhLnhockZpZWxkcylmb3IoZSBpbiBhLnhockZpZWxkcylmW2VdPWEueGhyRmllbGRzW2VdO2EubWltZVR5cGUmJmYub3ZlcnJpZGVNaW1lVHlwZSYmZi5vdmVycmlkZU1pbWVUeXBlKGEubWltZVR5cGUpLGEuY3Jvc3NEb21haW58fGNbXCJYLVJlcXVlc3RlZC1XaXRoXCJdfHwoY1tcIlgtUmVxdWVzdGVkLVdpdGhcIl09XCJYTUxIdHRwUmVxdWVzdFwiKTtmb3IoZSBpbiBjKWYuc2V0UmVxdWVzdEhlYWRlcihlLGNbZV0pO2I9ZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKCl7YiYmKGRlbGV0ZSBEYltnXSxiPWYub25sb2FkPWYub25lcnJvcj1udWxsLFwiYWJvcnRcIj09PWE/Zi5hYm9ydCgpOlwiZXJyb3JcIj09PWE/ZChmLnN0YXR1cyxmLnN0YXR1c1RleHQpOmQoRWJbZi5zdGF0dXNdfHxmLnN0YXR1cyxmLnN0YXR1c1RleHQsXCJzdHJpbmdcIj09dHlwZW9mIGYucmVzcG9uc2VUZXh0P3t0ZXh0OmYucmVzcG9uc2VUZXh0fTp2b2lkIDAsZi5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpfX0sZi5vbmxvYWQ9YigpLGYub25lcnJvcj1iKFwiZXJyb3JcIiksYj1EYltnXT1iKFwiYWJvcnRcIik7dHJ5e2Yuc2VuZChhLmhhc0NvbnRlbnQmJmEuZGF0YXx8bnVsbCl9Y2F0Y2goaCl7aWYoYil0aHJvdyBofX0sYWJvcnQ6ZnVuY3Rpb24oKXtiJiZiKCl9fTp2b2lkIDB9KSxfLmFqYXhTZXR1cCh7YWNjZXB0czp7c2NyaXB0OlwidGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHRcIn0sY29udGVudHM6e3NjcmlwdDovKD86amF2YXxlY21hKXNjcmlwdC99LGNvbnZlcnRlcnM6e1widGV4dCBzY3JpcHRcIjpmdW5jdGlvbihhKXtyZXR1cm4gXy5nbG9iYWxFdmFsKGEpLGF9fX0pLF8uYWpheFByZWZpbHRlcihcInNjcmlwdFwiLGZ1bmN0aW9uKGEpe3ZvaWQgMD09PWEuY2FjaGUmJihhLmNhY2hlPSExKSxhLmNyb3NzRG9tYWluJiYoYS50eXBlPVwiR0VUXCIpfSksXy5hamF4VHJhbnNwb3J0KFwic2NyaXB0XCIsZnVuY3Rpb24oYSl7aWYoYS5jcm9zc0RvbWFpbil7dmFyIGIsYztyZXR1cm57c2VuZDpmdW5jdGlvbihkLGUpe2I9XyhcIjxzY3JpcHQ+XCIpLnByb3Aoe2FzeW5jOiEwLGNoYXJzZXQ6YS5zY3JpcHRDaGFyc2V0LHNyYzphLnVybH0pLm9uKFwibG9hZCBlcnJvclwiLGM9ZnVuY3Rpb24oYSl7Yi5yZW1vdmUoKSxjPW51bGwsYSYmZShcImVycm9yXCI9PT1hLnR5cGU/NDA0OjIwMCxhLnR5cGUpfSksWi5oZWFkLmFwcGVuZENoaWxkKGJbMF0pfSxhYm9ydDpmdW5jdGlvbigpe2MmJmMoKX19fX0pO3ZhciBHYj1bXSxIYj0vKD0pXFw/KD89JnwkKXxcXD9cXD8vO18uYWpheFNldHVwKHtqc29ucDpcImNhbGxiYWNrXCIsanNvbnBDYWxsYmFjazpmdW5jdGlvbigpe3ZhciBhPUdiLnBvcCgpfHxfLmV4cGFuZG8rXCJfXCIramIrKztyZXR1cm4gdGhpc1thXT0hMCxhfX0pLF8uYWpheFByZWZpbHRlcihcImpzb24ganNvbnBcIixmdW5jdGlvbihiLGMsZCl7dmFyIGUsZixnLGg9Yi5qc29ucCE9PSExJiYoSGIudGVzdChiLnVybCk/XCJ1cmxcIjpcInN0cmluZ1wiPT10eXBlb2YgYi5kYXRhJiYhKGIuY29udGVudFR5cGV8fFwiXCIpLmluZGV4T2YoXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIikmJkhiLnRlc3QoYi5kYXRhKSYmXCJkYXRhXCIpO3JldHVybiBofHxcImpzb25wXCI9PT1iLmRhdGFUeXBlc1swXT8oZT1iLmpzb25wQ2FsbGJhY2s9Xy5pc0Z1bmN0aW9uKGIuanNvbnBDYWxsYmFjayk/Yi5qc29ucENhbGxiYWNrKCk6Yi5qc29ucENhbGxiYWNrLGg/YltoXT1iW2hdLnJlcGxhY2UoSGIsXCIkMVwiK2UpOmIuanNvbnAhPT0hMSYmKGIudXJsKz0oa2IudGVzdChiLnVybCk/XCImXCI6XCI/XCIpK2IuanNvbnArXCI9XCIrZSksYi5jb252ZXJ0ZXJzW1wic2NyaXB0IGpzb25cIl09ZnVuY3Rpb24oKXtyZXR1cm4gZ3x8Xy5lcnJvcihlK1wiIHdhcyBub3QgY2FsbGVkXCIpLGdbMF19LGIuZGF0YVR5cGVzWzBdPVwianNvblwiLGY9YVtlXSxhW2VdPWZ1bmN0aW9uKCl7Zz1hcmd1bWVudHN9LGQuYWx3YXlzKGZ1bmN0aW9uKCl7YVtlXT1mLGJbZV0mJihiLmpzb25wQ2FsbGJhY2s9Yy5qc29ucENhbGxiYWNrLEdiLnB1c2goZSkpLGcmJl8uaXNGdW5jdGlvbihmKSYmZihnWzBdKSxnPWY9dm9pZCAwfSksXCJzY3JpcHRcIik6dm9pZCAwfSksXy5wYXJzZUhUTUw9ZnVuY3Rpb24oYSxiLGMpe2lmKCFhfHxcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm4gbnVsbDtcImJvb2xlYW5cIj09dHlwZW9mIGImJihjPWIsYj0hMSksYj1ifHxaO3ZhciBkPWdhLmV4ZWMoYSksZT0hYyYmW107cmV0dXJuIGQ/W2IuY3JlYXRlRWxlbWVudChkWzFdKV06KGQ9Xy5idWlsZEZyYWdtZW50KFthXSxiLGUpLGUmJmUubGVuZ3RoJiZfKGUpLnJlbW92ZSgpLF8ubWVyZ2UoW10sZC5jaGlsZE5vZGVzKSl9O3ZhciBJYj1fLmZuLmxvYWQ7Xy5mbi5sb2FkPWZ1bmN0aW9uKGEsYixjKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYSYmSWIpcmV0dXJuIEliLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgZCxlLGYsZz10aGlzLGg9YS5pbmRleE9mKFwiIFwiKTtyZXR1cm4gaD49MCYmKGQ9Xy50cmltKGEuc2xpY2UoaCkpLGE9YS5zbGljZSgwLGgpKSxfLmlzRnVuY3Rpb24oYik/KGM9YixiPXZvaWQgMCk6YiYmXCJvYmplY3RcIj09dHlwZW9mIGImJihlPVwiUE9TVFwiKSxnLmxlbmd0aD4wJiZfLmFqYXgoe3VybDphLHR5cGU6ZSxkYXRhVHlwZTpcImh0bWxcIixkYXRhOmJ9KS5kb25lKGZ1bmN0aW9uKGEpe2Y9YXJndW1lbnRzLGcuaHRtbChkP18oXCI8ZGl2PlwiKS5hcHBlbmQoXy5wYXJzZUhUTUwoYSkpLmZpbmQoZCk6YSl9KS5jb21wbGV0ZShjJiZmdW5jdGlvbihhLGIpe2cuZWFjaChjLGZ8fFthLnJlc3BvbnNlVGV4dCxiLGFdKX0pLHRoaXN9LF8uZWFjaChbXCJhamF4U3RhcnRcIixcImFqYXhTdG9wXCIsXCJhamF4Q29tcGxldGVcIixcImFqYXhFcnJvclwiLFwiYWpheFN1Y2Nlc3NcIixcImFqYXhTZW5kXCJdLGZ1bmN0aW9uKGEsYil7Xy5mbltiXT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vbihiLGEpfX0pLF8uZXhwci5maWx0ZXJzLmFuaW1hdGVkPWZ1bmN0aW9uKGEpe3JldHVybiBfLmdyZXAoXy50aW1lcnMsZnVuY3Rpb24oYil7cmV0dXJuIGE9PT1iLmVsZW19KS5sZW5ndGh9O3ZhciBKYj1hLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtfLm9mZnNldD17c2V0T2Zmc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoLGksaixrPV8uY3NzKGEsXCJwb3NpdGlvblwiKSxsPV8oYSksbT17fTtcInN0YXRpY1wiPT09ayYmKGEuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwiKSxoPWwub2Zmc2V0KCksZj1fLmNzcyhhLFwidG9wXCIpLGk9Xy5jc3MoYSxcImxlZnRcIiksaj0oXCJhYnNvbHV0ZVwiPT09a3x8XCJmaXhlZFwiPT09aykmJihmK2kpLmluZGV4T2YoXCJhdXRvXCIpPi0xLGo/KGQ9bC5wb3NpdGlvbigpLGc9ZC50b3AsZT1kLmxlZnQpOihnPXBhcnNlRmxvYXQoZil8fDAsZT1wYXJzZUZsb2F0KGkpfHwwKSxfLmlzRnVuY3Rpb24oYikmJihiPWIuY2FsbChhLGMsaCkpLG51bGwhPWIudG9wJiYobS50b3A9Yi50b3AtaC50b3ArZyksbnVsbCE9Yi5sZWZ0JiYobS5sZWZ0PWIubGVmdC1oLmxlZnQrZSksXCJ1c2luZ1wiaW4gYj9iLnVzaW5nLmNhbGwoYSxtKTpsLmNzcyhtKX19LF8uZm4uZXh0ZW5kKHtvZmZzZXQ6ZnVuY3Rpb24oYSl7aWYoYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdm9pZCAwPT09YT90aGlzOnRoaXMuZWFjaChmdW5jdGlvbihiKXtfLm9mZnNldC5zZXRPZmZzZXQodGhpcyxhLGIpfSk7dmFyIGIsYyxkPXRoaXNbMF0sZT17dG9wOjAsbGVmdDowfSxmPWQmJmQub3duZXJEb2N1bWVudDtpZihmKXJldHVybiBiPWYuZG9jdW1lbnRFbGVtZW50LF8uY29udGFpbnMoYixkKT8odHlwZW9mIGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IT09emEmJihlPWQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpLGM9UChmKSx7dG9wOmUudG9wK2MucGFnZVlPZmZzZXQtYi5jbGllbnRUb3AsbGVmdDplLmxlZnQrYy5wYWdlWE9mZnNldC1iLmNsaWVudExlZnR9KTplfSxwb3NpdGlvbjpmdW5jdGlvbigpe2lmKHRoaXNbMF0pe3ZhciBhLGIsYz10aGlzWzBdLGQ9e3RvcDowLGxlZnQ6MH07cmV0dXJuXCJmaXhlZFwiPT09Xy5jc3MoYyxcInBvc2l0aW9uXCIpP2I9Yy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTooYT10aGlzLm9mZnNldFBhcmVudCgpLGI9dGhpcy5vZmZzZXQoKSxfLm5vZGVOYW1lKGFbMF0sXCJodG1sXCIpfHwoZD1hLm9mZnNldCgpKSxkLnRvcCs9Xy5jc3MoYVswXSxcImJvcmRlclRvcFdpZHRoXCIsITApLGQubGVmdCs9Xy5jc3MoYVswXSxcImJvcmRlckxlZnRXaWR0aFwiLCEwKSkse3RvcDpiLnRvcC1kLnRvcC1fLmNzcyhjLFwibWFyZ2luVG9wXCIsITApLGxlZnQ6Yi5sZWZ0LWQubGVmdC1fLmNzcyhjLFwibWFyZ2luTGVmdFwiLCEwKX19fSxvZmZzZXRQYXJlbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5vZmZzZXRQYXJlbnR8fEpiO2EmJiFfLm5vZGVOYW1lKGEsXCJodG1sXCIpJiZcInN0YXRpY1wiPT09Xy5jc3MoYSxcInBvc2l0aW9uXCIpOylhPWEub2Zmc2V0UGFyZW50O3JldHVybiBhfHxKYn0pfX0pLF8uZWFjaCh7c2Nyb2xsTGVmdDpcInBhZ2VYT2Zmc2V0XCIsc2Nyb2xsVG9wOlwicGFnZVlPZmZzZXRcIn0sZnVuY3Rpb24oYixjKXt2YXIgZD1cInBhZ2VZT2Zmc2V0XCI9PT1jO18uZm5bYl09ZnVuY3Rpb24oZSl7cmV0dXJuIHFhKHRoaXMsZnVuY3Rpb24oYixlLGYpe3ZhciBnPVAoYik7cmV0dXJuIHZvaWQgMD09PWY/Zz9nW2NdOmJbZV06dm9pZChnP2cuc2Nyb2xsVG8oZD9hLnBhZ2VYT2Zmc2V0OmYsZD9mOmEucGFnZVlPZmZzZXQpOmJbZV09Zil9LGIsZSxhcmd1bWVudHMubGVuZ3RoLG51bGwpfX0pLF8uZWFjaChbXCJ0b3BcIixcImxlZnRcIl0sZnVuY3Rpb24oYSxiKXtfLmNzc0hvb2tzW2JdPXcoWS5waXhlbFBvc2l0aW9uLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGM/KGM9dihhLGIpLFFhLnRlc3QoYyk/XyhhKS5wb3NpdGlvbigpW2JdK1wicHhcIjpjKTp2b2lkIDB9KX0pLF8uZWFjaCh7SGVpZ2h0OlwiaGVpZ2h0XCIsV2lkdGg6XCJ3aWR0aFwifSxmdW5jdGlvbihhLGIpe18uZWFjaCh7cGFkZGluZzpcImlubmVyXCIrYSxjb250ZW50OmIsXCJcIjpcIm91dGVyXCIrYX0sZnVuY3Rpb24oYyxkKXtfLmZuW2RdPWZ1bmN0aW9uKGQsZSl7dmFyIGY9YXJndW1lbnRzLmxlbmd0aCYmKGN8fFwiYm9vbGVhblwiIT10eXBlb2YgZCksZz1jfHwoZD09PSEwfHxlPT09ITA/XCJtYXJnaW5cIjpcImJvcmRlclwiKTtyZXR1cm4gcWEodGhpcyxmdW5jdGlvbihiLGMsZCl7dmFyIGU7cmV0dXJuIF8uaXNXaW5kb3coYik/Yi5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbXCJjbGllbnRcIithXTo5PT09Yi5ub2RlVHlwZT8oZT1iLmRvY3VtZW50RWxlbWVudCxNYXRoLm1heChiLmJvZHlbXCJzY3JvbGxcIithXSxlW1wic2Nyb2xsXCIrYV0sYi5ib2R5W1wib2Zmc2V0XCIrYV0sZVtcIm9mZnNldFwiK2FdLGVbXCJjbGllbnRcIithXSkpOnZvaWQgMD09PWQ/Xy5jc3MoYixjLGcpOl8uc3R5bGUoYixjLGQsZyl9LGIsZj9kOnZvaWQgMCxmLG51bGwpfX0pfSksXy5mbi5zaXplPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGVuZ3RofSxfLmZuLmFuZFNlbGY9Xy5mbi5hZGRCYWNrLFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZCYmZGVmaW5lKFwianF1ZXJ5XCIsW10sZnVuY3Rpb24oKXtyZXR1cm4gX30pO3ZhciBLYj1hLmpRdWVyeSxMYj1hLiQ7cmV0dXJuIF8ubm9Db25mbGljdD1mdW5jdGlvbihiKXtyZXR1cm4gYS4kPT09XyYmKGEuJD1MYiksYiYmYS5qUXVlcnk9PT1fJiYoYS5qUXVlcnk9S2IpLF99LHR5cGVvZiBiPT09emEmJihhLmpRdWVyeT1hLiQ9XyksX30pOyIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjMnO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgdmFyIHByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBIZWxwZXIgZm9yIGNvbGxlY3Rpb24gbWV0aG9kcyB0byBkZXRlcm1pbmUgd2hldGhlciBhIGNvbGxlY3Rpb25cbiAgLy8gc2hvdWxkIGJlIGl0ZXJhdGVkIGFzIGFuIGFycmF5IG9yIGFzIGFuIG9iamVjdFxuICAvLyBSZWxhdGVkOiBodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aFxuICAvLyBBdm9pZHMgYSB2ZXJ5IG5hc3R5IGlPUyA4IEpJVCBidWcgb24gQVJNLTY0LiAjMjA5NFxuICB2YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcbiAgdmFyIGdldExlbmd0aCA9IHByb3BlcnR5KCdsZW5ndGgnKTtcbiAgdmFyIGlzQXJyYXlMaWtlID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gaXRlbSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIGl0ZW0sIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggIT0gJ251bWJlcicgfHwgZ3VhcmQpIGZyb21JbmRleCA9IDA7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIGl0ZW0sIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGlucHV0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKF8uaXNBcnJheSh2YWx1ZSkgfHwgXy5pc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgICAgIC8vZmxhdHRlbiBjdXJyZW50IGxldmVsIG9mIGFycmF5IG9yIGFyZ3VtZW50cyBvYmplY3RcbiAgICAgICAgaWYgKCFzaGFsbG93KSB2YWx1ZSA9IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIHN0cmljdCk7XG4gICAgICAgIHZhciBqID0gMCwgbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICBvdXRwdXQubGVuZ3RoICs9IGxlbjtcbiAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWVbaisrXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghc3RyaWN0KSB7XG4gICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIGZhbHNlKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChhcnJheSk7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFyZ3NMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksIGdldExlbmd0aCkubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGdldExlbmd0aChsaXN0KTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBnZXRMZW5ndGgoYXJyYXkpO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVQcmVkaWNhdGVJbmRleEZpbmRlcigxKTtcbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlUHJlZGljYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IE1hdGguZmxvb3IoKGxvdyArIGhpZ2gpIC8gMik7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIEdlbmVyYXRvciBmdW5jdGlvbiB0byBjcmVhdGUgdGhlIGluZGV4T2YgYW5kIGxhc3RJbmRleE9mIGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIsIHByZWRpY2F0ZUZpbmQsIHNvcnRlZEluZGV4KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpZHgpIHtcbiAgICAgIHZhciBpID0gMCwgbGVuZ3RoID0gZ2V0TGVuZ3RoKGFycmF5KTtcbiAgICAgIGlmICh0eXBlb2YgaWR4ID09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICBpID0gaWR4ID49IDAgPyBpZHggOiBNYXRoLm1heChpZHggKyBsZW5ndGgsIGkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVuZ3RoID0gaWR4ID49IDAgPyBNYXRoLm1pbihpZHggKyAxLCBsZW5ndGgpIDogaWR4ICsgbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChzb3J0ZWRJbmRleCAmJiBpZHggJiYgbGVuZ3RoKSB7XG4gICAgICAgIGlkeCA9IHNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2lkeF0gPT09IGl0ZW0gPyBpZHggOiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICAgIGlkeCA9IHByZWRpY2F0ZUZpbmQoc2xpY2UuY2FsbChhcnJheSwgaSwgbGVuZ3RoKSwgXy5pc05hTik7XG4gICAgICAgIHJldHVybiBpZHggPj0gMCA/IGlkeCArIGkgOiAtMTtcbiAgICAgIH1cbiAgICAgIGZvciAoaWR4ID0gZGlyID4gMCA/IGkgOiBsZW5ndGggLSAxOyBpZHggPj0gMCAmJiBpZHggPCBsZW5ndGg7IGlkeCArPSBkaXIpIHtcbiAgICAgICAgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKDEsIF8uZmluZEluZGV4LCBfLnNvcnRlZEluZGV4KTtcbiAgXy5sYXN0SW5kZXhPZiA9IGNyZWF0ZUluZGV4RmluZGVyKC0xLCBfLmZpbmRMYXN0SW5kZXgpO1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKHN0b3AgPT0gbnVsbCkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRGV0ZXJtaW5lcyB3aGV0aGVyIHRvIGV4ZWN1dGUgYSBmdW5jdGlvbiBhcyBhIGNvbnN0cnVjdG9yXG4gIC8vIG9yIGEgbm9ybWFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuICB2YXIgZXhlY3V0ZUJvdW5kID0gZnVuY3Rpb24oc291cmNlRnVuYywgYm91bmRGdW5jLCBjb250ZXh0LCBjYWxsaW5nQ29udGV4dCwgYXJncykge1xuICAgIGlmICghKGNhbGxpbmdDb250ZXh0IGluc3RhbmNlb2YgYm91bmRGdW5jKSkgcmV0dXJuIHNvdXJjZUZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgdmFyIHNlbGYgPSBiYXNlQ3JlYXRlKHNvdXJjZUZ1bmMucHJvdG90eXBlKTtcbiAgICB2YXIgcmVzdWx0ID0gc291cmNlRnVuYy5hcHBseShzZWxmLCBhcmdzKTtcbiAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQmluZCBtdXN0IGJlIGNhbGxlZCBvbiBhIGZ1bmN0aW9uJyk7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCBjb250ZXh0LCB0aGlzLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDAsIGxlbmd0aCA9IGJvdW5kQXJncy5sZW5ndGg7XG4gICAgICB2YXIgYXJncyA9IEFycmF5KGxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFyZ3NbaV0gPSBib3VuZEFyZ3NbaV0gPT09IF8gPyBhcmd1bWVudHNbcG9zaXRpb24rK10gOiBib3VuZEFyZ3NbaV07XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIHRoaXMsIHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gJycgKyAoaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXkpO1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IF8ucGFydGlhbChfLmRlbGF5LCBfLCAxKTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBfLm5vdygpO1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgYXMgbG9uZyBhcyBpdCBjb250aW51ZXMgdG8gYmUgaW52b2tlZCwgd2lsbCBub3RcbiAgLy8gYmUgdHJpZ2dlcmVkLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgaXQgc3RvcHMgYmVpbmcgY2FsbGVkIGZvclxuICAvLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbiAgLy8gbGVhZGluZyBlZGdlLCBpbnN0ZWFkIG9mIHRoZSB0cmFpbGluZy5cbiAgXy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxhc3QgPSBfLm5vdygpIC0gdGltZXN0YW1wO1xuXG4gICAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBvbiBhbmQgYWZ0ZXIgdGhlIE50aCBjYWxsLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCB1cCB0byAoYnV0IG5vdCBpbmNsdWRpbmcpIHRoZSBOdGggY2FsbC5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgICAgaWYgKHRpbWVzIDw9IDEpIGZ1bmMgPSBudWxsO1xuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gXy5wYXJ0aWFsKF8uYmVmb3JlLCAyKTtcblxuICAvLyBPYmplY3QgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBLZXlzIGluIElFIDwgOSB0aGF0IHdvbid0IGJlIGl0ZXJhdGVkIGJ5IGBmb3Iga2V5IGluIC4uLmAgYW5kIHRodXMgbWlzc2VkLlxuICB2YXIgaGFzRW51bUJ1ZyA9ICF7dG9TdHJpbmc6IG51bGx9LnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xuICB2YXIgbm9uRW51bWVyYWJsZVByb3BzID0gWyd2YWx1ZU9mJywgJ2lzUHJvdG90eXBlT2YnLCAndG9TdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddO1xuXG4gIGZ1bmN0aW9uIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKSB7XG4gICAgdmFyIG5vbkVudW1JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IG9iai5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcHJvdG8gPSAoXy5pc0Z1bmN0aW9uKGNvbnN0cnVjdG9yKSAmJiBjb25zdHJ1Y3Rvci5wcm90b3R5cGUpIHx8IE9ialByb3RvO1xuXG4gICAgLy8gQ29uc3RydWN0b3IgaXMgYSBzcGVjaWFsIGNhc2UuXG4gICAgdmFyIHByb3AgPSAnY29uc3RydWN0b3InO1xuICAgIGlmIChfLmhhcyhvYmosIHByb3ApICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSBrZXlzLnB1c2gocHJvcCk7XG5cbiAgICB3aGlsZSAobm9uRW51bUlkeC0tKSB7XG4gICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25vbkVudW1JZHhdO1xuICAgICAgaWYgKHByb3AgaW4gb2JqICYmIG9ialtwcm9wXSAhPT0gcHJvdG9bcHJvcF0gJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIHtcbiAgICAgICAga2V5cy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYE9iamVjdC5rZXlzYFxuICBfLmtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIGlmIChuYXRpdmVLZXlzKSByZXR1cm4gbmF0aXZlS2V5cyhvYmopO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgYWxsIHRoZSBwcm9wZXJ0eSBuYW1lcyBvZiBhbiBvYmplY3QuXG4gIF8uYWxsS2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudCBvZiB0aGUgb2JqZWN0XG4gIC8vIEluIGNvbnRyYXN0IHRvIF8ubWFwIGl0IHJldHVybnMgYW4gb2JqZWN0XG4gIF8ubWFwT2JqZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gIF8ua2V5cyhvYmopLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdHMgPSB7fSxcbiAgICAgICAgICBjdXJyZW50S2V5O1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjdXJyZW50S2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIHJlc3VsdHNbY3VycmVudEtleV0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cyk7XG5cbiAgLy8gQXNzaWducyBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3duIHByb3BlcnRpZXMgaW4gdGhlIHBhc3NlZC1pbiBvYmplY3QocylcbiAgLy8gKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ24pXG4gIF8uZXh0ZW5kT3duID0gXy5hc3NpZ24gPSBjcmVhdGVBc3NpZ25lcihfLmtleXMpO1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGtleSBvbiBhbiBvYmplY3QgdGhhdCBwYXNzZXMgYSBwcmVkaWNhdGUgdGVzdFxuICBfLmZpbmRLZXkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKSwga2V5O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpba2V5XSwga2V5LCBvYmopKSByZXR1cm4ga2V5O1xuICAgIH1cbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmplY3QsIG9pdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwgb2JqID0gb2JqZWN0LCBpdGVyYXRlZSwga2V5cztcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihvaXRlcmF0ZWUpKSB7XG4gICAgICBrZXlzID0gXy5hbGxLZXlzKG9iaik7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2Iob2l0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5LCBvYmopIHsgcmV0dXJuIGtleSBpbiBvYmo7IH07XG4gICAgICBvYmogPSBPYmplY3Qob2JqKTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMsIHRydWUpO1xuXG4gIC8vIENyZWF0ZXMgYW4gb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGUgZ2l2ZW4gcHJvdG90eXBlIG9iamVjdC5cbiAgLy8gSWYgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCB0aGVuIHRoZXkgd2lsbCBiZSBhZGRlZCB0byB0aGVcbiAgLy8gY3JlYXRlZCBvYmplY3QuXG4gIF8uY3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlLCBwcm9wcykge1xuICAgIHZhciByZXN1bHQgPSBiYXNlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgaWYgKHByb3BzKSBfLmV4dGVuZE93bihyZXN1bHQsIHByb3BzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5pc01hdGNoID0gZnVuY3Rpb24ob2JqZWN0LCBhdHRycykge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKGF0dHJzKSwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICB2YXIgb2JqID0gT2JqZWN0KG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cblxuICAgIHZhciBhcmVBcnJheXMgPSBjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgaWYgKCFhcmVBcnJheXMpIHtcbiAgICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHMgb3IgYEFycmF5YHNcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IGZyYW1lcyBhcmUuXG4gICAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiBhQ3RvciBpbnN0YW5jZW9mIGFDdG9yICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG5cbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuXG4gIC8vIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGZvciBhIGdpdmVuIG9iamVjdCB0aGF0IHJldHVybnMgYSBnaXZlbiBwcm9wZXJ0eS5cbiAgXy5wcm9wZXJ0eU9mID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gZnVuY3Rpb24oKXt9IDogZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2ZcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcblxuICBfLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnJyArIHRoaXMuX3dyYXBwZWQ7XG4gIH07XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59LmNhbGwodGhpcykpO1xuIl19
