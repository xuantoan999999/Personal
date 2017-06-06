'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const regexp = require(BASE_PATH + '/app/utils/regexp');

module.exports = {
    getById,
}

/**
 * Middleware
 */

function getById(request, reply) {
    let id = request.params.id;
    if (!id && request.payload)
        id = request.payload.id ? request.payload.id : null;

    let promise = Order.findOne({ '_id': id }).populate('products.product');
    promise.then(function (order) {
        reply(order);
    }).catch(function (err) {
        reply.continue();
    })
}