# redis-pubsub
A simple library for publishing and subscribing messages via redis

# release notes
### 0.4.3
* fix subscriber bug (redis options weren't getting passed to subscriber)
* publisher (and associated redis connection) is now created lazily on demand
* debug logs and cleanup

### 0.4.2
* Additional information on the Channel object (event name, topic)

### 0.4.1
* Subscribers now receive a Channel object in the received message

## 0.4.0
* (Breaking changes)
  * Removed channel, group, and event concepts: The library now accepts any pattern,
  and provides basic support for a topic-ish API via the PubSub.getPattern function and the
  PubSub.onAny subscription helper, though neither need be used.
  * The ChannelPattern helper now delimits topics with dots rather than hash-signs, to more closely
  resemble AMQP style patterns.
  * ES6 now required (rest and spread operators)
  * publisher ID is no longer automatically appended to channels
* Simplified event registration with the PubSub.on function, so that consumers do not need
  to first acquire a Subscriber instance, though the PubSub.on and PubSub.onAny function return
  the Subscriber instance in case consumers wish to unsubscribe later.

## 0.3.0
* (Breaking changes) Added support for creating pub-sub instances that publish and subscribe on
custom channels (rather than just the default "events" channel). Among other things,
this is intended to allow versioning of pub/sub events.
* More standard import API via the root index.js file