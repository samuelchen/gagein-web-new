require(['ngapp',"util"],function (app,u) {
    app.controller('bookmarks',function($scope,$http) {
        var p = $http({
            method: 'GET',
            url: '/home/method/getBookmarkList',
            cache : true
        });
        p.success(function(data){
            $scope.bookmarks = data.bookmarks;
            $scope.$root.$emit('updatenewbookmark', data.bookmarks.items);
        });

        $scope.removeBookmark = function(index){
            $scope.bookmarks.items.splice(index,1);
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