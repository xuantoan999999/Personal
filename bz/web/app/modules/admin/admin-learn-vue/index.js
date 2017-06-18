'use strict';

const LearnVueController = require('./controller/learnVue.controller.js');

exports.register = function (server, options, next) {
    server.route({
        method: ['GET'],
        path: '/learn-vue/{page}',
        handler: LearnVueController.learnVue,
        config: {
            auth: false
        }
    });

    next();
};
exports.register.attributes = {
    name: 'admin-learn-vue'
};