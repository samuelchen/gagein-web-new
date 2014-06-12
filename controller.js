var _ = require("underscore");
var _str = require("underscore.string");
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
    //1(facebook) , 2(淘宝) , 0(默认)
    renderType : "0",
    getObjectString : function(data){
        //将对象变成，标签属性值
        return JSON.stringify(data).replace(/"/g,"'");
    },
    getWidgetData : function(callback){
        callback({});
    },
    getListData : function(data){
        var obj = {},
            name = this.pathname.split("\\");
        name = name.pop();
        obj[name +"_data"] = data;
        if(this.renderType == "0"){
            obj[name +"_data_str"] = this.getObjectString(data);
        }
        return obj;
    },
    getData : function(callback){
        //渲染之前，添加额外的参数
        var widget_common_path = "/widgets/web/common";
        var widget_path =  "/widgets/web";
        var page_path = "/page/web";
        var baseurl = 'var REQUIREJS_BASE_URL = "' + config.host.protocol +'://'+ config.host.static + '/js/";';

        //调用每一个widget的接口，获取数据
        this.getWidgetData(function(data){
            data = _.extend(data,{
                widget_common_path : widget_common_path,
                widget_path : widget_path,
                page_path : page_path,
                baseurl : baseurl,
                config : config
            });
            callback(data);
        });
    },
    getResource : function(pathname,sync){
        logger.debug('getResource: ' + pathname);
        //查找资源文件
        var json = {};
        var files = fs.readdirSync(pathname);
        var pagePath;
        _.each(files,function(file){
            var suffix = path.extname(file),temppath;
            if(~[".html",".css",".js"].indexOf(suffix)){
                if(".html" != suffix){
                    temppath = pathname.replace(config.dir.root+"\\" , "");
                    temppath = temppath.replace(/\\/g,"/");
                    temppath = "/" + temppath + "/" + file;
                    if(/_controller/.test(file)){
                        json["controller"] =  config.dir.root + temppath;
                    }else{
                        json[suffix.substr(1)] =  temppath;
                    }
                }else{
                    json["html"] = fs.readFileSync(pathname+"\\" + file, 'utf8');
                    if(sync){
                        $ = query.load(json["html"]);
                        //将模板变成
                        var child_ele = $($("[ng-repeat]")[0]);

                        var parent_ele = child_ele.parent("[ng-init]");
                        var parent_c_ele = parent_ele.clone();
                        var child_c_ele = parent_c_ele.children("[ng-repeat]")

                        var item = _str.trim(child_ele.attr("ng-repeat").split("in")[0]);
                        var items = _str.trim(child_ele.attr("ng-repeat").split("in")[1]);
                        var items_data = _str.trim(parent_ele.attr("ng-init").split("=")[1]).replace(/({{{|}}}|_str)/g,'');

                        parent_c_ele.removeAttr("ng-init").attr("ng-hide",items);
                        parent_ele.attr("ng-show",items);
                        child_c_ele.removeAttr("ng-repeat")

                        var content = parent_c_ele.html();
                        content = content.replace(/{%/g,"{{").replace(/%}/g,"}}").replace(new RegExp(item + "\\.","g"), "").replace(/ng-/g,"");
                        parent_c_ele.html('\n{{#'+items_data+'}}\n' + content + '\n{{/'+items_data+'}}\n');
                        parent_ele.before(parent_c_ele);
                        json["html"] = $.html();
                    }
                }
            }
        });
        return json;
    },
    chunk : function(name){
        return '<div id="bigpipe-'+name+'"></div>';
    },
    getChunk : function(name ,pathname , callback){
        if(typeof pathname == 'function'){
            callback = pathname;
            pathname = this.pathname;
        }
        var json = this.getResource(pathname);

        this.getData(function(data){
            var tpl = mustache.render(json.html,data);

            var script = {
                id : "bigpipe-" + name ,
                name : name ,
                js : json.js,
                css : json.css,
                html : tpl
            }

            callback({
                script : 'G.bigpipe('+JSON.stringify(script)+')'
            })
        })
    },
    _insertResource : function($, rs){
        var js_arr = [];
        var css_arr = [];
        _.each(rs,function(r){
            js_arr.push('\n<script src="' + r.js + '"></script>');
            css_arr.push('\n<link rel="stylesheet" href="' + r.css + '" type="text/css">');
        });

        var csscode = css_arr.join('');
        var jscode = js_arr.join('');

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
    },
    getPageContent : function(req , res){

        var json = this.getResource(this.pathname);
        var self = this;
        var $ = query.load(json.html);
        var widgets = $("widget");


        var widgets_arr = [];
        _.each(widgets,function(ele){
            var widget_element = $(ele);
            var widget_path = widget_element.text().replace(".","/");
            var widget_name = widget_element.text().split(".")[1];
            var widget_sync = widget_element.attr("sync") == "true" ? 1 : 0;
            widget_path = path.resolve( path.join(config.dir.root, "widgets/web"), widget_path);

            widgets_arr.push({path : widget_path , ele : widget_element , name : widget_name , sync : widget_sync});
        });

        logger.debug("get resources done!");


        var resource = [json],
            content,
            widget_r;
        if(self.renderType == "1"){
            _.each(widgets_arr,function(widget){
                content = self.chunk(widget.name);
                widget.ele.replaceWith('\n<!--start  ' + widget.name + '-->\n' + content + '\n<!--end  ' + widget.name + '-->\n');
            });
            self._insertResource($,resource);
            self.getData(function(d){
                var content = mustache.render($.html(), d);
                content = content.replace("</body>","").replace("</html>","");
                res.write(content);

                async.each(widgets_arr,function(widget,callback){
                    var widget_r = self.getResource(widget.path);
                    var controller = require(widget_r.controller);
                    controller.getChunk(widget.name , function(obj){
                        //模拟随机输出
                        setTimeout(function(){
                            res.write('\n<!--start  ' + widget.name + '-->\n<script>'+obj.script+'</script>\n<!--end  ' + widget.name + '-->\n');
                            callback();
                        },Math.random() * 4+1);
                    });
                },function(err){
                    if( err ) {
                        logger.debug('A widget failed to process');
                    } else {
                        logger.debug('widgets load successfully');
                        res.write("\n<script>G.done();</script>\n");
                        res.write("\n</body>\n</html>");
                        res.end();
                    }
                });

            });

        }else{
            _.each(widgets_arr,function(widget){
                var widget_r = self.getResource(widget.path,widget.sync);
                resource.push(widget_r);
                widget.ele.replaceWith('\n<!--start  ' + widget.name + '-->\n' + widget_r.html + '\n<!--end  ' + widget.name + '-->\n');
            });
            self._insertResource($,resource);


            //获取页面所有数据
            var d = {};
            async.each(resource, function(r ,callback){
                //node 里面require是异步的，用的是在调用
                var controller = require(r.controller);
                if(!controller.getWidgetData){
                    throw new Error("error : " + r.controller + "controller has no getWidgetData")
                }

                controller.getData && controller.getData(function(data){
                    _.extend(d , data);
                    callback();
                })
            },function(err){
                if( err ) {
                    logger.debug('A widget getdata failed to process');
                } else {
                    logger.debug('widgets getdata successfully');
                    var content = mustache.render($.html(), d);
                    res.send(content);
                }
            })
        }
    },
    getWidgetContent : function(req,res){
        //1(facebook) , 2(淘宝) , 0(默认)
        var renderType = req.query.renderType,
            sync = ~~req.query.sync,
            name = req.params.widget
        self = this;

        if( renderType == "1"){
            json = this.getResource(this.pathname);

            this.getChunk(name , function(obj){
                var static_path = config.host.static;
                var arr = [];
                arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/base.css" type="text/css">');
                arr.push('\n<link rel="stylesheet" href="'+static_path+'/css/web/member.css" type="text/css">\n');

                arr.push('\n<script>{{{baseurl}}}</script>');
                arr.push('\n<script src="'+static_path+'/js/require2.1.11.js"></script>');
                arr.push('\n<script src="'+static_path+'/js/base.js"></script>\n');

                //script内容会被cheerio转义
                arr.push('<div ng-app="app">\n'+self.chunk(name)+'\n<script>{{{script}}}</script>\n</div>');

                self.getData(function(data){
                    var content = mustache.render(arr.join(""), _.extend(data,obj));
                    res.send(content);
                });
            });
        }else{
            //默认方式输出
            json = this.getResource(this.pathname,sync);

            var static_path = config.host.static;
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