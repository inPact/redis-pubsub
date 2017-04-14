'use strict';
const should = require('chai').should();

let messagesReceived = 0;
let pubsub = require('../lib')({ logLevel: 'trace' });

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
});