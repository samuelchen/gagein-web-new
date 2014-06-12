var REQUIREJS_BASE_URL;
require.config({
    baseUrl: REQUIREJS_BASE_URL,

    paths: {
        angular : "common/core/angular1.2.16",
        underscore : "common/core/underscore",
        "underscore.string" : "common/core/underscore.string",
        ngapp : "common/core/ngapp",
        "util" : "common/core/util",
        sizzle : "common/core/sizzle"
    },
    shim: {
        angular : {
            exports: 'angular'
        }
    }
});

//require(['angular','angular-route','angular-resource'],function(){
//    console.log("angular init success...")
//});
//require(['ngapp'],function(){
//    console.log("ngapp init success...")
//});



//注册DOMReady事件的函数


var head = document.getElementsByTagName("head")[0];

var isIE=navigator.userAgent.match(/MSIE (\d)/i);
isIE=isIE?isIE[1]:undefined;

var G = {
    domready : function (fn){
        var s=arguments,i=s.length;
        if(isIE<9){
            var itv = setInterval(function(){
                try{
                    document.documentElement.doScroll();
                    clearInterval(itv);
                    fn && fn();
                }catch(e){};
            },1);
        }
        else{
            document.addEventListener("DOMContentLoaded",function(){
                fn && fn();
            });
        }
    },
    scripts : [] ,
    done : function(){
        var self = this;
        this.domready(function(){
            var html = document.getElementsByTagName("html")[0];
            for(var i =0 , len = self.scripts.length ; i < len ; i++){
                var js = document.createElement("script");
                html.appendChild(js);
                js.src = self.scripts[i];
            }
        })
    },
    bigpipe : function(obj){

        var css = document.createElement("link");
        css.setAttribute("type","text/css");
        css.setAttribute("rel","stylesheet");
        head.appendChild(css);
        css.setAttribute("href",obj.css);

        this.scripts.push(obj.js);
//        var js = document.createElement("script");
//        head.appendChild(js);
//        js.src = obj.js;


        var oldEle = document.getElementById(obj.id);
        var div = document.createElement("div");
        div.innerHTML = obj.html;
        var newEle = div.children[0];
        oldEle.parentNode.replaceChild(newEle,oldEle);

    }
};




