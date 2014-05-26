//require webserver , middleware
var express = require('express');
var connect = require("connect");

//require file , path
var fs=require('fs');
var path = require('path');

//require utils function
var _ = require("underscore");

//require async , Processing an asynchronous file operations
var async = require('async');

//set webserver
var app = express();

//set engine
var mustache = require('mustache');

var query = require('cheerio');

var logger = require('./modules/logger')
var config = require('./config')

//router 规则映射对应的文件处理

var findResource = function(pathname){
    logger.debug('findResource: ' + pathname);
    //查找资源文件
    var json = {};
    var files = fs.readdirSync(pathname);
    var pagePath;
    _.each(files,function(file){
        var suffix = path.extname(file),temppath;
        if(~[".html",".css"].indexOf(suffix) || (".js" == suffix && !/_controller/.test(file))){
              if(".html" != suffix){
                    temppath = pathname.replace(__dirname+"\\" , "");
                    temppath = temppath.replace(/\\/g,"/");
                    json[suffix.substr(1)] = "/" + temppath + "/" + file;
              }else{
                  json[suffix.substr(1)] = pathname+"\\" + file;
              }
        }
    });
    //logger.debug(json);
    return json;
}

function getWidgetContent(w,g,callback){
    var pathname = path.resolve(path.join(config.dir.root, "widgets/web"),g+"/"+w);

    if(!fs.existsSync(pathname)){
        pathname = path.resolve(path.join(config.dir.root, "widgets/web"),"common/"+w);
    }
    var resource = findResource(pathname);

    var jscode = "<script>" + resource.js + "</script>";
    //处理css
    var csscode = "<link rel=\"stylesheet\" href=\""+resource.css+"\" type=\"text/css\">";
    //处理html
    var htmlpath = resource.html;

    fs.readFile(htmlpath, 'utf8', function(err, data){
        $ = query.load(data);
        $("head").append(csscode);
        $("head").append(jscode);
        callback($.html());
    })
}

function getPageContent(pathname,callback){
    var $,widgets;
    async.waterfall([
        function(callback){
            //获取资源
            var json = {};
            json = findResource(pathname);

            //var pathname = pathname + "\\"+ path.basename(pathname) + ".html";
            fs.readFile(pathname + "\\"+ path.basename(pathname) + ".html", 'utf8', function(err, data) {
                $ = query.load(data);
                widgets = $("widget");
                //没有元素直接返回
                if(!widgets.length){
                    return callback(null,json);
                }
                json.widgets = [];
                //获取每个widget
                _.each(widgets,function(ele){
                    var widget_path = ele.children[0].data.replace(".","/");
                    widget_path = path.resolve( path.join(config.dir.root, "widgets/web"), widget_path);
                    json.widgets.push(findResource(widget_path));
                })
                logger.debug("get resources done!");
                callback(null,json);
            })
        },
        function(resource,callback){
            //对资源分类

            var getFileByType = function(type){
                var arr = [];
                arr.push();
                _.each(_.union(resource,resource.widgets),function(widget){
                    if("js" == type){
                        arr.push("<script src=\"" + widget[type] + "\"></script>");
                    }else if("css" == type){
                        arr.push("<link rel=\"stylesheet\" href=\""+widget[type]+"\" type=\"text/css\">");
                    }else{
                        arr.push(widget[type]);
                    }
                })
                return arr;
            }

            var css = getFileByType("css");
            var js = getFileByType("js");
            var html = getFileByType("html");

            logger.debug("Resource classification done!");
            callback(null,{
                css : css,
                js : js,
                html : html
            });
        },
        function(json,callback){
            //处理js
            var jscode = "\n" + json.js.join("\n");
            //处理css
            var csscode = "\n" + json.css.join("\n");
            //处理html
            var htmlpaths = json.html;

            var q = async.queue(function (task, callback) {

                var w = $(task.widget);
                var wtext = w.text().replace(".","\\");

                _.each(htmlpaths,function(hpath){
                    if(~hpath.indexOf(wtext)){
                        fs.readFile(hpath, 'utf8', function(err, data) {
                            var parent = w.parent();
                            parent.html(data);
                            callback();
                        })
                    }
                })
            }, 2);

            _.each(widgets,function(widget,index){
                (function(idx){
                    q.push({widget: widget}, function (err) {
                        logger.debug('finished processing : ' + $(widget).text());
                    })
                })(index)

            });

            q.drain = function() {
                $("link").last().after(csscode);
                $("body").after(jscode);
                logger.debug("template processing done");
                callback(null,$.html());
            }
        }
    ], function(err, html) {
        callback(html);
    });
}

module.exports = {
    findResource : findResource,
    getPageContent : getPageContent,
    getWidgetContent : getWidgetContent,
    render : function(tpl,data){
        var widget_common_path = "/widgets/web/common";
        var widget_path =  "/widgets/web";
        var page_path = "/page/web";

        data = _.extend({
            widget_common_path : widget_common_path,
            widget_path : widget_path,
            page_path : page_path,
            config : config
        }, data);

        return mustache.render(tpl,data);
    }
};





