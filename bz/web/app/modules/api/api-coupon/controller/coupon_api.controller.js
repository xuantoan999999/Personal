'use strict';

const Boom = require('boom');
const Joi = require('joi');
const mongoose = require('mongoose');
const Coupon = mongoose.model('Coupon');
const Order = mongoose.model('Order');
const aguid = require('aguid');
let CouponUtil = require('./../util/coupon.util.js');
const ErrorHandler = require(BASE_PATH + '/app/utils/error.js');

module.exports = {
    checkCoupon,
};

function checkCoupon(request, reply) {
    let order = Order(request.payload);
    let coupon = request.params.code;
    let couponUtil = new CouponUtil(coupon, order);
    couponUtil.checkCoupon().then(res => {
        return reply(res);
    }).catch(err => {
        return reply(Boom.badRequest(ErrorHandler.getErrorMessage(err)))
    });
}
