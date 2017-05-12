# redis-pubsub
A simple library for publishing and subscribing messages via redis

# release notes
## 0.3.0
* Added support for creating pub-sub instances that publish and subscribe on
custom channels (rather than just the default "events" channel). Among other things,
this is intended to allow versioning of pub/sub events.