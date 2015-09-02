/**
 * Created by dani on 17/08/15.
 */
'use strict';

var _pagination        = require('./pagination'),
    _pagination2= require('./pagination2'),
    _pagination3= require('./pagination3');

var _params = {};

var _init = function(params) {

    jQuery('.pagination').jqPagination({
        link_string	: '/?page={page_number}',
        max_page	: params.max_page,
        page_string		: params.page_string,
        current_page: params.page_number
    });

};

module.exports = {

    "tpls": {
        pagination: _pagination,
        pagination2: _pagination2,
        pagination3: _pagination3
    },

    /*
     "conf": function(tpl) {

     if(tpl==='pagination'){
     _params.max_page = 40;
     _params.page_string = 'Página {current_page} de {max_page}';
     }
     else{
     _params.max_page = 20;
     _params.page_string = '{current_page} de {max_page}';
     }
     },
     */

    "initializer": function(opt) {
        _params.page_number = opt.split('-')[0];
        _params.max_page = opt.split('-')[1];
        _params.page_string = 'Página {current_page} de {max_page}';

        _init(_params);
    }
}
