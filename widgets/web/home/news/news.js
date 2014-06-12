require(['ngapp','util'],function (app,u) {
    app.controller('news',function($scope,$rootScope,$location,getJSON,shareObject) {
        $scope.$root.$on('removebookmark',function(event,id){
            var item = u._.filter($scope.items,function(item){
                return item.id == id
            })[0];
            item.isSelected = false;
        });

        $scope.$root.$on('updatenewbookmark',function(event){
            if(!shareObject.bookmarks || !shareObject.news  ){
                return ;
            }
            var ids = [];
            u._.each(shareObject.bookmarks,function(item){
                ids.push(item.id);
            });

            u._.each($scope.items,function(item){
                item.isSelected = ~u._.indexOf(ids,item.id) ? true : false;
            });
        });


        $scope.$on('newupdate',function(){
            shareObject.news = $scope.items;
            $scope.$root.$emit('updatenewbookmark');
        });
        $scope.$emit('newupdate');
        $rootScope.$on('$locationChangeSuccess', function(){
            var filters = $location.search();
            getJSON('/home/news/getNewsList',filters,function(data){
                $scope.items = $scope.items.concat(data)
                $scope.$emit('newupdate');
            })
        });


        $scope.bookmark = function(index){
            var item = $scope.items[index];
            if(!item.isSelected){
                $scope.$root.$emit('addbookmark', item.id,function(){
                    $scope.items[index].isSelected = true;
                });
            }else{
                $scope.$root.$emit('removebookmark', item.id,function(){
                    $scope.items[index].isSelected = false;
                });
            }
        }
    });

});