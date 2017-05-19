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
    learn,
};

function learn(request, reply) {
    let view = 'web-learn-vue/view/client/vue-' + request.params.page + '/view';
    return reply.view(view, {
        
    }, { layout: 'web/layout' });
};