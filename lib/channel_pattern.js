'use strict';
const _ = require('lodash');

class ChannelPattern {
    constructor(channel, pattern) {
        channel = channel || '';
        this.channel = channel;
        this.pattern = pattern;
    }

    get subTopicsPattern() {
        return this.channel ? this.channel + '.*' : '*';
    }

    get parentTopicsPattern() {
        return '*.' + this.channel;
    }

    /**
     * Returns the published channel
     * @returns {String}
     */
    get topic() {
        return this.channel;
    }

    /**
     * Returns the part of the topic path that begins after the registered base-pattern.
     * For example, if the registered pattern was 'a.b.*' and the published topic was 'a.b.c.d',
     * the event part of the path would be 'c'.
     * @returns {String}
     */
    get event() {
        return this.subTopics[0];
    }

    /**
     * Returns the subtopics of the received message relative to the topic path that was registered to.
     * For example, if the registration pattern was a.b.* and the received message topic was a.b.c.d,
     * returns ['b', 'c'].
     * @returns {*}
     */
    get subTopics() {
        if (this.channel && this.pattern) {
            let patternRegex = createPatternRegex(this.pattern);
            let match = patternRegex.exec(this.channel);
            if (match) {
                let subTopics = _.trim(this.channel.substring(match.index + match[0].length), '.');
                return subTopics.split('.');
            }
        }
        return [];
    }

    toString() {
        return this.channel;
    }

    static parse(raw) {
        return new ChannelPattern(raw.toString());
    }

    static build(...topicParts) {
        return new ChannelPattern(topicParts.filter(x => x).join('.'));
    }
}

function createPatternRegex(pattern) {
    let append = '';
    if (_.endsWith(pattern, '.*'))
        pattern = pattern.substring(0, pattern.length - 2);
    if (_.endsWith(pattern, '*')) {
        pattern = pattern.substring(0, pattern.length - 1);
        append = '[^.]*';
    }

    return new RegExp(pattern.replace('.', '\\.').replace('*', '.+').replace('?', '.{1}') + append)
}

module.exports = ChannelPattern;