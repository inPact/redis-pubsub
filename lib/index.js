'use strict';
const logger = require('./logger');
const redis = require('./redis_adapter');
const Publisher = require('./publisher');
const Subscriber = require('./redis_subscriber');
const channel = require('./channel');

module.exports = function (options = {}) {
    setupLogging(options);

    let redisPub = redis.createClient(options);
    let redisSub = redisPub.duplicate(); // TODO: separate connection per subscriber!
    let publisher = new Publisher(redisPub);

    return {
        publish: publisher.publish.bind(publisher),
        subscribe: function (group) {
            return new Subscriber(redisSub, channel.getPattern(group));
        }
    }
};

function setupLogging(options) {
    if (options.logger)
        logger.set(options.logger);

    else if (options.logLevel)
        logger.configure(log => log.setLevel(options.logLevel, false));
}