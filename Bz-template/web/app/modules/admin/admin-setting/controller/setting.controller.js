'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Setting = mongoose.model('Setting');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
const _ = require('lodash');
const fs = require("fs");

module.exports = {
    getAll,
    edit,
    save,
    update,
    remove,
    download
}

function getAll(request, reply) {
    let credentials = request.auth.credentials;
    let page = request.query.page || 1;
    let config = request.server.configManager;
    let itemsPerPage = config.get('web.paging.itemsPerPage');
    let numberVisiblePages = config.get('web.paging.numberVisiblePages');
    let options = {};
    if (request.query.keyword && request.query.keyword.length > 0) {
        let re = new RegExp(request.query.keyword, 'i');
        options.key = re;
    }
    Setting
    .find(options)
    .sort('id')
    .paginate(page, itemsPerPage, function(err, items, total) {
        if (err) {
            request.log(['error', 'list', 'setting'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = {
            status: 1,
            totalItems: total,
            totalPage: totalPage,
            currentPage: page,
            itemsPerPage: itemsPerPage,
            numberVisiblePages: numberVisiblePages,
            items: items
        };
        reply(dataRes);
    });
}

function edit(request, reply) {
    const setting = request.pre.setting;
    if (setting) {
        return reply(setting);
    } else {
        reply(Boom.notFound('Setting is not found'));
    }
}

function save(request, reply) {
    let credentials = request.auth.credentials;
    let setting = new Setting(request.payload);
    let promise = setting.save();
    promise.then(function(setting) {
        reply(setting);
    }).catch(function(err) {
        request.log(['error', 'setting'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));

    });
}

function update(request, reply) {
    /*var {mongoCache} = request.server.plugins['admin-core'];*/
    let credentials = request.auth.credentials;
    /*if (credentials.scopes.indexOf('superadmin') > -1) */
    /*{*/
        let setting = request.pre.setting;
        setting = _.extend(setting, request.payload);
        let promise = setting.save();
        promise.then(function(setting) {
            /*mongoCache.directDelete(`Setting:${setting.key},${setting.status}`);*/
            reply(setting);
        }).catch(function(err) {
            console.log("Err", err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        });
        /*}*/
    }

    function download(request, reply) {
        Setting.find().lean().then(function(settings) {
            var result = {};
            settings.forEach(function(setting) {
                result[setting.key] = {
                    type: setting.value_type,
                    value: setting.value
                };
            });
            fs.writeFileSync('settings.json', JSON.stringify(result), null, 4);
            return reply.file('settings.json');
        });
    }

    function remove(request, reply) {
        const setting = request.pre.setting;
        setting.remove((err) => {
            if (err) {
                reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
            }
            reply(setting);
        });
    }
