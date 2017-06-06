'use strict';

const BannerController = require('./controller/banner.controller.js');
const BannerMid = require('./middleware/banner.middleware.js');
const BannerVal = require('./validate/banner.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/banner',
        handler: BannerController.getAll,
    });

    server.route({
        method: 'GET',
        path: '/banner/{id}',
        handler: BannerController.edit,
        config: {
            pre: [
            { method: BannerMid.getById, assign: 'banner' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/banner',
        handler: BannerController.save,
        config: {
            validate: BannerVal.save,
            description: 'Create banner',
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
        path: '/banner/{id}',
        handler: BannerController.update,
        config: {
            validate: BannerVal.update,
            pre: [
            { method: BannerMid.getById, assign: 'banner' }
            ],
            description: 'Update banner',
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
        path: '/banner/{id}',
        handler: BannerController.remove,
        config: {
            pre: [
            { method: BannerMid.getById, assign: 'banner' }
            ]
        }
    });
    
    next();
};

exports.register.attributes = {
    name: 'admin-banner'
};