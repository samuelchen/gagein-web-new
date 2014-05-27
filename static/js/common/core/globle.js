define(['angular',"underscore"],function (ng,_) {


    return _.extend(ng , {
        app : ng.module("app",[]),
        _ : _
    });
})
