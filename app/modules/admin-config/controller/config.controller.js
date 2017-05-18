'use strict';

const Boom = require('boom');
const mongoose = require('mongoose');
const ConfigModel = mongoose.model('Config');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const orderHelper = require(BASE_PATH + '/app/modules/api-order/util/order.js');
const _ = require('lodash');
const slug = require('slug');

module.exports = {
    getAll,
    edit,
    save,
    update,
    deleteItem,
    getConfigsCustom
}

function getAll(request, reply) {
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = parseInt(request.query.limit) || config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');

    let options = {};

    if (request.query.keyword && request.query.keyword.length > 0) {
        let keyword = request.query.keyword;
        let slug_keyword = slug(keyword);

        options.$or = [
            {
                name: new RegExp(keyword, 'i')
            },
            {
                description: new RegExp(keyword, 'i')
            },
            {
                description: new RegExp(slug_keyword, 'i')
            }
        ];
    }
    if (typeof request.query.id !== "undefined")
        options.id = request.query.id;
    ConfigModel.find(options).paginate(page, 10, function (err, items, total) {
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
    const config = request.pre.config;

    if (config) {
        return reply(config);
    } else {
        reply(Boom.notFound('ConfigModel is not found'));
    }
}


function save(request, reply) {
    let config = new ConfigModel(request.payload);
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'save',
        'config',
        JSON.stringify({ new: config, old: null }),
        'add new config'
    );

    let promise = config.save();
    promise.then(function (config) {
        reply(config);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let config = request.pre.config;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'update',
        'config',
        JSON.stringify({ new: _.extend(config, request.payload), old: config }),
        'update config'
    );

    config = _.extend(config, request.payload);
    let promise = config.save();
    promise.then(function (config) {
        reply(config);
    }).catch(function (err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function deleteItem(request, reply) {
    const config = request.pre.config;
    request.auditLog.logEvent(
        request.auth.credentials.uid,
        'mongoose',
        'delete',
        'config',
        JSON.stringify({ new: null, old: config }),
        'delete config'
    );
    config.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(config);
    });
}

function getConfigsCustom(request, reply) {
    orderHelper.getConfigs().then(function (resp) {
        return reply(resp);
    }).catch(function (err) {

    })
}