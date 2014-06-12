var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    getWidgetData : function(cb){
        var data = api.getBookmarksContent();
        data = this.getListData(data);
        cb(data);
    },
    getBookmarkList : function(req,res){
        var data = api.getBookmarkList();
        //data = this.getListData("bookmarks" , data);
        res.send(data);
    },
    addBookmark : function(req,res){
        var data = api.addBookmark(req.query.id)
        res.send(data);
    },
    removeBookmark : function(req,res){
        var data = api.removeBookmark(req.query.id);
        res.send(data);
    }
});