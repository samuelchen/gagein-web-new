/**
 * Created by Administrator on 14-6-4.
 */
var fs=require('fs');
var path = require('path');

//require utils function
var _ = require("underscore");

//set engine
var mustache = require('mustache');
var query = require('cheerio');

var logger = require('./modules/logger');
var config = require('./config');

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


//获取widget模板
function getWidgetContent(req){
    var widget = req.params.widget,
        page = req.params.page;

    var pathname = path.resolve(path.join(config.dir.root, "widgets/web"),page+"/"+widget);

    if(!fs.existsSync(pathname)){
        pathname = path.resolve(path.join(config.dir.root, "widgets/web"),"common/"+widget);
    }
    var json = findResource(pathname);

    //处理脚本
    var jscode = "<script src=\"" + json.js + "\"></script>";
    //处理css
    var csscode = "<link rel=\"stylesheet\" href=\""+json.css+"\" type=\"text/css\">";
    //处理html
    var htmlpath = json.html;

    //获取模板数据
    var data = fs.readFileSync(htmlpath, 'utf8');

    var static_path = config.host.protocol + '://'+ config.host.static;

    var arr = [];
    arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/base.css" type="text/css">');
    arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/web/member.css" type="text/css">');
    arr.push("\n" + csscode );

    arr.push('\n{{{baseurl}}}');
    arr.push('\n<script src="'+static_path+'/js/require2.1.11.js"></script>');
    arr.push('\n<script src="'+static_path+'/js/base.js"></script>');
    arr.push("\n"+jscode);

    arr.push('<div ng-app="app">\n'+data+'\n</div>');

    $ = query.load(arr.join(""));

    return $.html();
}


//获取page模板
function getPageContent(req){
    var $,widgets;

    //获取资源
    var jsarrjson = {};
    var page = req.params.page;
    var pathname = path.join(config.dir.root, "pages/web/")+ page;

    //获取page资源
    json = findResource(pathname);

    var data = fs.readFileSync(pathname + "\\"+ path.basename(pathname) + ".html", 'utf8');
    $ = query.load(data);

    widgets = $("widget");
    //没有元素直接返回
    if(!widgets.length){
        return data;
    }

    //widget的资源
    json.widgets = [];
    //获取每个widget
    _.each(widgets,function(ele){
        var widget_path = $(ele).text().replace(".","/");
        widget_path = path.resolve( path.join(config.dir.root, "widgets/web"), widget_path);
        json.widgets.push(findResource(widget_path));
    });
    logger.debug("get resources done!");


    //对资源分类
    var getFileByType = function(type){
        var arr = [];
        _.each(_.union(json,json.widgets),function(r){
            if("js" == type){
                arr.push("<script src=\"" + r[type] + "\"></script>");
            }else if("css" == type){
                arr.push("<link rel=\"stylesheet\" href=\""+r[type]+"\" type=\"text/css\">");
            }else{
                arr.push(r[type]);
            }
        });
        return arr;
    }

    var cssarr = getFileByType("css");
    var jsarr = getFileByType("js");
    var htmlarr = getFileByType("html");

    logger.debug("Resource classification done!");

    //处理js
    var jscode = "\n" + jsarr.join("\n");
    //处理css
    var csscode = "\n" + cssarr.join("\n");
    //处理html
    var htmlpaths = htmlarr;

    _.each(widgets,function(widget,index){
        var w = $(widget);
        var wtext = w.text().replace(".","\\");

        _.each(htmlpaths,function(hpath){
            if(~hpath.indexOf(wtext)){
                var data = fs.readFileSync(hpath, 'utf8');
                data = [
                    "\n<!--start: "+wtext+"-->\n",
                    data,
                    "\n<!--end: "+wtext+"-->\n"
                ].join("");
                w.replaceWith(data)
            }
        })
    });


    if($("head link").length){
        $("head link").last().after(csscode);
    }else{
        $("head").append(csscode);
    }

    if($("head script").length){
        $("head script").last().after(jscode);
    }else{
        $("head").append(jscode);
    }

    logger.debug("template processing done");
    return $.html();
}


module.exports = {
    getContent : function(){
        throw new Error("getContent Not implemented");
    },
    getData : function(){
        throw new Error("getData Not implemented");
    },
    getTemplate : function(){
        throw new Error("getTemplate Not implemented");
    }
}