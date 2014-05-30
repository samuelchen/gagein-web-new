/**
 * Created by Samuel on 14-5-28.
 *
 * the GageIn API wrapper
 */

var config = require('../config');
var logger = require('./logger');
var _ = require('underscore');
var http = require('http')

/***********************************************************
 * Mapping required APIs here
 ***********************************************************
 * the api mapping.
 * Generally you just need map the url.
 * Add a "method" function to handle none-standard API call.
 *
 * naming:
 *   lower case initialized.
 *   first word must be verb.
 *      single verb to perform the corresponding action
 *      'listSomething' means to get a list (json array)
 *      'getSomething' means to get a object (json map)
 *      'setSomething' means to change a object.
 *  arguments:
 *    1nd arg 'parms' is the parameters map.
 *    2nd arg 'callback' is the function to callback while API responded. It takes one arg 'data'.
 */
var api_mapping = {
    login: { path: '/login'},
    register: { path: '/register' },
    listFollowedCompanies: {
        path: '/list/companies_detail',
        method: function(parms, callback) {
        }
    }
}
/*
 * Mapping end
 **********************************************************/


// http request to API
function _request(url, callback) {
    var data = {}; // the return data will be passed to callback
    var body = ''; // response body
    var option = {  // request options
        path : 'url',
        method: 'GET',
        header: {

        }
    }

    var req = http.request(options, function(res) {
        logger.debug('Response Code:' + res.statusCode);
        res.on('data', function(dat){
            body += dat;
        });
    }).on('end', function(){
        logger.info('Succeed API call - ' + url);
        data.header = res.headers;
        data.body = body;
        callback(data);
    }).on('error', function(err){
        logger.warn('Failed API call - ' + url);
        logger.error(err.message);
    });

    req.end();
}

// standard api invoking method
var _invoke = function (path, parms, callback) {
    logger.debug('API '+ path + ' invoked');
    var context = {
        url:config.host.protocol + '://' + config.host.api,
        separator:''
    };

    if (!parms) {
    } else {
        context.url += '?'
        _.each(parms, function (value, key) {
            // "this" is "context" (3rd arg)
            this.url += this.seperator + key + '=' + value ;
            this.seprator = '&';
        }, context);
    };

    return _request(context.url, callback);
}

// ---- making api mapping ----
logger.debug('---------- api ----------');
_.each(api_mapping, function(value, key){
    // "this" means "module.exports" (3rd argument)

    if ('method' in value)
        // customized API invoking

        this[key] = (function(k, v) {    //closure for k,v passing
            logger.debug(k + ' is binding to self-defined function' );
            return function(parms, cb) {    // return the wrapped method without passing url in
                logger.debug('API ' + k + 'is invoked.');
                return v.method(v.path, parms, cb);  // real method to call
            }
        })(key, value);
    else
        // standard API invoking

        this[key] = (function(k, v){
            logger.debug(k + ' is binding to default API process');
            return function(parms, cb) {
                logger.debug('API ' + k + 'is invoked.');
                return _invoke(v.path, parms, cb);
            }
        })(key, value);

}, module.exports);

logger.debug('---------- api end ----------');


// ========== the following are simulated data =============

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




