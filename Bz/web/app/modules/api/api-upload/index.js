'use strict';

const UploadController = require('./controller/upload.controller.js');
const UploadVal = require('./validate/upload.validate.js');

exports.register = function (server, options, next) {
    
    var upload = require('./util/upload')(server);
    server.expose(upload);

    server.route({
        method: 'GET',
        path: '/upload',
        handler: UploadController.index,
        config: {
            auth: false,
            description: 'Service status',
            tags: ['api']
        }
    });

    server.route({
        method: 'POST',
        path: '/upload/image',
        handler: UploadController.uploadImage,
        config: {
            auth: false,
            validate: UploadVal.uploadImage,
            payload: {
                maxBytes: 10048576,
                parse: true,
                allow: 'multipart/form-data',
                output: 'stream'
            },
            description: 'Handle Upload File',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responses: { '400': { 'description': 'Bad Request' } },
                    payloadType: 'form'
                }
            },
        }
    });

    next();
};

exports.register.attributes = {
    name: 'api-upload'
};
