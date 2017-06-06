'use strict';

const MessageController = require('./controller/message.controller.js');
const MessageMid = require('./middleware/message.middleware.js');
const MessageVal = require('./validate/message.validate.js');

exports.register = function (server, options, next) {
    
    server.route({
        method: 'GET',
        path: '/message',
        handler: MessageController.getAll,
    });

    server.route({
        method: ['GET'],
        path: '/message/add',
        handler: MessageController.add,
    });

    server.route({
        method: 'GET',
        path: '/message/{id}',
        handler: MessageController.edit,
        config: {
            pre: [
            { method: MessageMid.getById, assign: 'message' }
            ]
        }
    });

    server.route({
        method: 'DELETE',
        path: '/message/{id}',
        handler: MessageController.remove,
        config: {
            pre: [
            { method: MessageMid.getById, assign: 'message' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/message',
        handler: MessageController.save,
        config: {
            validate: MessageVal.save,
            description: 'Created message',
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
        path: '/message/{id}',
        handler: MessageController.update,
        config: {
            validate: MessageVal.update,
            pre: [
            { method: MessageMid.getById, assign: 'message' }
            ],
            description: 'Update message',
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
    name: 'web-message'
};
