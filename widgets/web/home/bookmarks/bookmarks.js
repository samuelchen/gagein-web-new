require(['ngapp',"util"],function (app,u) {
    app.controller('bookmarks',function($scope,$http) {
        var p = $http({
            method: 'GET',
            url: '/home/method/getBookmarkList',
            cache : true
        });
        p.success(function(data){
            $scope.bookmarks = data.bookmarks;
            if( $scope.bookmarks.items.length > 3){
                $scope.bookmark_more = true;
            }else{
                $scope.bookmark_more = false;
            }
            var ul = u.$(".news-list ul");
            var time = setInterval(function(){
                if(ul.html()){
                    $scope.$root.$emit('updatenewbookmark', data.bookmarks.items);
                }
            },0)
        });

        $scope.more = function(ele){
            $scope.bookmark_more = false;
            $scope.bookmark_open = true;
            $scope.bookmark_more_hasclick = true;
        }

        $scope.removeBookmark = function(index){

            var p = $http({
                method: 'GET',
                url: '/home/method/removeBookmark',
                params : {id : $scope.bookmarks.items[index].id},
                cache : true
            });
            p.success(function(data){
                var item = $scope.bookmarks.items.splice(index,1);
                $scope.$root.$emit('removebookmark',item[0].id)
            });
        };

        $scope.$root.$on('addbookmark', function(event,id,cb){
            var ele = u.$("*[bmid="+id+"]");
            if(ele.length == 0){
                var p = $http({
                    method: 'GET',
                    url: '/home/method/addBookmark',
                    params : {id : id},
                    cache : true
                });
                p.success(function(data){
                    if(!_.isEmpty(data)){
                        $scope.bookmarks.items.unshift(data);
                        if($scope.bookmarks.items.length > 3 && !$scope.bookmark_more_hasclick){
                            $scope.bookmark_more = true;
                        }
                        cb();
                    }
                });
            }
        });

        $scope.$root.$on('removebookmark',function(event,id,cb){
            var p = $http({
                method: 'GET',
                url: '/home/method/removeBookmark',
                params : {id : id},
                cache : true
            });
            p.success(function(data){
                $scope.bookmarks.items = u._.reject($scope.bookmarks.items,function(item){ return item.id == data.id });
                cb();
            });
        });
    });
});