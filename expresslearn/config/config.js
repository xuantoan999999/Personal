'use strict';


let config = {
    port: 2200,
    redisOptions: {
        host: '127.0.0.1',
        port: 6379,
        detect_buffers: true
    },
    db: {
        uri: 'mongodb://localhost/mhv_test',
    },
};

module.exports = config;