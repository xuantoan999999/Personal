'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var slug = require('slug');
/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Category name',
        trim: true
    },
    slug: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['product', 'post', 'banner', 'brand', 'model']
    },
    status: {
        type: Number,
        default: 1
    },
    link: {
        type: String
    },
    attrs: {
        title: String,
        description: String,
        keyword: String
    }
}, { collection: 'categories', timestamps: true });

CategorySchema.index({ slug: 1 });

CategorySchema.pre('update', function (next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    next();
});
CategorySchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = slug(this.name);
    }
    this.slug = this.slug.toLowerCase();
    next();
});

// Virtual Category
CategorySchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'model',
});

CategorySchema.virtual('productsBrand', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'brand',
});

module.exports = mongoose.model('Category', CategorySchema);
