'use strict';
const should = require('chai').should();

let messagesReceived = 0;
let pubsubFactory = require('../lib/pubsub_factory');
let pubsub = pubsubFactory({ logLevel: 'trace' });

describe('pubsub', function () {
    beforeEach(function () {
        messagesReceived = 0;
    });

    it('should receive any event', function (done) {
        pubsub.subscribeAsync().then(subscriber => {
            subscriber.on('event', envelope => messagesReceived++);
            pubsub.publish({ some: 'data' }, 'an-event', 'group1');

            setTimeout(() => {
                messagesReceived.should.equal(1);
                subscriber.unsubscribe(done);
            }, 100);
        })
    });

    it('should not receive events that weren\'t subscribed to', function (done) {
        pubsub.subscribeAsync('group2').then(subscriber => {
            subscriber.on('event', envelope => messagesReceived++);
            pubsub.publish({ some: 'data' }, 'an-event', 'group1');

            setTimeout(() => {
                messagesReceived.should.equal(0);
                subscriber.unsubscribe(done);
            }, 100);
        })
    });

    it('should receive subscribed-to events', function (done) {
        pubsub.subscribeAsync('group1').then(subscriber => {
            subscriber.on('event', envelope => messagesReceived++);
            pubsub.publish({ some: 'data' }, 'an-event', 'group1');

            setTimeout(() => {
                messagesReceived.should.equal(1);
                subscriber.unsubscribe(done);
            }, 100);
        })
    });

    it('should subscribe to different event groups', function (done) {
        let group1MessagesReceived = 0;
        let group2MessagesReceived = 0;

        pubsub.subscribeAsync('group1').then(subscriber1 => {
            pubsub.subscribeAsync('group2').then(subscriber2 => {
                subscriber1.on('event', envelope => group1MessagesReceived++);
                subscriber2.on('event', envelope => group2MessagesReceived++);

                pubsub.publish({ some: 'data' }, 'an-event', 'group1');
                pubsub.publish({ some: 'data' }, 'an-event', 'group1');
                pubsub.publish({ some: 'data' }, 'an-event', 'group2');

                setTimeout(() => {
                    subscriber1.unsubscribe();
                    subscriber2.unsubscribe();

                    group1MessagesReceived.should.equal(2);
                    group2MessagesReceived.should.equal(1);

                    done();
                }, 100);
            })
        })
    });

    it('should subscribe to different channels', function (done) {
        let channel1MessagesReceived = 0;
        let channel2MessagesReceived = 0;

        let pubsub1 = pubsub;
        let pubsub2 = pubsubFactory('customChannel', { logLevel: 'trace' });

        pubsub1.subscribeAsync('group1').then(subscriber1 => {
            pubsub2.subscribeAsync('group1').then(subscriber2 => {
                subscriber1.on('event', envelope => channel1MessagesReceived++);
                subscriber2.on('event', envelope => channel2MessagesReceived++);

                pubsub1.publish({ some: 'data' }, 'an-event', 'group1');
                pubsub1.publish({ some: 'data' }, 'an-event', 'group1');
                pubsub2.publish({ some: 'data' }, 'an-event', 'group1');
                pubsub2.publish({ some: 'data' }, 'an-event', 'group2');

                setTimeout(() => {
                    subscriber1.unsubscribe();
                    subscriber2.unsubscribe();

                    channel1MessagesReceived.should.equal(2);
                    channel2MessagesReceived.should.equal(1);

                    done();
                }, 100);
            })
        })
    });
});