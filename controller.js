var _ = require("underscore");
var fs=require('fs');
var query = require('cheerio');
var config = require('./config');
var path = require('path');
var logger = require('./modules/logger');
var api = require('./modules/api');
var mustache = require('mustache');
var async = require('async');

module.exports = {
    pathname : __dirname,
    getObjectString : function(data){
        return JSON.stringify(data).replace(/"/g,"'");
    },
    getData : function(callback){
        var widget_common_path = "/widgets/web/common";
        var widget_path =  "/widgets/web";
        var page_path = "/page/web";
        var baseurl = 'var REQUIREJS_BASE_URL = "' + config.host.protocol + '://'+ config.host.static+'/js/";';

        this.getWidgetData(function(data){
            data = _.extend({
                widget_common_path : widget_common_path,
                widget_path : widget_path,
                page_path : page_path,
                baseurl : baseurl,
                config : config
            }, data);
            callback(data);
        });
    },
    getResource : function(pathname){
        logger.debug('getResource: ' + pathname);
        //查找资源文件
        var json = {};
        var files = fs.readdirSync(pathname);
        var pagePath;
        _.each(files,function(file){
            var suffix = path.extname(file),temppath;
            if(~[".html",".css"].indexOf(suffix) || (".js" == suffix && !/_controller/.test(file))){
                if(".html" != suffix){
                    temppath = pathname.replace(config.dir.root+"\\" , "");
                    temppath = temppath.replace(/\\/g,"/");
                    temppath = "/" + temppath + "/" + file;
                    json[suffix.substr(1)] =  temppath;
                }else{
                    json[suffix.substr(1)] = fs.readFileSync(pathname+"\\" + file, 'utf8');
                }
            }
        });
        return json;
    },
    chunk : function(name){
        return '<div id="bigpipe-'+name+'"></div>';
    },
    getChunk : function(name ,callback){
        var json = this.getResource();

        this.getData(param,function(data){
            var tpl = mustache.render(json.html,data);

            var script = {
                id : "bigpipe-" + name ,
                js : json.js,
                css : json.css,
                html : tpl
            }

            callback({
                script : 'G.bigpipe('+JSON.stringify(script)+')'
            })
        })
    },
    getPageContent : function(req , res){

    },
    getWidgetContent : function(req,res){
        var type = req.query.renderType,
            name = req.params.widget; //  0 default , 1 bigpipe , 2 bigrender

        if( type == "1"){
            json = getResource(this.pathname);

            this.getChunk(name , function(obj){
                var static_path = config.host.protocol + '://'+ config.host.static;
                var arr = [];
                arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/base.css" type="text/css">');
                arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/web/member.css" type="text/css">\n');

                arr.push('\n<script>{{{baseurl}}}</script>');
                arr.push('\n<script src="'+static_path+'/js/require2.1.11.js"></script>');
                arr.push('\n<script src="'+static_path+'/js/base.js"></script>\n');

                //script内容会被cheerio转义
                arr.push('<div ng-app="app">\n'+this.chunk(name)+'\n<script>{{{script}}}</script>\n</div>');

                this.getData(function(data){
                    var content = mustache.render(arr.join(""), _.extend(data,obj));
                    res.send(content);
                });
            });

            var data = api.getNewsContent();
            res.send(render($.html(),{"news_init":JSON.stringify(data.news).replace(/"/g,"'") , "script": 'G.bigpipe('+JSON.stringify(script)+')'}));

        }else{
            //默认方式输出
            json = this.getResource(this.pathname);

            var static_path = config.host.protocol + '://'+ config.host.static;
            var arr = [];
            arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/base.css" type="text/css">');
            arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/web/member.css" type="text/css">');
            arr.push('\n<link rel="stylesheet" href="'+ json.css + '" type="text/css">\n');

            arr.push('\n<script>{{{baseurl}}}</script>');
            arr.push('\n<script src="'+static_path+'/js/require2.1.11.js"></script>');
            arr.push('\n<script src="'+static_path+'/js/base.js"></script>');
            arr.push('\n<script src="'+ json.js + '"></script>\n');

            arr.push('<div ng-app="app">\n'+json.html+'\n</div>');

            this.getData(function(data){
                var content = mustache.render(arr.join(""), data);
                res.send(content);
            })
        }

    }
};