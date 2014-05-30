require(['ngapp','util'],function (app,u) {
    app.controller('filter',function($scope,$location,$rootScope,$http) {
        var _getFilter = function(){
            var filter,defaultFilter = {
                trigger : 0,
                relevance : 0,
                search : "hello"
            };
            filter = u._.isEmpty($location.search()) ?   defaultFilter : $location.search();
            return filter;
        }

        var filter = _getFilter();
        $scope.filter = filter;

        $scope.$watch( "filter.trigger", function(val) {
            filter.trigger = val;
            $location.search(filter);
        });

//        $scope.$watch( "filter.search", function(val) {
//            filter.search = val;
//            $location.search(filter);
//        });

        $scope.$watch( "filter.relevance", function(val) {
            filter.relevance = val;
            $location.search(filter);
        });

        $scope.searchIndex = -1;
        $scope.searchKeyPress = function(e){
            var ele = e.target;
            var keycode = e.keyCode;

            if(keycode == 13){
                if(~$scope.searchIndex){
                    var listele = angular.element(u.$(".filters-search-suggest"));
                    var ele = angular.element(listele.children()[$scope.searchIndex]);
                    $scope.filter.search = ele.text();
                }
                filter.search = $scope.filter.search;
                $location.search(filter);
                $scope.searchlist = ""
            }else if(keycode == 38 || keycode == 40){
                var listele = angular.element(u.$(".filters-search-suggest"));
                var len = listele.children().length;
                var val;
                switch (keycode){
                    case 38:
                        $scope.searchIndex--;
                        val = $scope.searchIndex;
                        if(val < 0){
                            val = len - 1;
                        }
                        break;
                    case 40:
                        $scope.searchIndex++;
                        val = $scope.searchIndex;
                        if(val >= len){
                            val = 0;
                        }
                        break;
                }
                $scope.searchIndex = val;
                listele.children().removeClass("selected");
                angular.element(listele.children()[val]).addClass("selected");
            }
        };

        $scope.searchListIn = function(ele){
            ele = angular.element(ele);
            ele.children().removeClass("selected");
            ele.addClass("selected");
        }

        $scope.searchListOut = function(ele){
            ele = angular.element(ele);
            ele.removeClass("selected");
        }

        $scope.searchListClick = function(ele){
            ele = angular.element(ele);
            $scope.filter.search = ele.text();
            filter.search = $scope.filter.search;
            $scope.searchlist = "";
            $location.search(filter);
        }

        $scope.searchBlur = function(){
            filter.search = $scope.filter.search;
            $location.search(filter);
        };

        $scope.searchChange = function(){
            var key = $scope.filter.search;
            key = u._.trim(key);
            if(key){
                var p = $http({
                    method: 'GET',
                    url: 'home/method/getSearchList',
                    params : {key : key},
                    cache : true
                });
                p.success(function(data){
                    $scope.searchIndex = -1;
                    $scope.searchlist = data;
                });
            }else{
                $scope.searchlist = "";
            }
        };

        $scope.filter_triggers_open = true;
        $scope.filter_relevance_open = false;
        $scope.open = function(e,type){
            if(!$scope["filter_" + type + "_open"]){
                $scope["filter_" + type + "_open"] = true;
            }else{
                $scope["filter_" + type + "_open"] = false;
            }
        };

        $rootScope.$on('$locationChangeSuccess', function(){
            filter = _getFilter();
            $scope.filter = filter;
        });
    });

});
