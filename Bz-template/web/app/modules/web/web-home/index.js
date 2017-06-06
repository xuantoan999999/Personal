'use strict';

const HomeController = require('./controller/home.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/',
        handler: HomeController.home
    });
    server.route({
        method: 'GET',
        path: '/payment',
        handler: HomeController.payment
    });
    next();
};

exports.register.attributes = {
    name: 'web-home'
};
