'use strict';

const SearchController = require('./controller/search.controller.js');
const SearchMid = require('./middleware/search.middleware.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/tim-kiem',
        handler: SearchController.search,
        config: {
            pre: [
            ],
        }
    });
    next();
};

exports.register.attributes = {
    name: 'web-search'
};
