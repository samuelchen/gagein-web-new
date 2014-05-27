/**
 * Created by Samuel on 14-5-22.
 *
 * configurations
 */

var path = require('path');

exports.isDebug = true;

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
    static: 'static.gagein.com',
    protocol: 'http'
}
