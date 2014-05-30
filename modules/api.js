/**
 * Created by Samuel on 14-5-28.
 *
 * the GageIn API wrapper
 */

var _ = require("underscore");

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

exports.getPageContent = function(){
    return _.extend(newsInfo,bookmarksInfo,filtersInfo,headerInfo);
}

exports.getBookmarksContent = function(){
    return bookmarksInfo
}

exports.getNewsContent = function(){
    return newsInfo
}

exports.getFiltersContent = function(){
    return filtersInfo
}

exports.getHeaderContent = function(){
    return headerInfo
}


exports.getNewsList = function () {
    var data = {};
    data.news = {};
    data.news.items = [];

    for(var i=0 ,len = Math.round(Math.random() * 4)+1; i<len ;i++){
        data.news.items.push(newsInfo.news.items[i]);
    }
    return data;
}

exports.getSearchList = function (key) {
    var data = _.filter(filtersInfo.search.items, function(item){
        return ~item.key.indexOf(key);
    });
    data = {
        search :{
            items : data
        }
    };
    return data;
}

exports.getBookmarkList = function() {
    return bookmarksInfo;
}

exports.addBookmark = function(id) {
    var data = _.find(bookmarksInfo.bookmarks.items, function(item){
        return item.id == id;
    });
    if(!data){
        data = _.filter(newsInfo.news.items, function(item){
            return item.id == id;
        })[0];
        data = {id : data.id , title : data.title};
        bookmarksInfo.bookmarks.items.unshift(data);
        return data;
    }else{
        return {};
    }
}

exports.removeBookmark = function(id) {
    bookmarksInfo.bookmarks.items = _.filter(bookmarksInfo.bookmarks.items, function(item){
        return item.id != id;
    });
    return {id : id};
}




