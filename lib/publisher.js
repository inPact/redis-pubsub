'use strict';
const uuid = require('uuid');
const logger = require('./logger').getInstance();

class Publisher {
    constructor(redis){
        this.publisherId = uuid.v4().toString();
        this.redis = redis;
    }

    publish (message, pattern) {
        logger.debug(`PUBLISHER: publishing message to channel ${pattern}`);
        this.redis.publish(pattern, JSON.stringify(message));
    }
}

module.exports = Publisher;