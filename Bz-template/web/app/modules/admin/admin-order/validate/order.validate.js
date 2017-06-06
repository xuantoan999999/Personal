"use strict";

var Joi = require('joi');

function userValidate() { };
userValidate.prototype = (function () {
    return {
        get_method: {

        },
        post_method: {
            payload: {
                customer_info: Joi.object().required().keys({
                    customer: Joi.string().allow(null).description('customer id'),
                    name: Joi.string().required().description('name customer'),
                    email: Joi.string().email().required().description('Email customer'),
                    phone: Joi.string().required().description('Phone'),
                }).description('customer_info'),
                shipping_info: Joi.object().required().keys({
                    agent: Joi.string().description('agent id'),
                    name: Joi.string().required().description('Tên đại lý'),
                    email: Joi.string().email().required().description('Email agent'),
                    phone: Joi.any().description('Phone'),
                    address: Joi.string().description('address agent'),
                    province: Joi.string().description('province agent'),
                    district: Joi.string().description('district agent'),
                }).description('shipping_info'),
                products: Joi.array().required().items(Joi.object().keys({
                    product: Joi.string().required().description('product id'),
                    qty: Joi.number().required().integer().min(0).description('qty product'),
                    price: Joi.number().required().integer().min(0).description('price product'),
                    total: Joi.number().integer().min(0).description('qty * product'),
                })).description('products'),
                coupon: Joi.object().keys({
                    id: Joi.string().allow(null).description('coupon id'),
                    code: Joi.string().allow('').description('code coupon'),
                    name: Joi.number().allow('').integer().min(0).description('qty product'),
                    value: Joi.number().integer().min(0).description('price product'),
                }).description('coupon'),
                status: Joi.string().description('status'),
                type: Joi.string().description('type'),
                payment_method: Joi.string().description('payment_method'),
                total: Joi.number().required().integer().min(0).description('tổng tiền hàng'),
                total_pay: Joi.number().integer().min(0).description('Tiền cần thanh toán'),
                total_deposit: Joi.number().integer().min(0).description('Tiền cọc'),
                total_extant: Joi.number().integer().min(0).description('Số tiên còn lại'),
            },
            options: {
                allowUnknown: true
            }
        },
        deleteItem: {

        }
    };
})();

var userVal = new userValidate();
module.exports = userVal;
