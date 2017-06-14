'use strict';

const CategoryController = require('./controller/category.controller.js');
const CategoryMid = require('./middleware/category.middleware.js');
const CategoryVal = require('./validate/category.validate.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/category',
        handler: CategoryController.getAll,
    });

    server.route({
        method: 'GET',
        path: '/category/{id}',
        handler: CategoryController.edit,
        config: {
            pre: [
            { method: CategoryMid.getById, assign: 'category' }
            ]
        }
    });

    server.route({
        method: 'DELETE',
        path: '/category/{id}',
        handler: CategoryController.remove,
        config: {
            pre: [
            { method: CategoryMid.getById, assign: 'category' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/category',
        handler: CategoryController.save,
        config: {
            validate: CategoryVal.save,
            description: 'Created category',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: {'400': {'description': 'Bad Request'}},
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/category/{id}',
        handler: CategoryController.update,
        config: {
            validate: CategoryVal.update,
            pre: [
            { method: CategoryMid.getById, assign: 'category' }
            ],
            description: 'Update category',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: {'400': {'description': 'Bad Request'}},
                    payloadType: 'form'
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-category'
};