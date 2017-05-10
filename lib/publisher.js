'use strict';
const uuid = require('uuid');
const Channel = require('./channel');

class Publisher {
    constructor(redis){
        this.publisherId = uuid.v4().toString();
        this.redis = redis;
    }

    publish (message, event, group) {
        message = {
            headers: { timestamp: new Date() },
            message: message
        };

        let channel = Channel.build(group, event, this.publisherId);
        this.redis.publish(channel.raw, JSON.stringify(message));
    }
}

module.exports = Publisher;