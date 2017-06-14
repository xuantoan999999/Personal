'use strict';

const ContactController = require('./controller/contact.controller.js');
const ContactMid = require('./middleware/contact.middleware.js');
const ContactVal = require('./validate/contact.validate.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/contact',
        handler: ContactController.getAll,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/contact/{id}',
        handler: ContactController.edit,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            },
            pre: [
            { method: ContactMid.getById, assign: 'contact' }
            ]
        }
    });

    server.route({
        method: 'DELETE',
        path: '/contact/{id}',
        handler: ContactController.remove,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            },
            pre: [
            { method: ContactMid.getById, assign: 'contact' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/contact',
        handler: ContactController.save,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            },
            validate: ContactVal.save,
            description: 'Created contact',
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
        path: '/contact/{id}',
        handler: ContactController.update,
        config: {
            auth: {
                strategy: 'jwt-admin',
                scope: ['admin']
            },
            validate: ContactVal.update,
            pre: [
            { method: ContactMid.getById, assign: 'contact' }
            ],
            description: 'Update contact',
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
    name: 'admin-contact'
};