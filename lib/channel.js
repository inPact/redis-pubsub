'use strict';

class Channel {
    static parse(raw) {
        raw = raw.toString();
        let channel = { raw: raw };
        let match = raw.match(/events#([\w\-]+)#([\w\-]+)(#from:([\w\-]+))?/i);

        if (match.length > 0)
            channel.group = match[1];
        if (match.length > 1)
            channel.event = match[2];
        if (match.length > 3)
            channel.publisher = match[4];

        return channel;
    }

    static build(group, event, publisher) {
        let channel = { group: group, event: event };
        channel.raw = this.getPattern(group, event);

        if (publisher) {
            channel.publisher = publisher;
            channel.raw += `#from:${publisher}`;
        }

        return channel;
    }

    /**
     * @param [group]
     * @param [event]
     * @returns {string}
     */
    static getPattern(group, event) {
        let pattern = 'events#' + (group || '*');

        if (group)
            pattern += '#' + (event || '*');

        return pattern;
    }
}

Channel.patterns = {
    allEvents: 'events#*',
};

module.exports = Channel;