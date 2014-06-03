require(['ngapp',"util"],function (app,u) {

    app.controller('bookmarks',function($scope,getJSON,shareObject) {
        getJSON('getBookmarkList',function(data){
            $scope.bookmarks = data.bookmarks;
            if( $scope.bookmarks.items.length > 3){
                $scope.bookmark_more = true;
            }else{
                $scope.bookmark_more = false;
            }

            shareObject.bookmarks = data.bookmarks;
            $scope.$root.$emit('updatenewbookmark');
        })

        $scope.more = function(ele){
            $scope.bookmark_more = false;
            $scope.bookmark_open = true;
            $scope.bookmark_more_hasclick = true;
        }

        $scope.removeBookmark = function(index){
            getJSON('removeBookmark',{id : $scope.bookmarks.items[index].id},function(data){
                var item = $scope.bookmarks.items.splice(index,1);

                $scope.$root.$emit('removebookmark',item[0].id)
            })
        };

        $scope.$root.$on('addbookmark', function(event,id,cb){

            var item = u._.find($scope.bookmarks.items,function(item){
                return item.id == id
            });

            if(!item){
                getJSON('addBookmark',{id : id},function(data){
                    if(!_.isEmpty(data)){
                        $scope.bookmarks.items.unshift(data);
                        if($scope.bookmarks.items.length > 3 && !$scope.bookmark_more_hasclick){
                            $scope.bookmark_more = true;
                        }
                        cb();
                    }
                })
            }
        });

        $scope.$root.$on('removebookmark',function(event,id,cb){
            getJSON('removeBookmark',{id : id},function(data){
                $scope.bookmarks.items = u._.reject($scope.bookmarks.items,function(item){ return item.id == data.id });
                if($scope.bookmarks.items.length <= 3){
                    $scope.bookmark_more = false;
                }
                cb();
            })
        });
    });
});