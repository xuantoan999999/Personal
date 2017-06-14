'use strict';

const CategoryController = require('./controller/category.controller.js');
const CategoryMid = require('./middleware/category.middleware.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'GET',
        path: '/danh-muc/{slug}',
        handler: CategoryController.list,
        config: {
            pre: [
                { method: CategoryMid.getCategory('brand'), assign: 'categoryBrand' }
            ],
        }
    });
    next();
};

exports.register.attributes = {
    name: 'web-category'
};
