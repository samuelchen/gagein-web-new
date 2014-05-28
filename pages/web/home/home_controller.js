/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-5-21
 * Time: 下午2:33
 * To change this template use File | Settings | File Templates.
 */
var base = require("./../../../controller");
var _ = require("underscore");

var newsInfo = {
    news : {
        items : [{
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        },{
            company_pic : "/home/news/image/company.jpg",
            people_pic : "/home/news/image/people.jpg",
            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
            desc : "48 min ago via LinkedIn"
        }]
    }
}

var bookmarksInfo = {
    bookmarks : {}
}

var filtersInfo = {
    filters : {}
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
    }
}

