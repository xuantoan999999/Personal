'use strict';

const IndexController = require('./controller/index.controller.js');
const IndexMiddleware = require('./middleware/index.middleware.js');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        handler: IndexController.index,
        config: {
            pre: [
            ],
            validate: {

            },
            tags: ['api'],
            description: 'Index page'
        },
    });
    next();
};

exports.register.attributes = {
    name: 'web-index'
};
