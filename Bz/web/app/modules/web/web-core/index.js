'use strict';

const CoreController = require('./controller/core.controller.js');

exports.register = function(server, options, next) {

    server.ext('onPostHandler', CoreController.createGuestToken);
    server.ext('onPostHandler', CoreController.getCredentials);
    server.ext('onPostHandler', CoreController.getSettings);
    server.ext('onPostHandler', CoreController.getPostCategories);
    server.ext('onPostHandler', CoreController.getMeta);
    server.ext('onPreResponse', CoreController.handleError);
    server.ext('onPreResponse', CoreController.getListCategories);
    server.ext('onPreResponse', CoreController.env);

    server.route({
        method: 'GET',
        path: '/error404',
        config: {
            handler: function(request, reply) {
                return reply.view('web/html/web-page/404', { meta: { title: 'Page Not Found' } }).code(404);
                // reply.view('web/html/core/404', { meta: { title: 'Page Not Found' } });
            }
        }
    });

    next();
};
exports.register.attributes = {
    name: 'core'
};