'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Banner = mongoose.model('Banner');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove
}

function getAll (request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage =  config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'i');
        options.title = re;
    }
    Banner.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
        if (err) {
            request.log(['error', 'list', 'banner'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });

}

function edit (request, reply) {
    const banner = request.pre.banner;
    if (banner) {
        return reply(banner);
    } else {
        reply(Boom.notFound('Banner is not found'));
    }
}

function save (request, reply) {
    let banner = new Banner(request.payload);
    let promise = banner.save();
    promise.then(function(banner) {
        reply(banner);
    }).catch(function(err) {
        request.log(['error', 'banner'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

    });
}

function update (request, reply) {
    let banner = request.pre.banner;
    banner = _.extend(banner, request.payload);
    let promise = banner.save();
    promise.then(function(banner) {
        reply(banner);
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const banner = request.pre.banner;
    banner.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        reply(banner);
    });
}