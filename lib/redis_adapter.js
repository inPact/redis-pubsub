'use strict';
const logger = require('./logger').getInstance();
const redis = require('redis');

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

        client.on('connect', () => logger.debug('Connected to redis server'));
        client.on('end', () => logger.debug('Redis connection closed'));
        client.on('error', (e) => logger.warn('Redis socket error: ', e.stack));

        return client;
    }
};

module.exports = adapter;