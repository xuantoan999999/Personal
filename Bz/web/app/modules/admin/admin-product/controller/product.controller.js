'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const asyncCao = require('async');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const Promise = require('bluebird');

const Product = mongoose.model('Product');

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove
}

function getAll(request, reply) {
    let config = request.server.configManager;
    let page = request.query.page || 1;
    let itemsPerPage = request.query.limit ? parseInt(request.query.limit) : config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};

    if (request.query.name) options.name = new RegExp(request.query.name, 'i');
    if (request.query.type) options.type = request.query.type;
    if (request.query.model) options.model = request.query.model;
    if (request.query.brand) options.brand = request.query.brand;
    if (request.query.supplier) options.supplier = request.query.supplier;
    if (request.query.age_car) options.age_car = request.query.age_car;
    if (request.query.status) options.status = Number(request.query.status);

    Product.find(options).populate('model brand supplier')
        .sort('id').lean().paginate(page, itemsPerPage, function (err, items, total) {
            if (err) {
                request.log(['error', 'list', 'category'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            let totalPage = Math.ceil(total / itemsPerPage);
            let dataRes = {
                status: 1,
                totalItems: total,
                totalPage,
                currentPage: page,
                itemsPerPage,
                numberVisiblePages,
                items
            };
            return reply(dataRes);
        });
}

function edit(request, reply) {
    const product = request.pre.product;
    if (product) {
        return reply({ data: product })
    } else {
        return reply(Boom.notFound('Product is not found'));
    }
}

function save(request, reply) {
    let product = new Product(request.payload);
    let slug = product.slug;

    let find_product = Product.findOne({ slug: product.slug }).lean();
    find_product.then(function (resp) {
        if (resp) return reply(Boom.badRequest('Product already exist.'));
        else {
            let promise = product.save();
            promise.then(function (product) {
                return reply(product);
            }).catch(function (err) {
                request.log(['error', 'product'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    })
}

function update(request, reply) {
    let product = request.pre.product;
    let new_product = request.payload;

    product = _.extend(product, new_product);
    let promise = product.save();

    let find_product = Product.findOne({
        slug: product.slug,
        _id: { $nin: [request.params.id] }
    }).lean();

    find_product.then(function (resp) {
        if (resp) return reply(Boom.badRequest('Product already exist.'));
        else {
            promise.then(function (product) {
                return reply(product);
            }).catch(function (err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    })
}

function remove(request, reply) {
    let product = request.pre.product;
    product.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(product);
    });
}

