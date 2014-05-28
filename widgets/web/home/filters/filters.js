require(['globle'],function (G) {
    G.app.controller('filter',function($scope,$location,$rootScope) {
        var _getFilter = function(){
            var filter,defaultFilter = {
                trigger : 0,
                relevance : 0,
                search : "hello"
            };
            filter = G._.isEmpty($location.search()) ?   defaultFilter : $location.search();
            return filter;
        }

        var filter = _getFilter();
        $scope.filter = filter;

        $scope.$watch( "filter.trigger", function(val) {
            filter.trigger = val;
            $location.search(filter);
        });

        $scope.$watch( "filter.search", function(val) {
            filter.search = val;
            $location.search(filter);
        });

        $scope.$watch( "filter.relevance", function(val) {
            filter.relevance = val;
            $location.search(filter);
        });

        $scope.is_triggers_open = true;
        $scope.is_relevance_open = false;
        $scope.open = function(e,type){
            if(!$scope["is_" + type + "_open"]){
                $scope["is_" + type + "_open"] = true;
            }else{
                $scope["is_" + type + "_open"] = false;
            }
        }

        $rootScope.$on('$locationChangeSuccess', function(){
            filter = _getFilter();
            $scope.filter = filter;
        });
    });

});







