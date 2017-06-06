'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
    index,
    uploadImage
};

function index(request, reply) {
    return reply({ status: true, msg: 'It works' });
}

function uploadImage(request, reply) {
    var configManager = request.server.configManager;
    var data = request.payload;
    var uploadSteam = data.file;

    var fileName = data.filename || data.file.hapi.filename;
    var uploadPath = configManager.get('web.upload.path');
    var subFolder = data.type;
    var uploadUtil = request.server.plugins['api-upload'];

    uploadUtil.upload(uploadSteam, fileName, uploadPath, subFolder, data.old_filename).then((fileInfo) => {
        return reply({ file: fileInfo });
    })
    .catch(err => {
        request.log(['error', 'upload'], err);
        return reply(Boom.badRequest(err));
    });
}