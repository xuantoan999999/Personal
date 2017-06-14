'use strict';

const SettingController = require('./controller/setting.controller.js');
const SettingMid = require('./middleware/setting.middleware.js');
const SettingVal = require('./validate/setting.validate.js');


exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/setting',
        handler: SettingController.getAll,
    });

    server.route({
        method: 'GET',
        path: '/setting/{id}',
        handler: SettingController.edit,
        config: {
            pre: [
            { method: SettingMid.getById, assign: 'setting' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/setting',
        handler: SettingController.save,
        config: {
            validate: SettingVal.save,
            description: 'Create setting',
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
        path: '/setting/{id}',
        handler: SettingController.update,
        config: {
            validate: SettingVal.update,
            pre: [
            { method: SettingMid.getById, assign: 'setting' }
            ],
            description: 'Update setting',
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
        path: '/setting/{id}',
        handler: SettingController.remove,
        config: {
            pre: [
            { method: SettingMid.getById, assign: 'setting' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/setting/download',
        handler: SettingController.download,
        config: {
            description: 'Download setting',
            /*tags: ['api'],*/
            plugins: {
                'hapi-swagger': {
                    responses: {
                        '400': {
                            'description': 'Bad Request'
                        }
                    },
                    payloadType: 'form'
                }
            },
        },
    });

    next();
};

exports.register.attributes = {
    name: 'admin-setting'
};