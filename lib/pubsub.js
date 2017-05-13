'use strict';
const Pattern = require('./channel_pattern');
const Subscriber = require('./redis_subscriber');
const redis = require('./redis_adapter');
const Publisher = require('./publisher');

module.exports = class PubSֳub {
    constructor(options) {
        let redisClient = redis.createClient(options);
        this.publisher = new Publisher(redisClient);
    }

    publish (message, pattern) {
        return this.publisher.publish(message, pattern);
    }

    getPattern(...parts) {
        return Pattern.build(...parts);
    }

    onAny(pattern, listener) {
        return this.on(new Pattern(pattern).subTopicsPattern, listener);
    }

    on(pattern, listener) {
        return this.subscribeAsync(pattern).then(subscriber => {
            subscriber.onMessage(listener);
            return subscriber;
        })
    }

    subscribe(pattern) {
        return new Subscriber(redis.createClient(this.options)).subscribe(pattern);
    }

    subscribeAsync(pattern) {
        return new Subscriber(redis.createClient(this.options)).subscribeAsync(pattern);
    }
};