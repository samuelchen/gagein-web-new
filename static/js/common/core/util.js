define(["underscore","underscore.string","sizzle"],function (_,_s,$) {
    var util = {};

    //integration underscore
    _.str = _s;
    _.mixin(_.str.exports());
    _.str.include('Underscore.string', 'string');
    util._ = _;
    util.$ = function(){
        return angular.element($.apply(null,[].slice.apply(arguments)));
    };

    return util;
})
