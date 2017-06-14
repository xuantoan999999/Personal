'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Coupon Schema
 */
var CouponSchema = new Schema({

    code: {
        type: String,
        required: true,
        index: true,
        unique: "Code is already exists",
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    user_times: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
    },
    times: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
    },

    type_coupon: {
        type: String,
        enum: ['MN', 'PC'],
        required: true,
        trim: true,
        default: 'MN'
    },
    value: {
        type: Number,
        required: true,
        default: 0
    },
    apply_time: {
        is_apply_time: {
            type: Boolean,
            default: false
        },
        start_date: {
            type: Date,
        },
        end_date: {
            type: Date,
        }
    },
    apply_product: {
        is_apply_product: {
            type: Boolean,
            default: false
        },
        products: [
            {
                type: Schema.ObjectId,
                ref: 'Product'
            }
        ]
    },
    status: {
        type: Number,
        default: 1
    }

}, { collection: 'coupons', timestamps: true });

CouponSchema.virtual('apply_product.product_obj', {
    ref: 'Product',
    localField: 'apply_product.products',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Coupon', CouponSchema);
