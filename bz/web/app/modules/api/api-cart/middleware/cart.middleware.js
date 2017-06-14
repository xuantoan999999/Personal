'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
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

    let promise = Product.findOne({ '_id': id }).select('price_user price_agent deposit attrs color  detail_infor engine_number gallery model name nsx odd short_description slug status thumb vehical_number _id').populate('brand model');
    promise.then(function (product) {
        reply(product);
    }).catch(function (err) {
        reply.continue();
    })
}