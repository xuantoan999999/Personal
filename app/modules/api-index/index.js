'use strict';

const indexController = require('./controller/index.controller.js');
const indexMiddleware = require('./middleware/index.middleware.js');

const internals = {
};

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/add-search',
        handler: indexController.addSearch,
        config: {
            pre: [
                { method: indexMiddleware.findSearch, assign: 'findSearch' },
            ],
        },

    });

    server.route({
        method: 'GET',
        path: '/search',
        handler: indexController.search,
    });

    server.route({
        method: 'GET',
        path: '/product-list',
        handler: indexController.productList,
    });

    next();
};

exports.register.attributes = {
    name: 'api-index'
};
