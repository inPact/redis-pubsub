'use strict';
const Promise = require('bluebird');
const logger = require('./logger').getInstance();
const EventEmitter = require('events').EventEmitter;

class Subscriber extends EventEmitter {
    constructor(redis, channelBuilder) {
        super();
        this.redis = redis;
        this.channelBuilder = channelBuilder;

        let self = this;
        this.onMessage = function (pattern, channel, envelope) {
            logger.debug(`SUBSCRIBER: received pmessage on channel ${channel}`);
            let parsed = self.channelBuilder.parse(channel);
            let data = JSON.parse(envelope);
            self.emit('event', { channel: parsed, message: data.message });
        };

        this.redis.on('pmessage', this.onMessage);
        this.redis.on('psubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: psubscribe: ${count} subscribers on pattern ${pattern}`));
        this.redis.on('punsubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: punsubscribe: ${count} subscribers on pattern ${pattern}`));
    }

    subscribe(topic, callback) {
        this.channelPattern = this.channelBuilder.getPattern(topic);
        this.redis.psubscribe(this.channelPattern);

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

    onMessage(listener) {
        this.on('event', listener);
    }
}

Promise.promisifyAll(Subscriber.prototype);
module.exports = Subscriber;