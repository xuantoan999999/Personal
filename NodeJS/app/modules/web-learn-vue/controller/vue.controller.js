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
    let view = 'admin/html/admin-learn-vue/view/client/vue-' + request.params.i + '/view';
    return reply.view(view, {
        active_menu: 'learn-vue',
        active_sub_menu :  'learn-vue-${}'
    }, { layout: 'web/layout' });
};