'use strict';
const logger = require('./logger').getInstance();
const EventEmitter = require('events').EventEmitter;
const Channel = require('./channel');

module.exports = class extends EventEmitter {
    constructor(redis, channelPattern) {
        super();
        this.channelPattern = channelPattern;
        this.redis = redis;

        let self = this;
        this.onMessage = function (pattern, channel, message) {
            logger.debug(`SUBSCRIBER: received pmessage on channel ${channel}`);
            let parsed = Channel.parse(channel);
            let data = JSON.parse(message);
            self.emit('event', { channel: parsed, data: data });
        };

        redis.on('pmessage', this.onMessage);
        redis.on('psubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: psubscribe: ${count} subscribers on pattern ${pattern}`));
        redis.on('punsubscribe', (pattern, count) => logger.debug(`SUBSCRIBER: punsubscribe: ${count} subscribers on pattern ${pattern}`));

        redis.psubscribe(channelPattern);
    }

    unsubscribe(){
        this.redis.punsubscribe(this.channelPattern);
        this.redis.removeListener('pmessage', this.onMessage);
    }
};
