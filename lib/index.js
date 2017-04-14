'use strict';
const logger = require('./logger');
const redis = require('./redis_adapter');
const Publisher = require('./publisher');
const Subscriber = require('./redis_subscriber');
const channel = require('./channel');

module.exports = function (options = {}) {
    setupLogging(options);

    let redisClient = redis.createClient(options);
    let publisher = new Publisher(redisClient);

    return {
        publish: publisher.publish.bind(publisher),
        subscribe: function (group) {
            return new Subscriber(redisClient.duplicate()).subscribe(channel.getPattern(group));
        },
        subscribeAsync: function (group) {
            return new Subscriber(redisClient.duplicate()).subscribeAsync(channel.getPattern(group));
        }
    }
};

function setupLogging(options) {
    if (options.logger)
        logger.set(options.logger);

    else if (options.logLevel)
        logger.configure(log => log.setLevel(options.logLevel, false));
}