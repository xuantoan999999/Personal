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
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
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
    apply_products: [{
        type: Schema.ObjectId,
        ref: 'Product'
    }],
    status: {
        type: Number,
        default: 1
    }

},{ collection: 'coupons', timestamps: true });

 module.exports = mongoose.model('Coupon', CouponSchema);
