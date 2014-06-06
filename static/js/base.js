var REQUIREJS_BASE_URL;
require.config({
    baseUrl: REQUIREJS_BASE_URL,

    paths: {
        angular : "common/core/angular1.2.16",
        "angular-route" : "common/core/angular-route",
        "angular-resource" : "common/core/angular-resource",
        underscore : "common/core/underscore",
        "underscore.string" : "common/core/underscore.string",
        ngapp : "common/core/ngapp",
        "util" : "common/core/util",
        sizzle : "common/core/sizzle"
    },
    shim: {
        angular : {
            exports: 'angular'
        },
        "angular-route":{
            deps: ['angular']
        },
        'angular-resource': {
            deps:['angular']
        }
    }
});

require(['angular','angular-route','angular-resource'],function($){
    console.log("angular init success...")
});

require(['ngapp'],function($){
    console.log("ngapp init success...")
});


G = {};
G.bigpipe = function(obj){
    var oldEle = document.getElementById(obj.id);
    var div = document.createElement("div");
    div.innerHTML = obj.html;
    var newEle = div.children[0];
    oldEle.parentNode.replaceChild(newEle,oldEle);

    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    //<link type="text/css" href="http://static.gagein.com/css/web/member.css" rel="stylesheet">
    var css = document.createElement("link");
    css.setAttribute("type","text/css");
    css.setAttribute("rel","stylesheet");


    head.appendChild(js);
    head.appendChild(css);
    css.setAttribute("href",obj.css);
    js.setAttribute("src",obj.js);
}

