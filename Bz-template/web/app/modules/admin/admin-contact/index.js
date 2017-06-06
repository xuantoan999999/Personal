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
    });

    server.route({
        method: 'GET',
        path: '/contact/{id}',
        handler: ContactController.edit,
        config: {
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