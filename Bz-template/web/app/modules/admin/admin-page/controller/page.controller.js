'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Page = mongoose.model('Page');
const _ = require('lodash');

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove
}
function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage =  config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    
    let options = {};
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'i');
        options.title = re;
    }
    Page.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
        if (err) {
            request.log(['error', 'list', 'page'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: '1', totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });
}

function edit(request, reply) {
    const page = request.pre.page;
    if (page) {
        return reply(page);
    } else {
        reply(Boom.notFound('Page is not found'));
    }
}

function save(request, reply) {
    let page = new Page(request.payload);
    let promise = page.save();
    promise.then(function(page) {
        reply(page);
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let page = request.pre.page;
    delete request.payload.id;
    delete request.payload._id;
    delete request.payload.__v;
    delete request.payload.created;

    page = _.extend(page, request.payload);
    let promise = page.save();
    promise.then(function(page) {
        reply(page);
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const page = request.pre.page;
    page.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(page);
    });
}
