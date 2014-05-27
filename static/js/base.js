require.config({
    baseUrl: 'http://static.gagein.com/js/',

    paths: {
        angular : "angular1.2.16",
        globle : "common/core/globle"
    },
    shim: {
        angular : {
            exports: 'angular'
        }
    }
});

