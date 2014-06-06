var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(controller,{
    pathname : __dirname,
    getWidgetData : function(cb){
        var data = api.getFiltersContent();
        cb(data);
    },
    getSearchList : function(req,res){
        var data = api.getSearchList(req.query.key);
        res.send(data);
    }
});