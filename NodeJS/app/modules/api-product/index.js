'use strict';

const ProductController = require('./controller/product.controller.js');
const AclMiddleware = require(BASE_PATH + '/app/utils/middleware/Acl.mdw.js');
const ProductMiddlware = require('./../web-product/middleware/product.middlware.js');

const internals = {
};

exports.register = function (server, options, next) {
    var config = server.plugins['hapi-kea-config'];
    var configManager = server.configManager;
    
    server.route({
        method: 'GET',
        path: '/products/{slug}',
        handler: ProductController.getAll,
        config: {
            pre: [
                { method: ProductMiddlware.getCategory('slug'), assign: 'getCategory' },
            ],
            description: 'Get All Product',
            tags: ['api']
        }
    });

    next();
};

exports.register.attributes = {
    name: 'api-product'
};
