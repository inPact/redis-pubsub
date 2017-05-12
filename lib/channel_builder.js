'use strict';

class Channel {
    constructor(eventsChannel) {
        this.eventsChannel = eventsChannel;
        let pattern = eventsChannel + '#([\\w\\-]+)#([\\w\\-]+)(#from:([\\w\\-]+))?';
        this.channelRegex = new RegExp(pattern, 'i');
    }

    parse(raw) {
        raw = raw.toString();
        let channel = { raw: raw };
        let match = raw.match(this.channelRegex);

        if (match) {
            if (match.length > 0)
                channel.group = match[1];
            if (match.length > 1)
                channel.event = match[2];
            if (match.length > 3)
                channel.publisher = match[4];
        }

        return channel;
    }

    build(topic, subTopic, publisher) {
        let channel = { group: topic, event: subTopic };
        channel.raw = this.getPattern(topic, subTopic);

        if (publisher) {
            channel.publisher = publisher;
            channel.raw += `#from:${publisher}`;
        }

        return channel;
    }

    /**
     * @param [topic]
     * @param [subTopic]
     * @returns {string}
     */
    getPattern(topic, subTopic) {
        let pattern = this.eventsChannel + '#' + (topic || '*');

        if (topic)
            pattern += '#' + (subTopic || '*');

        return pattern;
    }
}

module.exports = Channel;