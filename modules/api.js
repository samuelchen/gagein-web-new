/**
 * Created by Samuel on 14-5-28.
 *
 * the GageIn API wrapper
 */

var config = require('../config');
var logger = require('./logger');
var _ = require('underscore');

// the api mappings
var api_mapping = {
    login: '/login',
    register: '/register',
    followedCompanies: '/list/companies_detail'
}

logger.debug('---------- api ----------');
_.each(api_mapping, function(entry){
    // "this" means "module.exports" (3rd argument)

    logger.debug(entry.name);
    logger.debug(entry.value);
    logger.debug(this);
}, module.exports);
logger.debug('---------- api end ----------');




