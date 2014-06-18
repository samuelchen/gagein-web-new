var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    getWidgetData : function(cb){
        var self = this;
        var data = api.getBookmarkList({
            page : 1,
            orgid : 1231041,
            note : "",
            tagid : 1,
            access_token : 'd01cd9e3d9ffec757d98bb4346f1c7b1'
        },function(data){
            var data = JSON.parse(data);
            if(data.status == '5'){
                data = self.getListData([]);
            }else if(data.status == '1'){
                data = self.getListData(JSON.parse(data).data.info);
            }
            cb(data);
        });

    },
    getBookmarkList : function(req,res){
        var data = api.getBookmarkList(req.body,function(data){
            var data = JSON.parse(data);
            if(data.status == '5'){
                res.send(JSON.stringify([]));
            }else if(data.status == '1'){
                res.send(JSON.stringify(data.data.info));
            }
        });
    },
    addBookmark : function(req,res){
        var data = api.addBookmark(req.body,function(data){
            res.send(data);
        })

    },
    removeBookmark : function(req,res){
        var data = api.removeBookmark(req.body,function(data){
            res.send(data);
        });
    }
});