/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-5-21
 * Time: 下午2:33
 * To change this template use File | Settings | File Templates.
 */
var base = require("./../../../controller");
var _ = require("underscore");
var config = require('./../../../config');
var path = require('path');

var api = require("./../../../modules/api");

module.exports = {
    getPageContent : function(req,res){
        //屏蔽debug
        var old_config = config.isDebug;
        config.isDebug = false;

        var tpl = base.getPageContent(req);
        var data  = api.getPageContent();
        var html = base.render(tpl,data);
        //还原debug
        config.isDebug = old_config;

        res.send(html);
    },
    //命名规则 ， get +　widgetname(首字母大写)　＋　Content
    getBookmarksContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = api.getBookmarksContent();
        res.send(base.render(tpl,data));
    },
    getNewsContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = api.getNewsContent();
        res.send(base.render(tpl,data));
    },
    getFiltersContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = api.getBookmarksContent();
        res.send(base.render(tpl,data));
    },
    getHeaderContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = api.getHeaderContent();
        res.send(base.render(tpl,data));
    },
    getNewsList : function(req,res){
        //var pathname = path.join(config.dir.root, "widgets/web/home/news/new-list.tpl");
        //var tpl = base.getTemplate(pathname);

        var data = api.getNewsList(req.query.key);
        //res.send(base.render(tpl,data));
        res.send(data);
    },
    getSearchList : function(req,res){
        var pathname = path.join(config.dir.root, "widgets/web/home/filters/search-list.tpl");
        var tpl = base.getTemplate(pathname);

        var data = api.getSearchList(req.query.key);
        res.send(base.render(tpl,data));
    },
    getBookmarkList : function(req,res){
        var data = api.getBookmarkList();
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

}

