/**
     请求页面
     http://localhost:3000/home

     请求
     http://localhost:3000/home/widget/chunkname

     test
     http://localhost:3000/home                         success
     http://localhost:3000/home/widget/bookmarks        success
     http://localhost:3000/home/widget/header           success

     host
     127.0.0.1 static.gagein.com

     https://static.gagein.com:3000/js/base.js          success
 */

//require webserver , middleware
var express = require("express");
var connect = require("connect");
var fs = require('fs');
var i18n = require('i18n');
var cons = require('consolidate');

var logger = require("./modules/logger");
var config = require("./config");
var app = express();

app.engine('html', cons.mustache);

// middleware to log all requests
app.use(function(req, res, next){
    logger.info('Received ' + req.method + ' request ' + req.originalUrl + ' from ' + req.ip);
    next();
});
app.use(express.static(config.dir.root + "/"));
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


var _getController = function(req,res,cb){
    if(fs.existsSync(config.dir.root + "/pages/web/" + req.params.page + "/" + req.params.page + "_controller.js")){
        //logger.debug("./web/" + req.params.page + "/home_controller");
        var controller = require(__dirname + "/pages/web/" + req.params.page + "/" + req.params.page + "_controller");
        cb(controller);
    }
};

app.get('/:page', function(req, res){

    var x = res.__('hello world');
    logger.warn(x);

    if(req.params.page != "favicon.ico"){
        _getController(req,res,function(controller){
            controller.getPageContent(function(data){
                logger.debug("page success!");
                res.send(data);
            })
        });
    }
});

app.get('/:page/widget/:widget', function(req, res){

    _getController(req,res,function(controller){
        //logger.debug("get" + req.params.widget[0].toUpperCase() + req.params.widget.substr(1).toLowerCase() + "Content" );
        controller["get" + req.params.widget[0].toUpperCase() + req.params.widget.substr(1).toLowerCase() + "Content" ](req.params.widget,req.params.page,function(data){
            logger.debug("widget success!");
            res.send(data);
        })
    });
});

logger.info('Server Started');

app.listen(80);





