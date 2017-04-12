'use strict';
const uuid = require('uuid');
const Channel = require('./channel');

class Publisher {
    constructor(redis){
        this.publisherId = uuid.v4().toString();
        this.redis = redis;
    }

    publish (data, event, group) {
        data = {
            headers: { timestamp: new Date() },
            message: data
        };

        let channel = Channel.build(group, event, this.publisherId);
        this.redis.publish(channel.raw, JSON.stringify(data));
    }
}

module.exports = Publisher;