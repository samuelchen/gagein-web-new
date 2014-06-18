var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    login : function(req,res){
        var mem_email = req.body.mail;
        var mem_password = req.body.password;

        api.login({
            mem_email : mem_email,
            mem_password : mem_password
        },function(data){
            res.send(data);
        })
    }
});