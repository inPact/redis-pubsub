'use strict';

class ChannelPattern {
    constructor(pattern) {
        if (!pattern)
            return;

        this.pattern = pattern;
        this.parts = pattern.split('.');
    }

    get subTopicsPattern(){
        return this.pattern ? this.pattern + '.*' : '*';
    }

    get parentTopicsPattern(){
        return '*.' + this.pattern;
    }

    static parse(raw) {
        return new ChannelPattern(raw.toString());
    }

    static build(...topicParts) {
        let channel = new ChannelPattern();
        channel.parts = topicParts;
        channel.pattern = topicParts.join('.');

        return channel;
    }
}

module.exports = ChannelPattern;