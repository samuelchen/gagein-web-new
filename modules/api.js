/**
 * Created by Samuel on 14-5-28.
 *
 * the GageIn API wrapper
 */

var config = require('../config');
var logger = require('./logger');
var _ = require('underscore');
var service = require('https');
var Client = require('node-rest-client').Client;

var client = new Client();
var isHttps = true;
if (config.api.protocol == 'http') {
    service = require('http');
    isHttps = false;
}

//var token = 'a8524a26e3dde365bf0a424e3e697513d6fa28a0d53417ae';

/***********************************************************
 * Mapping required APIs here
 ***********************************************************
 * the api mapping.
 * Generally you just need map the url.
 * Add a "handle" function to handle none-standard API call.
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
///* fast wrapper func */ function API_WRAPPER() { return { path: arguments[0] ? arguments[0] : null, method: arguments[1] ? arguments[1] : null, handle:arguments[2] ? arguments[2] : null }}
var api_mapping = {
    login: { path: '/login', method:'POST' },
    getBookmarkList: { path: '/member/me/update/get_saved',method:'POST'},
    addBookmark: { path: '/member/me/update/save', method:'POST'},
    removeBookmark: { path: '/member/me/update/unsave', method:'POST'},
    //getSearchList: { path: '/login', method:'POST'},
    getNewsList : { path: '/member/me/update/tracker'}
}


//api.followComany({}, function(data){
//
//})
/*
 * Mapping end
 **********************************************************/


// http request to API
function _request(url, map, callback  ) {
    var api_url = config.api.protocol + "://" + config.api.hostname + ":" + config.api.port + url;
    var method = (map['method'] == "POST" ? map['method'] : 'GET').toLowerCase();

    var args = {
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
    };
    if(method == "post"){
        args.data = map.data;
    }

    var req = client[method](api_url, args ,function(data, res){
        logger.debug('Response Code:' + res.statusCode);
        logger.info('Succeed API call - ' + api_url);
        if(method == "post")
            logger.info('Succeed API params - ' + JSON.stringify(args));
        callback(JSON.parse(data));
    });

    req.on('error',function(err){
        logger.warn('Failed API call - ' + api_url);
        logger.warn(err.message);
    });

//    var data = {}; // the return data will be passed to callback
//    var body = ''; // response body
//    var option = {  // request options
//        hostname : config.api.hostname,
//        port: config.api.port, //config.api.port,
//        path: url,
//        method: states['method'] ? states['method'] : 'GET',
//        rejectUnauthorized: false
//    };
//
//    var req = service.request(option, function(res) {
//        logger.debug('Response Code:' + res.statusCode);
//        res.on('data', function(dat){
//            console.log(process.stdout.write(dat));
//            body += dat;
//        });
//        res.on('end',function(data){
//            logger.info('Succeed API call - ' + url);
//            callback(body);
//        })
//    }).on('error', function(err){
//        logger.warn('Failed API call - ' + url);
//        logger.warn(err.message);
//    });
//
//    req.end(states.data);
}

/* standard api invoking method
 * arguments:
 *      map - the key-word values mapping to current api in var api_mapping .
 *      parms - the key-word parameters the caller passed in. They should be defined in the GageIn API docs.
 *      callback - the processor to handler the result. Result is defined in function _request().
 */
var _invoke = function (map, parms, callback) {
    logger.debug('API '+ map.path + ' invoked');
    var context = {
        url: config.api.root + map.path,
        separator: ''
    };

    _.extend(parms, { appcode: config.api.appcode});
    var method = (map['method'] == "POST" ? map['method'] : 'GET').toLowerCase();

    if(method == "get"){
        context.url += '?'
        _.each(parms, function (value, key) {
            // "this" is "context" (3rd arg)
            this.url += this.separator + key + '=' + value ;
            this.separator = '&';
        }, context);
    }

    if(method == "post"){
        var query = "";

        _.each(parms, function (value, key) {
            // "this" is "context" (3rd arg)
            query += this.separator + key + '=' + value ;
            this.separator = '&';
        },context);
        map.data = query;
    }

    return _request(context.url, map, callback );
}

