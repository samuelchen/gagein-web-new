require(['ngapp','util'],function (app,u) {
    app.controller('news',function($scope,$rootScope,$location,getJSON,shareObject) {
        $scope.$root.$on('removebookmark',function(event,n){
            var item = u._.filter($scope.items,function(item){
                return item.newsid == n.newsid
            })[0];
            item.liked = false;
        });

        $scope.$root.$on('updatenewbookmark',function(event){
            if(!shareObject.bookmarks || !shareObject.news ){
                return ;
            }
            var ids = [];
            u._.each(shareObject.bookmarks,function(item){
                ids.push(item.newsid);
            });

            u._.each($scope.items,function(item){
                item.liked = ~u._.indexOf(ids,item.newsid) ? true : false;
            });
        });


        $scope.$on('newupdate',function(){
            shareObject.news = $scope.items;
            $scope.$root.$emit('updatenewbookmark');
        });
        $scope.$emit('newupdate');

        $rootScope.$on('$locationChangeSuccess', function(){
            //初始化不调用请求
            if(!$scope.init_noajax) {
                $scope.init_noajax = true;
                return;
            }
            var filters = $location.search();
            getJSON('/home/news/getNewsList', _.extend(filters,{
                access_token : shareObject.token || 'd01cd9e3d9ffec757d98bb4346f1c7b1',
                page : 1,
                pageflag : 0,
                pagetime :0 ,
                newsid : 0,
                orgid : 1231041 //sina
            }),function(data){
                //$scope.items = $scope.items.concat(data)
                $scope.items = data
                $scope.$emit('newupdate');
            })
        });

        $scope.bookmark = function(index){
            var item = $scope.items[index];
            if(!item.liked){
                $scope.$root.$emit('addbookmark', item,function(){
                    $scope.items[index].liked = true;
                });
            }else{
                $scope.$root.$emit('removebookmark', item,function(){
                    $scope.items[index].liked = false;
                });
            }
        }
    });

});