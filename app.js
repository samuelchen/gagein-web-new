/**
     请求页面
     http://localhost/home

     请求
     http://localhost/home/widget/chunkname

     test
     http://localhost/home                         success
     http://localhost/home/widget/bookmarks        success
     http://localhost/home/widget/header           success

     host
     127.0.0.1 static.gagein.com

     https://static.gagein.com/js/base.js          success
 */

//require webserver , middleware
var express = require("express");
var connect = require("connect");
var fs = require('fs');
var i18n = require('i18n');
var cons = require('consolidate');

var logger = require("./modules/logger");
var config = require("./config");
var mapping = require("./mapping.json");
var app = express();
var https = require('https')

//app.use(connect.json());
//app.use(connect.urlencoded());
//app.use(connect.multipart());
app.use(connect.bodyParser());
//app.engine('html', cons.mustache);

// middleware to log all requests
app.use(function(req, res, next){
    logger.info('Received ' + req.method + ' request ' + req.originalUrl + ' from ' + req.ip);
    next();
});

//请求pages 或者 widgets里面静态文件
app.use(express.static(config.dir.root + "/"));
//请求static里面静态文件
app.use(express.static(config.dir.root + "/static"));

//app.use(express.cookieParser());

// init i18n module for this loop
app.use(i18n.init);

// register helper as a locals function wrapped as mustache expects
app.use(function (req, res, next) {
    i18n.init(req, res);
    logger.warn('>>>> i18 initialized.');
    // mustache helper
    res.locals.__ = function () {
        logger.warn('>>>> i18 applied.');
        return function (text, render) {
            logger.warn('>>>> i18 executed.');
            return i18n.__.apply(req, arguments);
        };
    };
    next();
});

var _getContentController = function(page,widget){
    if(widget){
        if(fs.existsSync(config.dir.root + "/widgets/web/" + page + "/" + widget + "/" + widget+ "_controller.js")){
            return require(config.dir.root + "/widgets/web/" + page + "/" +  widget + "/" + widget + "_controller");
        }
        if(fs.existsSync(config.dir.root + "/widgets/web/common/" +  widget + "/" + widget + "_controller.js")){
            return require(config.dir.root + "/widgets/web/common/" +  widget + "/" + widget + "_controller");
        }
    }else{
        return require(config.dir.root + "/pages/web/" + page + "/" + page + "_controller");
    }
};

var _getMethodController = function(page,widget,method){
    if(fs.existsSync(config.dir.root + '/widgets/web/'+page+'/'+widget+'/'+widget+'_controller.js')){
        return require(config.dir.root + '/widgets/web/'+page+'/'+widget+'/'+widget+'_controller');
    }else{
        return require(config.dir.root + mapping[page + "_" + widget + "_" + method]);
    }
}

app.get('/:page', function(req, res){
    if(req.params.page != "favicon.ico"){
        var controller = _getContentController(req.params.page);
        if(controller &&  controller.getPageContent)
            controller.getPageContent(req, res);
    }
});

app.get('/:page/:widget', function(req, res){
    var controller = _getContentController(req.params.page,req.params.widget);
    if(controller &&  controller.getWidgetContent)
        controller.getWidgetContent(req, res);
});

app.post('/:page/:widget/:method', function(req, res){
    var controller = _getMethodController(req.params.page,req.params.widget,req.params.method);
    if(controller &&  controller[req.params.method])
        controller[req.params.method](req,res);
});

app.get('/:page/:widget/:method', function(req, res){
    var controller = _getMethodController(req.params.page,req.params.widget,req.params.method);
    if(controller &&  controller[req.params.method])
        controller[req.params.method](req,res);
});


logger.info('Server Started');

app.listen(80);





