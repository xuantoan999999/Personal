'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
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
    getDataInit
};

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.type && request.query.type.length > 0) {
        options.type = request.query.type;
    }
    if (request.query.keyword && request.query.keyword.length > 0) {
        let reg = new RegExp(request.query.keyword, 'i');
        options.$or = [];
        options.$or.push({ 'customer_info.name': reg });
        options.$or.push({ 'customer_info.email': reg });
        options.$or.push({ 'customer_info.phone': reg });

        options.$or.push({ 'shipping_info.name': reg });
        options.$or.push({ 'shipping_info.email': reg });
        options.$or.push({ 'shipping_info.phone': reg });
        options.$or.push({ 'shipping_info.address': reg });
    }

    if (request.query.status && request.query.status.length > 0) {
        options.status = request.query.status;
    }

    Order.find(options).sort('-createdAt').populate('products.product_obj shipping_info.agent_obj').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });

}


function edit(request, reply) {
    const order = request.pre.order;
    if (order) {
        return reply(order)
    } else {
        return reply(Boom.notFound('Order is not found'));
    }
}

function create(request, reply) {
    let order = new Order(request.payload);

    let promise = order.save();
    promise.then(function (order) {
        return reply(order);
    }).catch(function (err) {
        request.log(['error', 'order'], err);
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let order = request.pre.order;

    order = _.extend(order, request.payload);
    ;
    let promise = order.save();
    promise.then(function (order) {
        return reply(order);
    }).catch(function (err) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const order = request.pre.order;

    order.remove((err) => {
        if (err) {
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(order);
    });
}

function getDataInit(request, reply) {
    const order = request.pre.order;
    let getData = async(function () {
        let vehicles = await(Product.find({ type: 'XE', status: 1 }).lean().exec());

        // Lấy các phụ kiện không có trong đơn hàng phụ kiện
        let accessoriesOpts = { type: 'PT', status: 1 };
        if (order && order.type == "PT") {
            accessoriesOpts._id = {
                "$nin": order.products.map(item => {
                    return item.product
                })
            }
        }
        let accessories = await(Product.find(accessoriesOpts).lean().exec());
        let users = await(User.find({
            'roles': {
                $in: ['user', 'admin']
            }, status: 1
        }, 'name address province district').lean().exec());
        let agents = await(User.find({
            'roles': {
                $in: ['agent']
            }, status: 1
        }, 'name phone address email province district').lean().exec());

        let dataRes = { vehicles, accessories, users, agents, order };
        return dataRes;
    });

    getData().then(function (res) {
        return reply(res);
    }).catch(function (err) {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    })
}