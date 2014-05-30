//require file , path
var fs=require('fs');
var path = require('path');

//require utils function
var _ = require("underscore");

//require async , Processing an asynchronous file operations
var async = require('async');

//set engine
var mustache = require('mustache');

var query = require('cheerio');

var logger = require('./modules/logger');
var config = require('./config');

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

function getWidgetContent(req){
    var widget = req.params.widget,
        page = req.params.page;

    var pathname = path.resolve(path.join(config.dir.root, "widgets/web"),page+"/"+widget);

    if(!fs.existsSync(pathname)){
        pathname = path.resolve(path.join(config.dir.root, "widgets/web"),"common/"+widget);
    }
    var resource = findResource(pathname);

    var jscode = "<script src=\"" + resource.js + "\"></script>";
    //处理css
    var csscode = "<link rel=\"stylesheet\" href=\""+resource.css+"\" type=\"text/css\">";
    //处理html
    var htmlpath = resource.html;

    //console.log(jscode);

    var data = fs.readFileSync(htmlpath, 'utf8');
    $ = query.load('<div ng-app="app">'+data+'</div>');
    if(config.isDebug){
        $.root().append('<link rel="stylesheet" href="http://static.gagein.com/css/base.css" type="text/css">');
        $.root().append('<link rel="stylesheet" href="http://static.gagein.com/css/web/member.css" type="text/css">');
    }
    $.root().append(csscode);
    if(config.isDebug){
        $.root().append('{{{baseurl}}}');
        $.root().append('<script src="http://static.gagein.com/js/require2.1.11.js"></script>');
        $.root().append('<script src="http://static.gagein.com/js/base.js"></script>');
    }
    $.root().append(jscode);
     //console.log($.html());
    $.root().attr("ng-app","app")
    return $.html();

}

function getPageContent(req){
    var $,widgets;

    //获取资源
    var json = {};
    var page = req.params.page;
    var pathname = path.join(config.dir.root, "pages/web/")+ page;

    json = findResource(pathname);

    //var pathname = pathname + "\\"+ path.basename(pathname) + ".html";
    var data = fs.readFileSync(pathname + "\\"+ path.basename(pathname) + ".html", 'utf8');

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
    var resource = json

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
    json = {
        css : css,
        js : js,
        html : html
    };

    //处理js
    var jscode = "\n" + json.js.join("\n");
    //处理css
    var csscode = "\n" + json.css.join("\n");
    //处理html
    var htmlpaths = json.html;

    _.each(widgets,function(widget,index){
        var w = $(widget);
        var wtext = w.text().replace(".","\\");

        _.each(htmlpaths,function(hpath){
            if(~hpath.indexOf(wtext)){
                var data = fs.readFileSync(hpath, 'utf8')
                w.replaceWith(data)
            }
        })
    });

    $("link").last().after(csscode);
    $("head script").last().after(jscode);

    logger.debug("template processing done");
    return $.html();

}


function getTemplate(pathname){
    return  fs.readFileSync(pathname, 'utf8');
}

module.exports = {
    getTemplate : getTemplate,
    findResource : findResource,
    getPageContent : getPageContent,
    getWidgetContent : getWidgetContent,
    render : function(tpl,data){
        var widget_common_path = "/widgets/web/common";
        var widget_path =  "/widgets/web";
        var page_path = "/page/web";
        var baseurl = '<script>var REQUIREJS_BASE_URL = "'+config.host.protocol + '://'+ config.host.static+'/js/";</script>';

        data = _.extend({
            widget_common_path : widget_common_path,
            widget_path : widget_path,
            page_path : page_path,
            baseurl : baseurl,
            config : config
        }, data);

        return mustache.render(tpl,data);
    }
};





