require(['ngapp',"util"],function (app,u) {

    app.controller('bookmarks',function($scope,getJSON,shareObject) {
        getJSON('/home/bookmarks/getBookmarkList',function(data){
            $scope.items = data;
            if( $scope.items.length > 3){
                $scope.bookmark_more = true;
            }else{
                $scope.bookmark_more = false;
            }

            shareObject.bookmarks = data;
            $scope.$root.$emit('updatenewbookmark');
        })

        $scope.more = function(ele){
            $scope.bookmark_more = false;
            $scope.bookmark_open = true;
            $scope.bookmark_more_hasclick = true;
        }

        $scope.removeBookmark = function(index){
            getJSON('/home/bookmarks/removeBookmark',{id : $scope.items[index].id},function(data){
                var item = $scope.items.splice(index,1);

                $scope.$root.$emit('removebookmark',item[0].id)
            })
        };

        $scope.$root.$on('addbookmark', function(event,id,cb){

            var item = u._.find($scope.bookmarks,function(item){
                return item.id == id
            });

            if(!item){
                getJSON('/home/bookmarks/addBookmark',{id : id},function(data){
                    if(!_.isEmpty(data)){
                        $scope.items.unshift(data);
                        if($scope.items.length > 3 && !$scope.bookmark_more_hasclick){
                            $scope.bookmark_more = true;
                        }
                        cb();
                    }
                })
            }
        });

        $scope.$root.$on('removebookmark',function(event,id,cb){
            getJSON('/home/bookmarks/removeBookmark',{id : id},function(data){
                $scope.items = u._.reject($scope.items,function(item){ return item.id == data.id });
                if($scope.items.length <= 3){
                    $scope.bookmark_more = false;
                }
                cb && cb();
            })
        });
    });
});