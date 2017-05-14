'use strict';
const Promise = require('bluebird');
const logger = require('./logger').getInstance();
const EventEmitter = require('events').EventEmitter;
const ChannelPattern = require('./channel_pattern');

class Subscriber extends EventEmitter {
    constructor(redis) {
        super();
        this.redis = redis;

        let self = this;
        let onMessage = function (pattern, channel, message) {
            logger.debug(`SUBSCRIBER: received pmessage on channel ${channel}`);
            let data = JSON.parse(message);
            channel = new ChannelPattern(channel.toString(), pattern.toString());
            self.emit('event', { channel: channel, message: data });
        };

        this.redis.on('pmessage', onMessage);
        this.redis.on('psubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: psubscribe: ${count} subscribers on pattern ${pattern}`));
        this.redis.on('punsubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: punsubscribe: ${count} subscribers on pattern ${pattern}`));
    }

    subscribe(pattern, callback) {
        this.pattern = pattern;
        this.redis.psubscribe(pattern);

        if (!callback)
            return this;

        this.redis.once('psubscribe', () => callback(null, this));
    }

    unsubscribe(callback) {
        if (this.pattern == null)
            throw new Error('SUBSCRIBER: Cannot unsubscribe as nothing was subscribed to.');

        this.redis.punsubscribe(this.pattern);

        if (!callback)
            return this;

        this.redis.once('punsubscribe', () => callback(null, this));
    }

    onMessage(listener) {
        this.on('event', listener);
    }
}

Promise.promisifyAll(Subscriber.prototype);
module.exports = Subscriber;