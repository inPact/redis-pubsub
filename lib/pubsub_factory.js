'use strict';
const logger = require('./logger');
const PubSub = require('./pubsub');

/**
 * Creates a pubsub instance configured on the specified channel with the specified options.
 * @param [options] - Instantiation options.
 * @param [options.logger] - A logger to use instead of logLevel if desired.
 * @param [options.logLevel] - The minimum log level to pass to the logLevel logger.
 * @param [options.url] - Redis url.
 * @param [options.port] - Redis port if url was not defined.
 * @param [options.hostname] - Redis host name if url was not defined.
 * @returns {PubSub}
 */
module.exports = function (options = {}) {
    setupLogging(options);
    return new PubSub(options);
};

function setupLogging(options) {
    if (options.logger)
        logger.set(options.logger);

    else if (options.logLevel)
        logger.configure(log => log.setLevel(options.logLevel, false));
}

