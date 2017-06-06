'use strict';

const OrderController = require('./controller/order_api.controller.js');

exports.register = function (server, options, next) {

    var Payment = require('./util/payment.util.js');
    server.expose('Payment', new Payment(server) );

    server.route({
        method: 'GET',
        path: '/filter-agent/{province}/{district?}',
        handler: OrderController.filterAgent,
        config: {
            auth: false,
            description: 'Filter agent by province & district',
            tags: ['api'],
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'api-order'
};
