'use strict';

var componentView  = require('../views/defaultView');
var componentModel = {};
var componentTpl	 = require('../views/components/layout');
var componentCfg 	 = require('../views/components/config');


module.exports = function(component, tpl, pag) {

    tpl = tpl || component;
    pag = pag || "1-40";

    // Component Contructor
    /*
     if(componentCfg[component].conf)
     componentCfg[component].conf(tpl);
     */

    // Título
    componentModel.title = component;


    // Añadimos las vistas parciales
    componentModel._component = componentCfg[component].tpls[tpl];
    // Modules view constructor
    var _view = componentView.init(componentModel, componentTpl, componentCfg[component].initializer, [pag]);

    return {
        view: _view,
        params: componentView.defaultParams,
        headerTitle: "Component viewr - " + component,
        menu: 0
    };
};