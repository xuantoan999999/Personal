'use strict';

const PostController = require('./controller/post.controller.js');
const PostMid = require('./middleware/post.middleware.js');
const PostVal = require('./validate/post.validate.js');

exports.register = function(server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/post',
        handler: PostController.getAll,
        config: {
            pre: [
            { method: PostMid.getOptions, assign: 'options' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/post',
        handler: PostController.save,
        config: {
            validate: PostVal.save,
            description: 'Created post',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/post/{id}',
        handler: PostController.edit,
        config: {
            pre: [
            { method: PostMid.getById, assign: 'post' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/post/{id}',
        handler: PostController.update,
        config: {
            pre: [
            { method: PostMid.getById, assign: 'post' }
            ],
            validate: PostVal.update,
            description: 'Update post',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            }
        }
    });

    server.route({
        method: ['DELETE'],
        path: '/post/{id}',
        handler: PostController.remove,
        config: {
            pre: [
            { method: PostMid.getById, assign: 'post' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/post/moveToTrash',
        handler: PostController.moveToTrash,
        config: {
            pre: [
            { method: PostMid.getById, assign: 'post' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/post/changeStatus',
        handler: PostController.changeStatus,
        config: {
            pre: [
            { method: PostMid.getById, assign: 'post' }
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/post/changeStatusMultiRows',
        handler: PostController.changeStatusMultiRows,
        config: {
            pre: [
            { method: PostMid.getRowsSelect, assign: 'currentSelect' },
            ]
        }
    });

    server.route({
        method: 'PUT',
        path: '/post/deleteMultiRows',
        handler: PostController.deleteMultiRows,
        config: {
            pre: [
            { method: PostMid.getRowsSelect, assign: 'currentSelect' },
            ]
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-post'
};