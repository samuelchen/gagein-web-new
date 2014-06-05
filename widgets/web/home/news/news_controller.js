var base = require("./../../../controller_abstract");
var _ = require("underscore");
var config = require('./../../../config');
var path = require('path');
var logger = require('../../../modules/logger');
var api = require('../../../modules/api');


module.exports = _.extend(abstract,{
    //type : 0-ajax , 1-html , 2-html+ajax , 3-bigpipe
    //params : 请求后端的参数
    getContentJSON : function(type,params){
        var data = {};

        switch(type){
            case "2" :
            case "1" :
                data = {};
            case "0" :
                //获取资源

                //获取模板
                //获取数据
                //拼装模板

                //返回数据

                break;
            //bigpipe
            case "3" :
                //返回数据
                //{html:'<div id="bigpipe-home-"></div>'}
                break;
        }
    }
});