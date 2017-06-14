'use strict';

const UserController = require('./controller/user.controller.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/login',
        handler: UserController.login
        
    });
    server.route({
        method: 'GET',
        path: '/register',
        handler: UserController.register
        
    });
    server.route({
        method: 'GET',
        path: '/account',
        handler: UserController.account,
        config: {
            auth: {
                strategy: 'jwt',
                scope: ['user', 'admin']
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/changepassword',
        handler: UserController.changepassword
        
    });
    server.route({
        method: 'GET',
        path: '/forgot',
        handler: UserController.forgot
        
    });
    server.route({
        method: 'GET',
        path: '/reset',
        handler: UserController.reset
    });

    next();
};

exports.register.attributes = {
    name: 'web-user'
};
