require(['ngapp','util'],function (app,u) {
    app.controller('news',function($scope,$rootScope,$location,getJSON,shareObject) {

        $rootScope.$on('$locationChangeSuccess', function(){
            var filters = $location.search();
            $scope.news = "";
            getJSON('getNewsList',filters,function(data){
                $scope.news = data.news;
                shareObject.news = data.news;
                $scope.$root.$emit('updatenewbookmark');
            })
        });

        $scope.bookmark = function(index){
            var item = $scope.news.items[index];
            if(!item.isSelected){
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

        $scope.$root.$on('updatenewbookmark',function(event){
            if(!shareObject.bookmarks || !shareObject.news  ){
                return ;
            }
            var ids = [];
            u._.each(shareObject.bookmarks.items,function(item){
                ids.push(item.id);
            });

            u._.each($scope.news.items,function(item){
                item.isSelected = ~u._.indexOf(ids,item.id) ? true : false;
            });
        });
    });

});