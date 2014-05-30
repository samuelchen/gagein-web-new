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

var newsInfo = {
    news : {
        items : [{
            id : "1",
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            id : "2",
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            id : "3",
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            id : "4",
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            id : "5",
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        }]
    }
}

var bookmarksInfo = {
    bookmarks : {
        items :[
            {
                id : "1",
                title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe."
            },
            {
                id : "4",
                title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe."
            }
        ]
    }
}

var filtersInfo = {
    search : {
        items :[
            { key:"abcd"},
            { key:"bbc"},
            { key:"bcc"},
            { key:"acc"},
            { key:"acb"}
        ]
    }
}

var headerInfo = {
    header : {}
}


module.exports = {
    getPageContent : function(req,res){
        var tpl = base.getPageContent(req);
        var data  = _.extend(newsInfo,bookmarksInfo,filtersInfo,headerInfo);
        res.send(base.render(tpl,data));
    },
    //命名规则 ， get +　widgetname(首字母大写)　＋　Content
    getBookmarksContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = bookmarksInfo;
        res.send(base.render(tpl,data));
    },
    getNewsContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = newsInfo;
        res.send(base.render(tpl,data));
    },
    getFiltersContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = filtersInfo;
        res.send(base.render(tpl,data));
    },
    getHeaderContent : function(req,res ){
        var tpl = base.getWidgetContent(req);
        var data = headerInfo;
        res.send(base.render(tpl,data));
    },
    getNewsList : function(req,res){
        var pathname = path.join(config.dir.root, "widgets/web/home/news/new-list.tpl");
        var tpl = base.getTemplate(pathname);
        var data = {};
        data.news = {};
        data.news.items = [];

        for(var i=0 ,len = Math.round(Math.random() * 4)+1; i<len ;i++){
            data.news.items.push(newsInfo.news.items[i]);
        }
        res.send(base.render(tpl,data));
    },
    getSearchList : function(req,res){
        var pathname = path.join(config.dir.root, "widgets/web/home/filters/search-list.tpl");
        var tpl = base.getTemplate(pathname);

        var data = _.filter(filtersInfo.search.items, function(item){
            return ~item.key.indexOf(req.query.key);
        });
        data = {search :{
            items : data
        }};

        //console.log(base.render(tpl,data));
        res.send(base.render(tpl,data));
    },
    getBookmarkList : function(req,res){
        var data = bookmarksInfo;
        res.send(data);
    },
    addBookmark : function(req,res){

        var data = _.find(bookmarksInfo.bookmarks.items, function(item){
            return item.id == req.query.id;
        });
        if(!data){
            data = _.filter(newsInfo.news.items, function(item){
                return item.id == req.query.id;
            })[0];
            data = {id : data.id , title : data.title};
            bookmarksInfo.bookmarks.items.unshift(data);
            res.send(data);
        }else{
            res.send({});
        }
    },
    removeBookmark : function(req,res){
        bookmarksInfo.bookmarks.items = _.filter(bookmarksInfo.bookmarks.items, function(item){
            return item.id != req.query.id;
        });
        res.send({id : req.query.id });
    }

}

