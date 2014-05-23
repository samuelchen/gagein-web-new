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

var app = express();
var logger = require("./modules/logger");

// middleware for logging requests
app.use(function(req, res, next){
    logger.info('Received ' + req.method + ' request ' + req.originalUrl + ' from ' + req.ip);
    logger.debug('Query: ' + req.query);
    next();
});

var _getController = function(req,res,cb){
    if(fs.existsSync(__dirname + "/pages/web/" + req.params.page + "/" + req.params.page + "_controller.js")){
        //console.log("./web/" + req.params.page + "/home_controller");
        var controller = require(__dirname + "/pages/web/" + req.params.page + "/" + req.params.page + "_controller");
        cb(controller);
    }
}

app.use(express.static(__dirname + "/"));

app.get(["/js/*","/image/*","/css/*"],function(req, res){
    //console.log(req.header());

    if(~req.header("host").indexOf("static.gagein.com")){
        //console.log(req.url);
        fs.readFile(__dirname + "/static/" + req.url, 'utf8', function(err, data){
            res.send(data);
        })
    }
});

app.get('/:page', function(req, res){

    if(req.params.page != "favicon.ico"){
        _getController(req,res,function(controller){
            controller.getPageContent(function(data){
                console.log("page success!");
                res.send(data);
            })
        });
    }
});

app.get('/:page/widget/:widget', function(req, res){

    _getController(req,res,function(controller){
        //console.log("get" + req.params.widget[0].toUpperCase() + req.params.widget.substr(1).toLowerCase() + "Content" );
        controller["get" + req.params.widget[0].toUpperCase() + req.params.widget.substr(1).toLowerCase() + "Content" ](req.params.widget,req.params.page,function(data){
            console.log("widget success!");
            res.send(data);
        })
    });
});

logger.info('Server Started');

app.listen(3000);





