'use strict';
const debug = require('debug')('redis-pubsub');

class Publisher {
    constructor(redis){
        this.redis = redis;
    }

    publish (message, channel) {
        debug(`PUBLISHER: publishing message to channel ${channel}`);
        this.redis.publish(channel, JSON.stringify(message));
    }
}

module.exports = Publisher;