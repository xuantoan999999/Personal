'use strict';


const CoreController = require('./controller/core.controller.js');

exports.register = function(server, options, next) {
    server.route({
        method: 'GET',
        path: '/error404',
        config: {
            handler: function(request, reply) {
                reply.view('portal/html/portal-core/404', { meta: { title: 'Page Not Found' } });
            }
        }
    });
    server.ext('onPostHandler', CoreController.createGuestToken);
    server.ext('onPostHandler', CoreController.getCredentials);
    server.ext('onPreResponse', CoreController.handleError);
    next();
};
exports.register.attributes = {
    name: 'portal-core'
};