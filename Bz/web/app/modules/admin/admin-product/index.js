'use strict';

const ProductController = require('./controller/product.controller.js');
const ProductMid = require('./middleware/product.middleware.js');
const ProductVal = require('./validate/product.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/product',
        handler: ProductController.getAll,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/product/{id}',
        handler: ProductController.edit,
        config: {
            pre: [
                { method: ProductMid.getById, assign: 'product' }
            ],
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/product/{id}',
        handler: ProductController.remove,
        config: {
            pre: [
                { method: ProductMid.getById, assign: 'product' }
            ],
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/product',
        handler: ProductController.save,
        config: {
            validate: ProductVal.save,
            description: 'Created product',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/product/{id}',
        handler: ProductController.update,
        config: {
            validate: ProductVal.update,
            pre: [
                { method: ProductMid.getById, assign: 'product' }
            ],
            description: 'Update product',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-product'
};