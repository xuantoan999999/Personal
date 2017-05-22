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

const Product = mongoose.model('Product');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');
const Banner = mongoose.model('Banner');

module.exports = {
    index,
};

function index(request, reply) {
    const Meta = request.server.plugins['service-meta'];
    let meta = JSON.parse(JSON.stringify(Meta.getMeta('home-page')));

    return reply.view('web-index/view/client/home/view', {
        meta
    }, { layout: 'web/layout' });
};