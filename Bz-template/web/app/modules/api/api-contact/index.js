'use strict';

const ContactController = require('./controller/contact.controller.js');
const ContactVal = require('./validate/contact.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];
    
    server.route({
        method: 'GET',
        path: '/contact',
        handler: ContactController.index,
        config: {
            auth: false,
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'POST',
        path: '/contact',
        handler: ContactController.contact,
        config: {
            auth: false,
            validate: ContactVal.contact,
            description: 'Handle Contact Form Submitted',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: {'400': {'description': 'Bad Request'}},
                    payloadType: 'form'
                }
            },
        }
    });
    
    next();
};

exports.register.attributes = {
    name: 'api-contact'
};
