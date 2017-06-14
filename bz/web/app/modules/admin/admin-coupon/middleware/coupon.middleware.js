'use strict';

const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
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
        id = request.payload._id ? request.payload._id : null;
    let promise = Coupon.findOne({ '_id': id }).populate('apply_product.product_obj');
    promise.then(function (coupon) {
        reply(coupon);
    }).catch(function (err) {
        reply.continue();
    })
}