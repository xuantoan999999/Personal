'use strict';

const CheckoutController = require('./controller/checkout.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/thanh-toan',
        handler: CheckoutController.checkout
    });

    next();
};

exports.register.attributes = {
    name: 'web-checkout'
};
