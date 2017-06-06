'use strict';

const OrderrController = require('./controller/order.controller.js');
const OrderrMid = require('./middleware/order.middleware.js');
const OrderrVal = require('./validate/order.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/order',
        handler: OrderrController.getAll,
        config: {

        }
    });

    server.route({
        method: ['GET'],
        path: '/order/{id}',
        handler: OrderrController.edit,
        config: {
            pre: [
                { method: OrderrMid.getById, assign: 'order' }
            ]
        }
    });


    server.route({
        method: ['DELETE'],
        path: '/order/{id}',
        handler: OrderrController.remove,
        config: {
            pre: [
                { method: OrderrMid.getById, assign: 'order' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/order',
        handler: OrderrController.create,
        config: {
            pre: [
                { method: OrderrMid.getById, assign: 'order' }
            ],
            validate: OrderrVal.post_method,
        }
    });

    server.route({
        method: 'PUT',
        path: '/order/{id}',
        handler: OrderrController.update,
        config: {
            pre: [
                { method: OrderrMid.getById, assign: 'order' }
            ],
            validate: OrderrVal.post_method,
        }
    });

    server.route({
        method: 'GET',
        path: '/order/init-data/{id?}',
        handler: OrderrController.getDataInit,
        config: {
            pre: [
                { method: OrderrMid.getById, assign: 'order' }
            ],
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-order'
};