// ---- making api mapping ----
logger.debug('---------- api ----------');
_.each(api_mapping, function(value, key){
    // "this" means "module.exports" (3rd argument)

//    if ('handle' in value)
//    // customized API invoking
//        this[key] = (function(k, v) {    //closure for k,v passing
//            logger.debug(k + ' is binding to self-defined function' );
//            return function(parms, cb) {    // return the wrapped method without passing url in
//                logger.debug('API ' + k + 'is invoked.');
//                return v.handle(parms, cb);  // real method to call
//            }
//        })(key, value);
//    else
//        //standard API invoking

    this[key] = (function(k, v){
        logger.debug(k + ' is binding to default API process');
        return function(parms, cb) {
            logger.debug('API ' + k + 'is invoked.');
            return _invoke(v, parms, cb);
        }
    })(key, value);

}, module.exports);

logger.debug('---------- api end ----------');


// ========== the following are simulated data =============

//var newsInfo = {
//    news : {
//        items : [{
//            id : "1",
//            company_pic : "/home/news/image/company.jpg",
//            people_pic : "/home/news/image/people.jpg",
//            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
//            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
//            desc : "48 min ago via LinkedIn"
//        },{
//            id : "2",
//            company_pic : "/home/news/image/company.jpg",
//            people_pic : "/home/news/image/people.jpg",
//            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
//            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
//            desc : "48 min ago via LinkedIn"
//        },{
//            id : "3",
//            company_pic : "/home/news/image/company.jpg",
//            people_pic : "/home/news/image/people.jpg",
//            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
//            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
//            desc : "48 min ago via LinkedIn"
//        },{
//            id : "4",
//            company_pic : "/home/news/image/company.jpg",
//            people_pic : "/home/news/image/people.jpg",
//            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
//            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
//            desc : "48 min ago via LinkedIn"
//        },{
//            id : "5",
//            company_pic : "/home/news/image/company.jpg",
//            people_pic : "/home/news/image/people.jpg",
//            title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe.",
//            content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus blanditiis ducimus hic mollitia officiis quidem recusandae ",
//            desc : "48 min ago via LinkedIn"
//        }]
//    }
//}
//
//var bookmarksInfo = {
//    bookmarks : {
//        items :[
//            {
//                id : "1",
//                title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe."
//            },
//            {
//                id : "4",
//                title : "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe."
//            }
//        ]
//    }
//}
//
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
//
//var headerInfo = {
//    header : {}
//}




//module.exports.getPageContent = function(){
//    return _.extend(newsInfo,bookmarksInfo,filtersInfo,headerInfo);
//}

//module.exports.getBookmarksContent = function(){
//    return bookmarksInfo.bookmarks.items;
//}
//
//module.exports.getNewsContent = function(){
//    return newsInfo.news.items
//}
//
module.exports.getFiltersContent = function(){
    return filtersInfo
}
//
//module.exports.getHeaderContent = function(){
//    return headerInfo
//}


//module.exports.getNewsList = function () {
//    var data = {};
//    data.news = {};
//    data.news.items = [];
//
//    for(var i=0 ,len = Math.round(Math.random() * 2)+1; i<len ;i++){
//        data.news.items.push(newsInfo.news.items[i]);
//    }
//    return data.news.items;
//}

module.exports.getSearchList = function (key) {
    var data = _.filter(filtersInfo.search.items, function(item){
        return ~item.key.indexOf(key);
    });
    return data;
}

//module.exports.getBookmarkList = function() {
//    return bookmarksInfo.bookmarks.items;
//}

//module.exports.addBookmark = function(id) {
//    var data = _.find(bookmarksInfo.bookmarks.items, function(item){
//        return item.id == id;
//    });
//    if(!data){
//        data = _.filter(newsInfo.news.items, function(item){
//            return item.id == id;
//        })[0];
//        data = {id : data.id , title : data.title};
//        bookmarksInfo.bookmarks.items.unshift(data);
//        return data;
//    }else{
//        return {};
//    }
//}
//
//module.exports.removeBookmark = function(id) {
//    bookmarksInfo.bookmarks.items = _.filter(bookmarksInfo.bookmarks.items, function(item){
//        return item.id != id;
//    });
//    return {id : id};
//}




