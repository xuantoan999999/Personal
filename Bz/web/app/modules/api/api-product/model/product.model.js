'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Product Schema
 */
var ProductSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill name',
        trim: true
    },
    slug: {
        type: String,
        required: 'Please fill slug',
        trim: true
    },
    brand: { // Hãng xe: Suzuki, Honda, ..
        type: Schema.ObjectId,
        ref: 'Category',
        required: 'Please fill brand'
    },
    model: { // Loại xe: Nake, Sport,...
        type: Schema.ObjectId,
        ref: 'Category',
        required: 'Please fill model'
    },
    type: {
        type: String,
        enum: ['XE', 'PT'],
        required: 'Please fill type'
    },

    // Xe
    age_car: {
        type: String,
        enum: ['new', 'old'],
        default: 'new'
    },
    cc: {
        type: String,
    },
    nsx: { //Ngày sản xuất
        type: Date,
    },
    vehical_number: {   //Số khung
        type: String,
        trim: true
    },

    engine_number: {   //Số máy (Engine Number)
        type: String,
        trim: true
    },
    odd: {          //Tổng hành trình
        type: String,
    },
    supplier: {
        type: Schema.ObjectId,
        ref: 'User',
    },
    price_user: {
        type: Number,
        required: true,
    },
    price_agent: {
        type: Number,
        required: true,
    },
    deposit: {  //tiền cọc
        type: Number,
        required: true,
    },
    gearup_fee: {  //Chi phí cho GearUp
        type: Number,
        required: true,
    },
    color: [{
        value: {
            type: String,
            // enum:['white','black'],
            required: true,
            trim: true
        },
        name: {
            type: String, // default lấy slug value
            required: true,
            trim: true
        },
        image: {
            type: String,
            required: true,
            trim: true
        }
    }],
    thumb: {
        url: {
            type: String,
            required: true,
            trim: true
        }
    },
    gallery: [{
        url: {
            type: String,
            required: true,
            trim: true
        }
    }],
    engine_detail: {
        type: Object,
    },
    bone_frame_detail: {
        type: Object,
    },
    size_detail: {
        type: Object
    },
    // feature: {
    //     url: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     }
    // },

    // Phụ tùng
    sku: {   //Part number (SKU)
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0
    },

    status: {
        type: Number,
        default: 1
    },
    short_description: {
        type: String
    },
    detail_infor: {
        type: String
    },

    // Chung
    attrs: {
        title: String,
        description: String,
        keyword: String
    }
}, { collection: 'products', timestamps: true });

ProductSchema.index({ slug: 1 });

ProductSchema.pre('update', function (next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
ProductSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
module.exports = mongoose.model('Product', ProductSchema);
