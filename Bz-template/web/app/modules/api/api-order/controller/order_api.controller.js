'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const User = mongoose.model('User');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    filterAgent,
};


function filterAgent(request, reply) {
    let options = {};
    if (request.params.province) {
        options.province = request.params.province;
    }
    if (request.params.district) {
        options.district = request.params.district;
    }
    options.roles = {
        $in: ['agent']
    }
    options.status = 1;


    User.find(options, 'name phone address email province district').lean().exec().then(function (data) {
        return reply({
            success: true,
            data: data
        });
    }).catch(function (err) {
        return reply({
            success: false,
            data: [],
            message: ErrorHandler.getErrorMessage(err)
        });
    });
}
