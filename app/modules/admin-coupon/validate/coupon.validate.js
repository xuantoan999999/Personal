"use strict";

var Joi = require('joi');

function CouponValidate() { };
CouponValidate.prototype = (function () {
    return {
        edit: {
            params: {
                id: Joi.string().description('Id')
            }
        },
        save: {
            payload: {
                code: Joi.string().required().description("Code"),
                code_group: Joi.array().items(Joi.object().keys({
                    code: Joi.string().allow(''),
                    user_times: Joi.number(),
                    times: Joi.number(),
                })).description('List Images'),
                type: Joi.string(),
                name: Joi.string().required().description("Name"),
                type_apply: Joi.string().required().description("Type Apply"),
                status: Joi.string().description("Status"),
                count: Joi.boolean().description('Modified'),
                used_times_count: Joi.number().description('Count used times'),
                user_times: Joi.number().description('User times'),
                times: Joi.number().description('Times'),
                internal: Joi.object().keys({
                    is_internal: Joi.boolean(),
                    start_date: Joi.allow(),
                    end_date: Joi.allow(),
                }),
                sale: Joi.object().keys({
                    is_money: Joi.boolean(),
                    money_value: Joi.allow(),
                    is_percent: Joi.boolean(),
                    percent_value: Joi.allow(),
                }),
                apply_product: Joi.object().keys({
                    is_product: Joi.boolean(),
                    products: Joi.allow(),
                }),
                apply_district: Joi.object().keys({
                    is_district: Joi.boolean(),
                    district: Joi.allow(),
                }),
                apply_order: Joi.object().keys({
                    is_order: Joi.boolean(),
                    money: Joi.allow(),
                }),

                apply_sub_product: Joi.object().keys({
                    is_sub_product: Joi.boolean(),
                    products: Joi.allow(),
                }),

                // updatedAt: Joi.date().allow('').description('Updated'),
                // createdAt: Joi.date().allow('').description('Created'),
                // _id: Joi.string().description('MongoID'),
                // __v: Joi.any().optional().description('Version Key'),
            }
        },
        update: {
            payload: {
                code: Joi.string().required().description("Code"),
                code_group: Joi.allow(),
                name: Joi.string().required().description("Name"),
                type: Joi.string().required().description("Type Coupon"),
                status: Joi.string().description("Status"),
                count: Joi.boolean().description('Modified'),
                used_times_count: Joi.number().description('Count used times'),
                user_times: Joi.number().description('User times'),
                type_apply: Joi.string().required().description("Type Apply"),
                times: Joi.number().description('Times'),
                internal: Joi.object().keys({
                    is_internal: Joi.boolean(),
                    start_date: Joi.allow(),
                    end_date: Joi.allow(),
                }),
                sale: Joi.object().keys({
                    is_money: Joi.boolean(),
                    money_value: Joi.allow(),
                    is_percent: Joi.boolean(),
                    percent_value: Joi.allow(),
                }),
                apply_product: Joi.object().keys({
                    is_product: Joi.boolean(),
                    products: Joi.allow(),
                }),
                apply_district: Joi.object().keys({
                    is_district: Joi.boolean(),
                    district: Joi.allow(),
                }),
                apply_order: Joi.object().keys({
                    is_order: Joi.boolean(),
                    money: Joi.allow(),
                }),
                apply_sub_product: Joi.object().keys({
                    is_sub_product: Joi.boolean(),
                    products: Joi.allow(),
                }),

                updatedAt: Joi.date().allow('').description('Updated'),
                createdAt: Joi.date().allow('').description('Created'),
                _id: Joi.string().description('MongoID'),
                __v: Joi.any().optional().description('Version Key'),
            }
        }
    };
})();

var couponValidate = new CouponValidate();
module.exports = couponValidate;