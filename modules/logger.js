/**
 * Created by Samuel on 14-5-22.
 *
 * logger wrapper module
 */


var winston = require('winston');
var config = require('../config');

var myLogLevels = {
/*
    levels: {
        debug: 10,
        info: 20,
        warn: 30,
        error: 40,
        fatal: 100
    },
*/

    colors: {
        debug: 'gray',
        info: 'black',
        warn: 'yellow',
        error: 'red',
        fatal: 'orange'
    }
};
winston.addColors(myLogLevels.colors);
var logger = new (winston.Logger)({
    //levels: myLogLevels.levels,
    //colors: myLogLevels.colors,
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true, level: 'debug', colorize: true }),
        new winston.transports.File({ filename: config.logDebug, json: false, level:'info' })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true, colorize: true }),
        new winston.transports.File({ filename:config.logException, json: false })
    ],
    exitOnError: false
});

module.exports = logger;