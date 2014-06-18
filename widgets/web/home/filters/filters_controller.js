var _ = require("underscore");
var logger = require('./../../../../modules/logger');
var api = require('./../../../../modules/api');
var controller = require('./../../../../controller');

module.exports = _.extend(_.clone(controller),{
    pathname : __dirname,
    getSearchList : function(req,res){
        var data = api.getSearchList(req.query.key);
        res.send(data);
    }
});