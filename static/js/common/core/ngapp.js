define(['angular','angular-route'],function (ng) {
    var app = ng.module("app",["ngRoute"]);
//    if(app._){
//        throw new Error("app._ Already in use");
//    }else{
//        _.str = _s;
//        _.mixin(_.str.exports());
//        _.str.include('Underscore.string', 'string');
//        app._ = _;
//    }

    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{%');
        $interpolateProvider.endSymbol('%}');
    });
    
    //过滤安全验证
    app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    return app;
})
