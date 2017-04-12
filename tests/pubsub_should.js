'use strict';
const should = require('chai').should();
let messagesReceived = 0;
let pubsub = require('../lib')({ logLevel: 'trace' });
let subscriber;

describe('pubsub', function () {
    beforeEach(function () {
        messagesReceived = 0;
    });

    afterEach(function () {
        if (subscriber)
            subscriber.unsubscribe();
    });

    it('should receive any event', function (done) {
        subscriber = pubsub.subscribe();
        subscriber.on('event', envelope => messagesReceived++);
        pubsub.publish({ some: 'data' }, 'an-event', 'group1');

        setTimeout(() => {
            messagesReceived.should.equal(1);
            done();
        }, 100);
    });

    it('should not receive events that weren\'t subscribed to', function (done) {
        subscriber = pubsub.subscribe('group2');
        subscriber.on('event', envelope => messagesReceived++);
        pubsub.publish({ some: 'data' }, 'an-event', 'group1');

        setTimeout(() => {
            messagesReceived.should.equal(0);
            done();
        }, 100);
    });

    it('should receive subscribed-to events', function (done) {
        subscriber = pubsub.subscribe('group1');
        subscriber.on('event', envelope => messagesReceived++);
        pubsub.publish({ some: 'data' }, 'an-event', 'group1');

        setTimeout(() => {
            messagesReceived.should.equal(1);
            done();
        }, 100);
    });
});
