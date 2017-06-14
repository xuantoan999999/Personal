'use strict';

const PageController = require('./controller/page.controller.js');
const PageMid = require('./middleware/page.middleware.js');
const PageVal = require('./validate/page.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;
    var cmsprefix = configManager.get('web.context.cmsprefix');

    server.route({
        method: 'GET',
        path: '/page',
        handler: PageController.getAll,
    });

    server.route({
        method: 'GET',
        path: '/page/{id}',
        handler: PageController.edit,
        config: {
            pre: [
            { method: PageMid.getById, assign: 'page' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/page',
        handler: PageController.save,
        config: {
            validate: PageVal.save,
            description: 'Create page',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        }
    });

    server.route({
        method: ['PUT', 'POST'],
        path: '/page/{id}',
        handler: PageController.update,
        config: {
            validate: PageVal.update,
            pre: [
            { method: PageMid.getById, assign: 'page' }
            ],
            description: 'Update page',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/page/{id}',
        handler: PageController.remove,
        config: {
            pre: [
            { method: PageMid.getById, assign: 'page' }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-page'
};