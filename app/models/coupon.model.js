'use strict';
const prefixCollection = global.config.web.db.prefixCollection || '';
const _ = require('lodash');
const elasticsearch = require('elasticsearch');
const Bluebird = require('bluebird');
const mongoosastic = require('mongoosastic');
const auditLog = require('audit-log');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcrypt');

var CouponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: "Code is already exists",
        trim: true
    },

    code_group: [{
        code: {
            type: String,
            trim: true
        },
        user_times: {
            type: Number,
            default: 1,
            min: 0,
        },
        times: {
            type: Number,
            default: 1,
            min: 0,
        },
    }],

    name: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: ['single', 'group'],
        default: 'single'
    },

    status: {
        type: String,
        trim: true,
        enum: ['inactive', 'active'],
        default: 'active'
    },

    user_times: {
        type: Number,
        default: 1,
        min: 0,
    },

    times: {
        type: Number,
        default: 1,
        min: 0,
    },

    internal: {
        is_internal: {
            type: Boolean
        },
        start_date: {
            type: Date,
            default: null
        },
        end_date: {
            type: Date,
            default: null
        }
    },

    sale: {
        is_money: {
            type: Boolean,
            default: false
        },
        money_value: {
            type: Number,
            default: 0
        },
        is_percent: {
            type: Boolean,
            default: false
        },
        percent_value: {
            type: Number,
            default: 0
        }
    },

    type_apply: {//Loại giảm giá
        type: String,
        enum: ['product', 'order'], //cho từng sản phẩm / cho tổng đơn hàng
        default: 'product'
    },

    apply_district: { // apply cho địa chỉ giao hàng nào
        is_district: {
            type: Boolean,
            default: false
        },
        district: [{
            type: Schema.ObjectId,
            ref: 'ShippingFee'
        }]
    },

    apply_product: { // apply cho danh mục nào
        is_product: {
            type: Boolean,
            default: false
        },
        products: [{
            type: Schema.ObjectId,
            ref: 'Category'
        }]
    },

    apply_order: { // apply cho order có giá trị từ bao nhiêu
        is_order: {
            type: Boolean,
            default: false
        },
        money: {
            type: Number,
            default: 0
        }
    },

    apply_sub_product: { // không apply cho sản phẩm nào
        is_sub_product: {
            type: Boolean,
            default: false
        },
        products: [{
            type: Schema.ObjectId,
            ref: 'Product'
        }]
    }
}, {
        collection: prefixCollection + 'coupon',
        timestamps: true
    });

/******************************************************************
Virtual Populate
*******************************************************************/

// Virtual Product
CouponSchema.virtual('order', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'id_coupon'
});

CouponSchema.virtual('order_group', {
    ref: 'Order',
    localField: 'code_group._id',
    foreignField: 'id_coupon'
});

let Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;