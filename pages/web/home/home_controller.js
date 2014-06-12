var _ = require("underscore");
var logger = require('./../../../modules/logger');
var api = require('./../../../modules/api');
var controller = require('./../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    //renderType : "1",
    getPathname : function(){
        return this.pathname;
    }
});