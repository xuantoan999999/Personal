'use strict';

const PageController = require('./controller/page.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/about',
        handler: PageController.about
    });
    server.route({
        method: 'GET',
        path: '/faq',
        handler: PageController.faq
    });
    server.route({
        method: 'GET',
        path: '/term',
        handler: PageController.term
    });

    server.route({
        method: 'GET',
        path: '/help',
        handler: PageController.help
    });
    server.route({
        method: 'GET',
        path: '/support',
        handler: PageController.support
    });

    server.route({
        method: 'GET',
        path: '/error404',
        handler: PageController.error404
    });

    server.route({
        method: 'GET',
        path: '/html/{slug}',
        handler: PageController.html
    });
    next();
};

exports.register.attributes = {
    name: 'web-page'
};