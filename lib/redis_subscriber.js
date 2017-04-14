'use strict';
const Promise = require('bluebird');
const logger = require('./logger').getInstance();
const EventEmitter = require('events').EventEmitter;
const Channel = require('./channel');

class Subscriber extends EventEmitter {
    constructor(redis) {
        super();
        this.redis = redis;

        let self = this;
        this.onMessage = function (pattern, channel, message) {
            logger.debug(`SUBSCRIBER: received pmessage on channel ${channel}`);
            let parsed = Channel.parse(channel);
            let data = JSON.parse(message);
            self.emit('event', { channel: parsed, data: data });
        };

        this.redis.on('pmessage', this.onMessage);
        this.redis.on('psubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: psubscribe: ${count} subscribers on pattern ${pattern}`));
        this.redis.on('punsubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: punsubscribe: ${count} subscribers on pattern ${pattern}`));
    }

    subscribe(channelPattern, callback) {
        this.channelPattern = channelPattern;
        this.redis.psubscribe(channelPattern);

        if (!callback)
            return this;

        this.redis.once('psubscribe', () => callback(null, this));
    }

    unsubscribe(callback) {
        if (!this.channelPattern)
            throw new Error('SUBSCRIBER: Cannot unsubscribe as nothing was subscribed to.');

        this.redis.punsubscribe(this.channelPattern);

        if (!callback)
            return this;

        this.redis.once('punsubscribe', () => callback(null, this));
    }
}

Promise.promisifyAll(Subscriber.prototype);
module.exports = Subscriber;