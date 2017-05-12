'use strict';
const logger = require('./logger');
const redis = require('./redis_adapter');
const Publisher = require('./publisher');
const Subscriber = require('./redis_subscriber');
const ChannelBuilder = require('./channel_builder');

/**
 * Creates a pubsub instance configured on the specified channel with the specified options.
 * @param [channel] - The channel on which to publish and receive events. Uses the default ("events")
 * channel if not provided.
 * @param [options] - Instantiation options.
 * @param [options.logger] - A logger to use instead of logLevel if desired.
 * @param [options.logLevel] - The minimum log level to pass to the logLevel logger.
 * @param [options.url] - Redis url.
 * @param [options.port] - Redis port if url was not defined.
 * @param [options.hostname] - Redis host name if url was not defined.
 * @returns {{publish: (function(this:Publisher)), publisher: Publisher, subscribe: subscribe, subscribeAsync: subscribeAsync}}
 */
module.exports = function (channel, options = {}) {
    if (arguments.length === 1 && typeof channel !== 'string') {
        options = channel;
        channel = 'events';
    }

    setupLogging(options);

    let channelBuilder = new ChannelBuilder(channel);
    let redisClient = redis.createClient(options);
    let publisher = new Publisher(redisClient, channelBuilder);

    return {
        publish: publisher.publish.bind(publisher),
        publisher: publisher,
        subscribe: function (topic) {
            return new Subscriber(redis.createClient(options), channelBuilder).subscribe(topic);
        },
        subscribeAsync: function (topic) {
            return new Subscriber(redis.createClient(options), channelBuilder).subscribeAsync(topic);
        }
    }
};

function setupLogging(options) {
    if (options.logger)
        logger.set(options.logger);

    else if (options.logLevel)
        logger.configure(log => log.setLevel(options.logLevel, false));
}