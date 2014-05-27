require(['globle'],function (G) {
    G.app.controller('filter',function DemoController($scope,$location) {
        var filter = {
            trigger : 5,
            relevance : 1,
            search : "hello"
        };
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
    });
});







