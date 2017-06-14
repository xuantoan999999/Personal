"use strict";

var Joi = require('joi');

function couponValidate() { };
couponValidate.prototype = (function () {
    return {
        get_method: {

        },
        post_method: {
            payload: {
                code: Joi.string().required().description('Code'),
                name: Joi.string().required().description('name'),
                user_times: Joi.number().required().integer().min(0),
                times: Joi.number().required().integer().min(0),
                apply_time: Joi.object().keys({
                    is_apply_time: Joi.boolean().description('is_apply_time'),
                    start_date: Joi.date().description('start_date'),
                    end_date: Joi.date().description('end_date'),
                }).description('apply_time'),
                apply_products: Joi.object().keys({
                    is_apply_product: Joi.boolean().description('is_apply_product'),
                    products: Joi.array().description('products'),
                }).description('products apply'),
                type_coupon: Joi.string().required().description('type'),
                value: Joi.number().required().integer().min(0),
                status: Joi.number().description('status'),
            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var couponVal = new couponValidate();
module.exports = couponVal;
