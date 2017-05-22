'use strict';
const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var asyncCao = require('async');
var Promise = require('bluebird');

module.exports = {
    pngtojpg,
};

function pngtojpg(request, reply) {
    return reply({ success: true });
};