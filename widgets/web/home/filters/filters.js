require(['ngapp','util'],function (app,u) {
    app.controller('filter',function($scope,$location,$rootScope,getJSON) {
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

        $scope.$watch( "filter.relevance", function(val) {
            filter.relevance = val;
            $location.search(filter);
        });

        $scope.searchKeyPress = function(e){
            var ele = e.target;
            var keycode = e.keyCode;

            if(keycode == 13){
                if(~$scope.searchIndex){
                    $scope.filter.search = $scope.search[$scope.searchIndex].key;
                }
                filter.search = $scope.filter.search;
                $location.search(filter);
                $scope.search = ""
            }else if((keycode == 38 || keycode == 40) && $scope.search.length > 0){
                var len = $scope.search.items.length
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
            }
        };

        $scope.searchListIn = function(index){
            $scope.searchIndex = index;
        }

        $scope.searchListOut = function(index){
            $scope.searchIndex = -1;
        }

        $scope.searchListClick = function(index){
            var item = $scope.search[index];
            $scope.filter.search = item.key;
            $scope.search = "";
            filter.search = $scope.filter.search;
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
                getJSON('/home/filters/getSearchList',{key : key},function(data){
                    $scope.searchIndex = -1;
                    $scope.search = data;
                })
            }else{
                $scope.search = "";
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
