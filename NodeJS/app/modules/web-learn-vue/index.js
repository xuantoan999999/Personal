'use strict';

const VueController = require('./controller/vue.controller.js');
const VueMiddleware = require('./middleware/vue.middleware.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/learn-vue/{page}',
        handler: VueController.learn,
        config: {
            pre: [
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Vue page'
        },
    });
    next();
};

exports.register.attributes = {
    name: 'web-vue'
};
