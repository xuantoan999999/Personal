'use strict';

const ProductController = require('./controller/product.controller.js');
const ProductMid = require('./middleware/product.middleware.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/san-pham/{slug}',
        handler: ProductController.detail,
        config: {
            pre: [
            ],
        }
    });
    next();
};

exports.register.attributes = {
    name: 'web-product'
};
