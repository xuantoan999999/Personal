'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const JWT = require('jsonwebtoken');
const aguid = require('aguid');
const crypto = require('crypto');

module.exports = {
    learnVue
};

function learnVue(request, reply) {
    let view = `admin/html/admin-learn-vue/vue-${request.params.page}`;
    return reply.view(view, {
        active_menu: 'learn-vue',
        active_sub_menu: `learn-vue-${request.params.page}`
    });
}