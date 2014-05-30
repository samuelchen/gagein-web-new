var REQUIREJS_BASE_URL;
require.config({
    baseUrl: REQUIREJS_BASE_URL,

    paths: {
        angular : "common/core/angular1.2.16",
        "angular-route" : "common/core/angular-route",
        underscore : "common/core/underscore",
        "underscore.string" : "common/core/underscore.string",
        ngapp : "common/core/ngapp",
        "util" : "common/core/util",
        sizzle : "common/core/sizzle"
    },
    shim: {
        angular : {
            exports: 'angular'
        },
        "angular-route":{
            deps: ['angular']
        }
    }
});

