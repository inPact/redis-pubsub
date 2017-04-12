'use strict';
const log = require('loglevel');

module.exports = {
    getInstance: function () {
        return this.instance || log;
    },

    set: function (logger) {
        this.instance = logger;
    },

    configure: function (configure) {
        configure(this.getInstance());
    }
};