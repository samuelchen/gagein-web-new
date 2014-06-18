require(['ngapp','util'],function (app,u) {
    app.controller('header',function($scope,$location,$rootScope,post,shareObject) {
        $scope.mail = "cchen@gagein.com";
        $scope.password = "83773835";

        $scope.login = function(){
            var mail = $scope.mail;
            var pass = $scope.password;

            post("/common/header/login" , {
                mail : mail ,
                password : pass
            },function(d){
                if(d.status == "1"){
                    $scope.login_state = true;
                    $scope.user = d.data;
                    shareObject.token = d.data.access_token;
                }else{
                    console.log(d.msg);
                }
            })
        }

        $scope.login();

//        $scope.logout = function(){
//            var mail = $scope.mail;
//            post("/common/header/logout" , {
//                mail : mail
//            },function(data){
//                if(data.status == "1"){
//                    $scope.login_state = false;
//                }else{
//                    console.log(data.msg);
//                }
//            })
//        }
    })
})