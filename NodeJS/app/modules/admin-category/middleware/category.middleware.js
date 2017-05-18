'use strict';

const mongoose = require('mongoose');
const Category = mongoose.model('Category');

module.exports = {
    getById,
    getBySlug,
    getAll,
}

/**
 * Middleware
 */
function getById(request, reply) {
    const id = request.params.id || request.payload.id;
    let promise = Category.findOne({ _id: id });
    promise.then(function (categories) {
        reply(categories);

    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function getBySlug(request, reply) {
    const slug = request.params.slug || request.payload.slug;
    let promise = Category.findOne({ slug: slug });
    promise.then(function (categories) {
        reply(categories);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}

function getAll(request, reply) {
    let promise = Category.find().lean();;
    promise.then(function (categories) {
        reply(categories);
    }).catch(function (err) {
        request.log(['error'], err);
        return reply.continue();
    });
}