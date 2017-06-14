'use strict';

const DashboardController = require('./controller/dashboard.controller.js');

exports.register = function(server, options, next) {

    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/',
        handler: DashboardController.index,
        config: {
            auth: {
                strategy: 'jwt-admin',
                mode: 'try',
                scope: ['guest','user', 'admin', 'agent', 'supplier']
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-dashboard'
};