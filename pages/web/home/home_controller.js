var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(controller,{
    pathname : __dirname,
    getWidgetData : function(cb){
        var data = api.getNewsContent();
        data.news_init = this.getObjectString(data.news);
        cb(data);
    },
    getNewsList : function(res,req){
        var data = api.getNewsList();
        res.send(data);
    }
});