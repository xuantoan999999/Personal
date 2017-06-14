'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const _ = require('lodash');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
    getAll,
    edit,
    create,
    update,
    remove,
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};

    if (request.query.keyword && request.query.keyword.length > 0) {
        let reg = new RegExp(request.query.keyword, 'i');
        options.$or = [];
        options.$or.push({ 'code': reg });
        options.$or.push({ 'name': reg });
    }

    if (request.query.status && request.query.status.length > 0) {
        options.status = request.query.status;
    }

    Coupon.find(options).sort('-createdAt').populate('apply_products_objectproduct_obj').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });

}

function edit(request, reply) {
    const coupon = request.pre.coupon;
    if (coupon) {
        return reply(coupon)
    } else {
        return reply(Boom.notFound('Coupon is not found'));
    }
}

function create(request, reply) {
    let coupon = new Coupon(request.payload);

    let promise = coupon.save();
    promise.then(function (coupon) {
        return reply(coupon);
    }).catch(function (err) {
        request.log(['error', 'coupon'], err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let coupon = request.pre.coupon;
    if (coupon) {
        coupon = _.extend(coupon, request.payload);
        let promise = coupon.save();
        promise.then(function (coupon) {
            return reply(coupon);
        }).catch(function (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
    }
    else
        return reply(Boom.badRequest('Coupon not found'));

}

function remove(request, reply) {
    const coupon = request.pre.coupon;

    coupon.remove((err) => {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(coupon);
    });
}