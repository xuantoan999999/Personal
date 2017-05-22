'use strict';

const PNGController = require('./controller/png.controller.js');

exports.register = function (server, options, next) {

    next();
};

exports.register.attributes = {
    name: 'web-png'
};
