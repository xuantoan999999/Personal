'use strict';

const Boom = require('boom');
const util = require('util');
const Joi = require('joi');
const mongoose = require('mongoose');
const Contact = mongoose.model('Contact');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');
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
        options.name = re;
    }
    Contact.find(options).sort('id').paginate(page, itemsPerPage, function(err, items, total) {
        if (err) {
            request.log(['error', 'list', 'contact'], err);
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        let totalPage = Math.ceil(total / itemsPerPage);
        let dataRes = { status: 1, totalItems: total, totalPage: totalPage, currentPage: page, itemsPerPage: itemsPerPage, numberVisiblePages: numberVisiblePages, items: items };
        reply(dataRes);
    });


}

function edit(request, reply) {
    const contact = request.pre.contact;
    if (contact) {
        return reply(contact);
    } else {
        reply(Boom.notFound('Contact is not found'));
    }
}

function save(request, reply) {
    let contact = new Contact(request.payload);
    let promise = contact.save();
    promise.then(function(contact) {
        reply(contact);
    }).catch(function(err) {
        request.log(['error', 'contact'], err);
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function update(request, reply) {
    let contact = request.pre.contact;
    contact = _.extend(contact, request.payload);
    let promise = contact.save();
    promise.then(function(contact) {
        reply(contact);
    }).catch(function(err) {
        reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
    });
}

function remove(request, reply) {
    const contact = request.pre.contact;
    contact.remove((err) => {
        if (err) {
            reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)));
        }
        return reply(contact);
    });
}
