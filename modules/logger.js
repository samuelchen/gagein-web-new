/**
 * Created by Samuel on 14-5-22.
 *
 * logger wrapper module
 * expose debug, info, warn, error, fatal functions.
 */


var winston = require('winston');
var config = require('../config');

/*
var myLogLevels = {

    levels: {
        debug: 10,
        info: 20,
        warn: 30,
        error: 40,
        fatal: 100
    },


    colors: {
        debug: 'gray',
        info: 'black',
        warn: 'yellow',
        error: 'red',
        fatal: 'orange'
    }
};
*/
//winston.addColors(myLogLevels.colors);
var logger = new (winston.Logger)({
    //levels: myLogLevels.levels,
    //colors: myLogLevels.colors,
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true, level: config.log.level.console, colorize: true }),
        new winston.transports.File({ filename: config.log.path.debug, json: false, level: config.log.level.file })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true, colorize: true }),
        new winston.transports.File({ filename:config.log.path.exception, json: false })
    ],
    exitOnError: false
});

module.exports = logger;