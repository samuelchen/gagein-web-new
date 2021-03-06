/**
 * Created by Samuel on 14-5-22.
 *
 * configurations
 */

var path = require('path');
var i18n = require('i18n');

exports.isDebug = false;

// physical path
exports.dir = {
    root: __dirname
}

// log related
exports.log = {
    path: {
        debug:  path.join(__dirname, 'debug.log'),
        exception: path.join(__dirname, 'exception.log')
    },
    level: {
        console: 'debug',
        file: 'info'
    }
}

// url mapping related.
exports.host = {
    name: 'localhost',
    static: 'localhost/static',
    protocol: 'http',
    api: 'http://www.gagein.com/svc'
}

// api related
exports.api = {
    appcode: '09ad5d624c0294d1',
    hostname: 'localhost',
    port: '8080',
    root: '/svc',
    protocol : 'http'
}

// i18n configures
i18n.configure({
    locales:['en', 'zh'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '/locales'),
    cookie: 'locale'
});
