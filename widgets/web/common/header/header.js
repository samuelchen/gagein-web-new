require(['ngapp','util'],function (app,u) {
    app.controller('header',function($scope,$location,$rootScope,post) {
        $scope.username = "cchen@gagein.com";
        $scope.password = "83773835";

        $scope.login = function(){
            var name = $scope.username;
            var pass = $scope.password;

            post("/common/header/login" , {
                username : name ,
                password : pass
            },function(data){
                if(data.status == "1"){
                    $scope.login_state = true;
                }else{
                    console.log(data.msg);
                }
            })
        }

        $scope.logout = function(){
            var name = $scope.username;
            post("/common/header/logout" , {
                username : name
            },function(data){
                if(data.status == "1"){
                    $scope.login_state = false;
                }else{
                    console.log(data.msg);
                }
            })
        }
    })
})