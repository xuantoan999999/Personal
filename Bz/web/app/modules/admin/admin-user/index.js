'use strict';

const UserController = require('./controller/user.controller.js');
const UserMid = require('./middleware/user.middleware.js');
const UserVal = require('./validate/user.validate.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/user',
        handler: UserController.getAll,
        config: {
            pre: [
            { method: UserMid.getOptions, assign: 'options' }
            ]
        }
    });

    server.route({
        method: ['GET'],
        path: '/user/{id}',
        handler: UserController.edit,
        config: {
            pre: [
            { method: UserMid.getById, assign: 'user' }
            ]
        }
    });

    server.route({
        method: ['GET'],
        path: '/user/change-status/{id}/{status}',
        handler: UserController.changeStatus,
    });

    server.route({
        method: ['DELETE'],
        path: '/user/{id}',
        handler: UserController.remove,
        config: {
            pre: [
            { method: UserMid.getById, assign: 'user' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/user',
        handler: UserController.save,
        config: {
            pre: [
            { method: UserMid.getUserByEmail, assign: 'userByEmail' }
            ],
            validate: UserVal.save,
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        handler: UserController.update,
        config: {
            pre: [
            { method: UserMid.getById, assign: 'user' }
            ],
            validate: UserVal.update,
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/moveToTrash',
        handler: UserController.moveToTrash,
        config: {
            pre: [
            { method: UserMid.getById, assign: 'user' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/changeStatus',
        handler: UserController.changeStatus,
        config: {
            pre: [
            { method: UserMid.getById, assign: 'user' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/changeStatusMultiRows',
        handler: UserController.changeStatusMultiRows,
        config: {
            pre: [
            { method: UserMid.getRowsSelect, assign: 'currentSelect' },
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/user/deleteMultiRows',
        handler: UserController.deleteMultiRows,
        config: {
            pre: [
            { method: UserMid.getRowsSelect, assign: 'currentSelect' },
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-user'
};