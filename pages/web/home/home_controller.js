/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-5-21
 * Time: 下午2:33
 * To change this template use File | Settings | File Templates.
 */
var base = require("./../../../controller");



module.exports = {
    getPageContent : function(callback){
        base.getPageContent(__dirname , function(tpl){
            var data = {
                title : "gagein web prototype"
            }
            callback(base.render(tpl,data));
        });
    },
    //命名规则 ， get +　widgetname(首字母大写)　＋　Content
    getBookmarksContent : function(widgetname , pagename ,callback){
        base.getWidgetContent(widgetname, pagename  , function(tpl){
            var data = {
                title : "gagein web prototype"
            }
            callback(base.render(tpl,data));
        });
    },
    getFiltersContent : function(widgetname , pagename ,callback){
        base.getWidgetContent(widgetname, pagename  , function(tpl){
            var data = {
                title : "gagein web prototype"
            }
            callback(base.render(tpl,data));
        });
    },
    getHeaderContent : function(widgetname , pagename ,callback){
        base.getWidgetContent(widgetname, pagename  , function(tpl){
            var data = {
                title : "gagein web prototype"
            }
            callback(base.render(tpl,data));
        });
    }
}

