'use strict';

const ApiCouponController = require('./controller/coupon_api.controller.js');
const CouponVal = require('./validate/coupon.validate.js');

exports.register = function (server, options, next) {
    var configManager = server.plugins['hapi-kea-config'];

    server.route({
        method: 'POST',
        path: '/check-coupon/{code}',
        handler: ApiCouponController.checkCoupon,
        config: {
            auth: false,
            description: 'api check Coupon',
            tags: ['api']
        }
    });

    next();
};

exports.register.attributes = {
    name: 'api-coupon'
};
