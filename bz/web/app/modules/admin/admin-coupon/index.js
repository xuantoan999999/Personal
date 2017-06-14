'use strict';

const CouponController = require('./controller/coupon.controller.js');
const CouponMid = require('./middleware/coupon.middleware.js');
const CouponVal = require('./validate/coupon.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.configManager;

    server.route({
        method: 'GET',
        path: '/coupon',
        handler: CouponController.getAll,
        config: {

        }
    });

    server.route({
        method: ['GET'],
        path: '/coupon/{id}',
        handler: CouponController.edit,
        config: {
            pre: [
                { method: CouponMid.getById, assign: 'coupon' }
            ]
        }
    });


    server.route({
        method: ['DELETE'],
        path: '/coupon/{id}',
        handler: CouponController.remove,
        config: {
            pre: [
                { method: CouponMid.getById, assign: 'coupon' }
            ]
        }
    });

    server.route({
        method: 'POST',
        path: '/coupon',
        handler: CouponController.create,
        config: {
            pre: [
                { method: CouponMid.getById, assign: 'coupon' }
            ],
            validate: CouponVal.post_method,
        }
    });

    server.route({
        method: 'PUT',
        path: '/coupon/{id}',
        handler: CouponController.update,
        config: {
            pre: [
                { method: CouponMid.getById, assign: 'coupon' }
            ],
            validate: CouponVal.post_method,
        }
    });

    next();
};

exports.register.attributes = {
    name: 'admin-coupon'
};