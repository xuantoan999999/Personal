'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    customer_info: {
        customer: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            trim: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        phone: {
            type: String
        },
    },
    shipping_info: {
        agent: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        phone: {
            type: String
        },
        address: {
            type: String
        },
        province: {
            type: String
        },
        district: {
            type: String
        },
    },
    products: [{
        _id: false,
        product: {
            type: Schema.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
    }],
    coupon: {
        id: {
            type: Schema.ObjectId,
            ref: 'Coupon'
        },
        code: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        value: {
            type: Number,
            default: 0,
        }
    },
    payment_method: {
        type: String,
        enum: ['COD', 'ONLINE', 'CK']
    },
    type: {
        type: String,
        enum: ['XE', 'PT']  //Xe phụ kiện
    },
    status: {
        type: String,
        enum: ['NEW', 'SUCCESS', 'PROCCESS', 'GO', 'FINISH'],
        default: 'NEW'
    },
    total: {     //Tổng chưa sale
        type: Number,
        required: true,
    },
    total_pay: {     //Tổng phải trả sau sale
        type: Number,
        required: true,
    },
    total_deposit: {     //Tổng đặt cọc
        type: Number,
        required: true,
    },
    total_extant: {      //Tổng tiền còn lại
        type: Number,
        required: true,
    },
    note: {
        type: String
    },
}, {
        collection: 'orders',
        timestamps: true,
    });

OrderSchema.virtual('shipping_info.agent_obj', {
    ref: 'User',
    localField: 'shipping_info.agent',
    foreignField: '_id',
    justOne: true
});

OrderSchema.virtual('products.product_obj', {
    ref: 'Product',
    localField: 'products.product',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Order', OrderSchema);