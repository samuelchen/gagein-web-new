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
                $scope.news = data.news;
            });
        });

        $scope.bookmark = function(index){
            var item = $scope.news.items[index];
            if(!item.isSeleted){
                $scope.$root.$emit('addbookmark', item.id,function(){
                    $scope.news.items[index].isSelected = true;
                });
            }else{
                $scope.$root.$emit('removebookmark', item.id,function(){
                    $scope.news.items[index].isSelected = false;
                });
            }
        }

        $scope.$root.$on('removebookmark',function(event,id){
            var item = u._.filter($scope.news.items,function(item){
                return item.id == id
            })[0];
            item.isSelected = false;
        });

        $scope.$root.$on('updatenewbookmark',function(event,data){
            var ids = [];
            u._.each(data,function(d){
                ids.push(d.id);
            });

            u._.each($scope.news.items,function(item){
                item.isSelected = ~ids.indexOf(item.id) ? true : false;
            });
        });
    });

});