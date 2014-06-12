define(['angular'],function (ng) {
    var app = ng.module("app",[]);

    app.config(function($interpolateProvider) {
        $interpolateProvider.startSymbol('{%');
        $interpolateProvider.endSymbol('%}');
    });

    app.factory('getJSON',function($http,$location) {
        return function getJSON(api,params,callback){
            if(typeof params == "function"){
                callback = params;
                params = {};
            }
            //home/method/getSearchList

            var p = $http({
                method: 'GET',
                url: api,
                params : params,
                cache : true
            });
            p.success(function(data){
                callback(data);
                p = null;
            });
        }

    });

    app.factory('shareObject',function() {
        return {};
    })


    app.directive('ajax', function() {
        return {
            restrict: 'AE',
            replace: true,
            template: '<p style="background-color:{{color}}">Hello World',
            link: function(scope, elem, attrs) {
                elem.bind('click', function() {
                    elem.css('background-color', 'white');
                    scope.$apply(function() {
                        scope.color = "white";
                    });
                });
                elem.bind('mouseover', function() {
                    elem.css('cursor', 'pointer');
                });
            }
        };
    });


//    //过滤安全验证
//    app.filter('to_trusted', ['$sce', function ($sce) {
//        return function (text) {
//            return $sce.trustAsHtml(text);
//        };
//    }]);
    return app;
})
