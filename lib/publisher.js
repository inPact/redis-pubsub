'use strict';
const uuid = require('uuid');

class Publisher {
    constructor(redis, channelBuilder){
        this.channelBuilder = channelBuilder;
        this.publisherId = uuid.v4().toString();
        this.redis = redis;
    }

    publish (message, subTopic, topic) {
        message = {
            headers: { timestamp: new Date() },
            message: message
        };

        let channel = this.channelBuilder.build(topic, subTopic, this.publisherId);
        this.redis.publish(channel.raw, JSON.stringify(message));
    }
}

module.exports = Publisher;