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

const Category = mongoose.model('Category');

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
    if (request.query.status) options.status = Number(request.query.status);

    Category.find(options).sort('id').paginate(page, itemsPerPage, function (err, items, total) {
        if (err) {
            request.log(['error', 'list', 'category'], err);
            return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        return reply(dataRes);
    });
}

function edit(request, reply) {
    const category = request.pre.category;
    if (category) {
        return reply({ data: category })
    } else {
        reply(Boom.notFound('Category is not found'));
    }
}

function getById_ref(ID) {
    return Category.findOne({ '_id': ID }, (err, category) => {
        if (!err) {
            return category;
        } else {
            return [];
        }
    });
}

function save(request, reply) {
    let category = new Category(request.payload);
    let slug = category.slug;
    var uploadUtil = request.server.plugins['api-upload'];

    let find_category = Category.findOne({ slug: category.slug }).lean();
    find_category.then(function (resp) {
        if (resp) return reply(Boom.badRequest('Category already exist.'));
        else {
            let promise = category.save();
            promise.then(function (category) {
                return reply(category);
            }).catch(function (err) {
                request.log(['error', 'category'], err);
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    })
}

function update(request, reply) {
    let category = request.pre.category;
    let new_category = request.payload;
    var uploadUtil = request.server.plugins['api-upload'];
    let slug = new_category.slug;

    category = _.extend(category, new_category);
    let promise = category.save();

    let find_category = Category.findOne({
        slug: category.slug,
        _id: { $nin: [request.params.id] }
    }).lean();

    find_category.then(function (resp) {
        if (resp) return reply(Boom.badRequest('Category already exist.'));
        else {
            promise.then(function (category) {
                return reply(category);
            }).catch(function (err) {
                return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            });
        }
    })
}

function remove(request, reply) {
    const category = request.pre.category;
    category.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(category);
    });
}

