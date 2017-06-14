'use strict';

const NotifyController = require('./controller/notify.controller.js');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/notify',
        handler: NotifyController.home
    });
    next();
};

exports.register.attributes = {
    name: 'web-notify'
};
