var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    getWidgetData : function(cb){
        var self = this;
        api.getNewsList({
            access_token : 'd01cd9e3d9ffec757d98bb4346f1c7b1',
            page : 1,
            pageflag : 0,
            pagetime :0 ,
            newsid : 0,
            orgid : 1231041 //sina
        },function(data){
            cb(data.data.info)
        });
    },
    getNewsList : function(req,res){
        api.getNewsList(req.query,function(data){
            res.send(data.data.info);
        });
    }
});