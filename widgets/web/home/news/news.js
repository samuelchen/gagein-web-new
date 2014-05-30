require(['ngapp','util'],function (app,u) {
    app.controller('news',function($scope,$rootScope,$location,$http) {

        $rootScope.$on('$locationChangeSuccess', function(){
            var filters = $location.search();
            var p = $http({
                method: 'GET',
                url: '/home/method/getNewsList',
                params : filters,
                cache : true
            });
            p.success(function(data){
                $scope.newslist = data;
            });
        });

        $scope.bookmark = function(ele){
            var bid = angular.element(ele).attr("bid");
            var state = angular.element(ele).hasClass("selected");
            if(!state){
                $scope.$root.$emit('addbookmark', bid,function(){
                    angular.element(ele).addClass("selected");
                });
            }else{
                $scope.$root.$emit('removebookmark',bid,function(){
                    angular.element(ele).removeClass("selected");
                });
            }
        };

        $scope.$root.$on('removebookmark',function(event,id){
            u.$("[bid="+id+"]").removeClass("selected");
        });

        $scope.$root.$on('updatenewbookmark',function(event,data){
            u.$("[bid]").removeClass("selected");
            _.each(data,function(d){
                u.$("[bid="+ d.id+"]").addClass("selected");
            })
        });
    });

    app.directive('delegate', function($parse){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var selector = attrs.selector;
                var bookmark = $parse(attrs.delegate);
                element.on('click' , function(e){
                    if(e.target.getAttribute('bid')){
                        bookmark(scope)(e.target);
                    }
                });
            }
        };
    });
});