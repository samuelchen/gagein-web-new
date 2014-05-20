var express = require('express');
var connect = require("connect");

//set file , path
var fs=require('fs');
var path = require('path');

//utils function
var _ = require("underscore");

var async = require('async');

//set server
var app = express();

//set engine
var cons = require('consolidate');
app.engine('html', cons.mustache);

var query = require('cheerio');

//router 规则映射对应的文件处理


//查找资源文件
//console.log(process.argv);
//console.log(__dirname);
//console.log(fs.readdirSync(__dirname));
var findResource = function(pathname){
    //console.log(type);
    var json = {};
    var files = fs.readdirSync(pathname);
    var pagePath;
    _.each(files,function(file){
        var suffix = path.extname(file);
        if(~[".html",".css"].indexOf(suffix) || (".js" == suffix && !/_controller/.test(file))){
            json[suffix.substr(1)] = pathname+"\\" + file;
        }
    });

    return json;
}

var $,widgets;

async.waterfall([
    function(callback){
        //console.log(pagePath);
        var json = {};
        json = findResource(__dirname);

        var pathname = __dirname + "\\"+ path.basename(__dirname) + ".html";
        fs.readFile(__dirname + "\\"+ path.basename(__dirname) + ".html", 'utf8', function(err, data) {
            $ = query.load(data);
            widgets = $("widget");
            //console.log(widgets.length);
            //没有元素直接返回
            if(!widgets.length){
                return callback(null,json);
            }
            json.widgets = [];
            //获取每个widget
            _.each(widgets,function(ele){
                var widget_path = ele.children[0].data.replace(".","/");
                //console.log(path.resolve("/gagein-web-new/widgets/web/",widget_path));
                widget_path = path.resolve("/gagein-web-new/widgets/web/",widget_path);
//                        console.log(widget_path);
//                        console.log(findResource(widget_path,"widget"));
                json.widgets.push(findResource(widget_path));
            })
            //console.log(json);
            callback(null,json);
        })
    },
    function(resource,callback){
        console.log(resource);
        var getFileByType = function(type){
            var arr = [];
            arr.push(resource[type]);
            _.each(resource.widgets,function(widget){
                if("js" == type){
                    arr.push("<script>" + widget[type] + "</script>");
                }else if("css" == type){
                    arr.push("<style>" + widget[type] + "</style>");
                }else{
                    arr.push(widget[type]);
                }
            })
            console.log(arr);
            return arr;
        }

        //模板拼接
        async.parallel([
            function(cb) {
                var css = getFileByType("css");
                cb(null,css.join("\\n"));
            },
            function(cb) {
                var js = getFileByType("js");
                cb(null,js.join("\\n"));
            },
            function(cb) {
                var html = getFileByType("html");
                //console.log( html[1]);
                //console.log( html[1].indexOf("common\\header"));
                console.log( html );
                _.each(widgets,function(widget){
                    var w = $(widget);
                    var wtext = w.text().replace(".","\\");

                    async.each(html,function(h,callback){
                        if(~h.indexOf(wtext)){
                            fs.readFile(h, 'utf8', function(err, data) {
                                w.replaceWith(data);
                            });
                            callback();
                        }
                    })
                })
                cb(null,$.html());
            }
        ], function(err, results) {
           console.log(results);
        });


        callback(null,"all is ok");
    }
], function(err, values) {
    console.log(values);
});












//是否存在widget ==> 查找资源文件
//获取到所有资源，渲染

//返回页面















//var rootPath = process.argv[1];
//console.log(__dirname);
//var getRelatedFiles = function(pathname){
//    console.log(pathname);
//    fs.readFile(__dirname + "/map.json",'utf-8',function(err,data){
//        if(err){
//            console.log("error");
//        }else{
//            console.log(data);
//            var map = JSON.parse(data);
//            _.each(map.res,function(value){
//                //console.log(value.uri);
//                console.log(path.extname(value.uri));
//            })
//        }
//    });
//}
//
//
////console.log("path "+path);
////console.log("__dirname "+__dirname);
////console.log(path.relative('/', __dirname));
//fs.readFile('home.html', 'utf8', function(err, data) {
//    var dom = require('htmlparser-query').load(data);
//    var widgets = dom.find("include[type=widget]");
//
//    getRelatedFiles(path.relative('/', __dirname));
//    _.each(widgets.elms,function(ele){
//        //console.log(ele.children[0].data.replace(".","/"));
//       // console.log(path.relative('/',"widget/"+ ele.children[0].data.replace(".","/")));
//    })
//});



