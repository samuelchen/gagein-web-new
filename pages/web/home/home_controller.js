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
//var cons = require('consolidate');
//app.engine('html', cons.mustache);
var engine = require('mustache');

var query = require('cheerio');

//router 规则映射对应的文件处理



//console.log(process.argv);
//console.log(__dirname);
//console.log(fs.readdirSync(__dirname));
var findResource = function(pathname){
    //查找资源文件
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




app.get('/home', function(req, res){
    var $,widgets;

    async.waterfall([
        function(callback){
            //获取资源
            //console.log(pagePath);
            var json = {};
            json = findResource(__dirname);

            var pathname = __dirname + "\\"+ path.basename(__dirname) + ".html";
            fs.readFile(__dirname + "\\"+ path.basename(__dirname) + ".html", 'utf8', function(err, data) {
                $ = query.load(data);
                //$($("widget")[0]).replaceWith($("<div>eier</div>"));
                widgets = $("widget");
                //console.log($.html());
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

                console.log("get resources done!");
                callback(null,json);
            })
        },
        function(resource,callback){
            //对资源分类
            //console.log(resource);
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
                //console.log(arr);
                return arr;
            }

            var css = getFileByType("css");
            var js = getFileByType("js");
            var html = getFileByType("html");

            console.log("Resource classification done!");
            callback(null,{
                css : css,
                js : js,
                html : html
            });
        },
        function(json,callback){
            //处理js
            var jscode = json.js.join("\\n");
            //处理css
            var csscode = json.css.join("\\n");
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
                            //console.log(parent.html())
                            //console.log($.html())
                            callback();
                        })
                    }
                })
            }, 2);

            _.each(widgets,function(widget,index){

                (function(idx){
                    q.push({widget: widget}, function (err) {
                        console.log('finished processing : ' + $(widget).text());
                    })
                })(index)

            });

            q.drain = function() {
                $("head").append(csscode);
                $("body").after(jscode);
                console.log("template processing done");
                callback(null,$.html());
            }
        },
        function(resource,callback){
            //获取数据
            //console.log(resource);
            console.log("data processing done");
            callback(null,{
                tpl : resource,
                data : {
                    title : "gagein web prototype"
                }
            })
        },
        function(json,callback){
            //渲染页面
            var html = engine.render(json.tpl,json.data);
            callback(null,html);
        }
    ], function(err, values) {
        res.send(values);
    });
});

app.listen(3000);

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



