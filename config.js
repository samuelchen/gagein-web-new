/**
 * Created by Samuel on 14-5-22.
 *
 * configurations
 */

var path = require('path');

exports.rootDir = __dirname;
exports.logDebug =  path.join(__dirname, 'debug.log');
exports.logException = path.join(__dirname, 'exception.log');
exports.isDebug = true;
