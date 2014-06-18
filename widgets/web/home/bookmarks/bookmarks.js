require(['ngapp',"util"],function (app,u) {

    app.controller('bookmarks',function($scope,post,shareObject) {
        post('/home/bookmarks/getBookmarkList',{
            page : 1,
            orgid : 1231041,
            note : "",
            tagid : 1,
            access_token : shareObject.token || 'd01cd9e3d9ffec757d98bb4346f1c7b1'
        },function(data){
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
            $scope.$root.$emit('removebookmark',$scope.items[index])
        };

        $scope.$root.$on('addbookmark', function(event,n,cb){
            var item = u._.find($scope.items,function(item){
                return item.newsid == n.newsid
            });

            if(!item){
                post('/home/bookmarks/addBookmark',{
                    access_token : shareObject.token || 'd01cd9e3d9ffec757d98bb4346f1c7b1',
                    newsid : n.newsid
                },function(data){
                    if(data.status == "1"){
                        $scope.items.unshift(n);
                        if($scope.items.length > 3 && !$scope.bookmark_more_hasclick){
                            $scope.bookmark_more = true;
                        }
                        cb();
                    }
                })
            }
        });

        $scope.$root.$on('removebookmark',function(event,n,cb){
            post('/home/bookmarks/removeBookmark',{
                access_token : shareObject.token || 'd01cd9e3d9ffec757d98bb4346f1c7b1',
                newsid : n.newsid
            },function(data){
                if(data.status == "1"){
                    $scope.items = u._.reject($scope.items,function(item){ return item.newsid == n.newsid });
                    if($scope.items.length <= 3){
                        $scope.bookmark_more = false;
                    }
                    cb && cb();
                }
            })
        });
    });
});