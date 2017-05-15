'use strict';
const logger = require('./logger').getInstance();
const redis = require('redis');
const debug = require('debug')('redis-pubsub');

const adapter = {
    createClient: function (options = {}) {
        let client = null;

        if (options.url) {
            let parsed = require('redis-url').parse(options.url);
            client = redis.createClient(parsed.port, parsed.hostname, { return_buffers: true });

            if (parsed.password)
                client.auth(parsed.password);
        }
        else
            client = redis.createClient(
                options.port || 6379,
                options.hostname || 'localhost',
                { return_buffers: true });

        client.on('connect', () => debug(`Connected to redis server at ` +
                                         `${options.url || (client.options.host + ':' + client.options.port)}`));
        client.on('end', () => logger.warn('Redis connection closed'));
        client.on('error', (e) => logger.warn('Redis socket error: ', e.stack));

        return client;
    }
};

module.exports = adapter;