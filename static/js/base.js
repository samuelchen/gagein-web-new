require.config({
    baseUrl: 'http://static.gagein.com/js/',

    paths: {
        angular : "common/core/angular1.2.16",
        underscore : "common/core/underscore",
        globle : "common/core/globle"
    },
    shim: {
        angular : {
            exports: 'angular'
        },
        underscore : {
            exports: 'underscore'
        }

    }
});

